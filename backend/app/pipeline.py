"""Kebdti pipeline: speech -> text -> feeling-aware translation -> speech.

  ASR        Gemini (audio input) via Straitly; fallback: Gemini on the free Google keys
  Translate  GPT-6 Luna via Straitly, prompt v4.3 (eval/prompts_v4.py), thinking "low"
  TTS        Gemini TTS on the free Google keys (rotating), voice chosen per speaker
             (ElevenLabs voice cloning can replace this later: see tts())
"""
import base64
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "eval"))
load_dotenv(ROOT / ".env")

import prompts_v4 as prompts  # noqa: E402
from bench_translate import extract_json  # noqa: E402

LANG_NAMES = {"fr": "French", "es": "Spanish", "it": "Italian", "en": "English", "darija": "Moroccan Darija"}
TRANSLATE_MODEL = "gpt-6-luna"
ASR_MODEL = "gemini-3.8-flash"
TTS_MODELS = ["gemini-3.8-flash-tts", "gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts"]
# Gemini prebuilt voices (no cloning): a warm older voice for grandparents, younger voices for grandchildren.
VOICES = {"grandmother": "Sulafat", "elder_f": "Sulafat", "grandfather": "Gacrux", "girl": "Leda", "boy": "Puck"}


_straitly_blocked_until = 0.0


def luna(messages, max_tokens):
    """GPT-6 Luna through the fastest working provider. Order from LUNA_ORDER (default: ZenMux, then Straitly).
    Each try is capped at 25 s, so one slow provider can't hold a grandmother's message for a minute."""
    global _straitly_blocked_until
    order = [x.strip() for x in os.environ.get("LUNA_ORDER", "zenmux,straitly").split(",") if x.strip()]
    providers = {
        "zenmux": ("https://zenmux.ai/api/v1", "ZENMUX_API_KEY", "openai/" + TRANSLATE_MODEL),
        "straitly": ("https://api.straitly.ai/v1", "STRAITLY_API_KEY", TRANSLATE_MODEL),
    }
    last = None
    for i, name in enumerate(order):
        if name not in providers or (name == "straitly" and time.time() < _straitly_blocked_until):
            continue
        url, key, model = providers[name]
        if not os.environ.get(key):
            continue
        final = i == len(order) - 1
        try:
            c = OpenAI(base_url=url, api_key=os.environ[key], timeout=60 if final else 25, max_retries=1 if final else 0)
            return c.chat.completions.create(model=model, messages=messages, max_tokens=max_tokens, reasoning_effort="low")
        except Exception as e:   # blocked, slow or down: next provider
            last = e
            if name == "straitly" and ("402" in str(e) or "cap" in str(e).lower()):
                _straitly_blocked_until = time.time() + 1800
    raise RuntimeError(f"translation failed on every provider: {str(last)[:200]}")


def straitly():
    return OpenAI(base_url="https://api.straitly.ai/v1", api_key=os.environ["STRAITLY_API_KEY"], timeout=120, max_retries=1)


def google_keys():
    ks = [k.strip() for k in os.environ.get("GEMINI_API_KEYS", "").split(",") if k.strip()]
    if os.environ.get("GEMINI_API_KEY") and os.environ["GEMINI_API_KEY"] not in ks:
        ks.append(os.environ["GEMINI_API_KEY"])
    return ks


_dead_keys = {}  # (model, key) -> time it failed (skip for 10 minutes)


# ---------------------------------------------------------------- audio helpers
def to_wav16k(data: bytes) -> bytes:
    """Any browser recording (webm/ogg/mp4) -> 16 kHz mono WAV."""
    with tempfile.TemporaryDirectory() as d:
        src, dst = Path(d) / "in", Path(d) / "out.wav"
        src.write_bytes(data)
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(src), "-ac", "1", "-ar", "16000", str(dst)], check=True)
        return dst.read_bytes()


def pcm_to_wav(pcm: bytes, rate=24000) -> bytes:
    with tempfile.TemporaryDirectory() as d:
        src, dst = Path(d) / "in.pcm", Path(d) / "out.wav"
        src.write_bytes(pcm)
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", str(rate), "-ac", "1", "-i", str(src), str(dst)], check=True)
        return dst.read_bytes()


# ---------------------------------------------------------------- 1. speech -> text
ASR_PROMPT = {
    "darija": "You transcribe voice messages from elderly Moroccans speaking Darija (sometimes with a rural or northern accent). "
              "Write exactly what is said, in Arabic script, the way Moroccans write Darija (not Standard Arabic). Keep French loanwords as said. "
              "No translation, no comments. Output only the transcription. If there is no clear speech (silence, noise, music, too short), output exactly: [no speech]. Never guess words.",
    "other": "Transcribe this voice message exactly, in {lang}. No translation, no comments. Output only the transcription. If there is no clear speech (silence, noise, music, too short), output exactly: [no speech]. Never guess words.",
}


def speech_level(wav: bytes):
    """(seconds, loudness in dBFS) of a 16-bit mono WAV, to refuse silence before any AI can invent words."""
    import array
    import io
    import math
    import wave
    with wave.open(io.BytesIO(wav)) as w:
        frames, rate = w.readframes(w.getnframes()), w.getframerate()
    samples = array.array("h", frames)
    if not samples:
        return 0.0, -120.0
    rms = math.sqrt(sum(x * x for x in samples[::4]) / max(1, len(samples[::4])))
    return len(samples) / rate, (20 * math.log10(rms / 32768) if rms > 0 else -120.0)


def _clean_transcript(text):
    t = (text or "").strip()
    return "" if not t or "no speech" in t.lower() or t in ("[]", "...", "…") else t


ASR_AUTO = ("You transcribe a family voice message. It is in ONE of: Moroccan Darija (elderly speakers, maybe rural or northern accent), "
            "French, Spanish, Italian or English. First decide the language, then write exactly what is said: Darija in Arabic script the way "
            "Moroccans write it (keep French loanwords as said), other languages in their normal spelling. No translation, no comments. "
            "If there is no clear speech (silence, noise, music, too short), use language \"none\" and empty text. Never guess words. "
            'Output ONLY JSON: {"language": "dar|fr|es|it|en|other|none", "text": "..."}')


def _asr_call(msgs, max_tokens=2000):
    """Run a speech-recognition request on the first provider that answers. Returns (raw text, via)."""
    last = None
    try:
        r = straitly().chat.completions.create(model=ASR_MODEL, messages=msgs, max_tokens=max_tokens, reasoning_effort="low")
        return r.choices[0].message.content, f"straitly/{ASR_MODEL}"
    except Exception as e:  # fallback: free Google keys
        last = str(e)
    for k in google_keys():
        try:
            c = OpenAI(base_url="https://generativelanguage.googleapis.com/v1beta/openai/", api_key=k, timeout=60, max_retries=0)
            r = c.chat.completions.create(model="gemini-3.6-flash", messages=msgs, max_tokens=max_tokens)
            return r.choices[0].message.content, "google/gemini-3.6-flash"
        except Exception as e:
            last = str(e)
    try:  # last resort: ZenMux (paid, small)
        zen = OpenAI(base_url="https://zenmux.ai/api/v1", api_key=os.environ["ZENMUX_API_KEY"], timeout=120, max_retries=1)
        r = zen.chat.completions.create(model="google/gemini-3.8-flash", messages=msgs, max_tokens=max_tokens, reasoning_effort="low")
        return r.choices[0].message.content, "zenmux/gemini-3.8-flash"
    except Exception as e:
        last = str(e)
    raise RuntimeError(f"speech recognition failed: {str(last)[:200]}")


def asr(audio: bytes, lang: str) -> dict:
    """Speech -> text. lang: 'darija', a language code, or 'auto' (detects Darija/fr/es/it/en and returns it as `lang`)."""
    wav = to_wav16k(audio)
    seconds, level = speech_level(wav)
    if seconds < 0.7 or level < -55:   # too short or silent: say so, never let a model guess
        return dict(text="", lang="none", via="silence-check", seconds=0.0, no_speech=True, audio_seconds=round(seconds, 1))
    b64 = base64.b64encode(wav).decode()
    if lang == "auto":
        system = ASR_AUTO
    else:
        system = ASR_PROMPT["darija"] if lang == "darija" else ASR_PROMPT["other"].format(lang=LANG_NAMES.get(lang, lang))
    msgs = [{"role": "system", "content": system},
            {"role": "user", "content": [{"type": "input_audio", "input_audio": {"data": b64, "format": "wav"}}]}]
    t0 = time.time()
    raw, via = _asr_call(msgs)
    if lang == "auto":
        j = extract_json(raw) or {}
        detected = str(j.get("language") or "other").lower()
        text = _clean_transcript(j.get("text") or "") if detected != "none" else ""
        if detected in ("ar", "arabic", "darija", "ary"):
            detected = "dar"
        return dict(text=text, lang=detected if text else "none", via=via, seconds=round(time.time() - t0, 1), audio_seconds=round(seconds, 1))
    return dict(text=_clean_transcript(raw), lang="dar" if lang == "darija" else lang, via=via,
                seconds=round(time.time() - t0, 1), audio_seconds=round(seconds, 1))


def text_language(text: str) -> str:
    """Typed text: Arabic letters mean Darija; otherwise the translator works out the language itself."""
    arabic = sum(1 for ch in text if "\u0600" <= ch <= "\u06ff")
    return "dar" if arabic >= max(2, len(text.strip()) // 4) else "auto"


# ---------------------------------------------------------------- 2. translation
def translate_from_grandparent(darija: str, grandchild_gender=None, lang=None, family_words=None) -> dict:
    t0 = time.time()
    r = luna(prompts.d2x_messages(darija, None, grandchild_gender, lang, family_words), 4000)
    j = extract_json(r.choices[0].message.content) or {}
    j["seconds"] = round(time.time() - t0, 1)
    return j


# Words a Moroccan grandparent would hear as Standard Arabic (or Middle-Eastern), not Darija. If one slips into the Darija,
# the translator is asked once to say it the Moroccan way (bench: "بجهد" in "كنقرا بجهد" -> "كنقرا مزيان").
NOT_DARIJA = set("سوف لماذا الذي التي أريد جدا كثيرا ليس لقد الآن أيضا فخور فخورة عايز دلوقتي ازيك كتير هلأ منيح بدي مشتاق "
                 "وحشتيني بجهد بجد أكثر أعز أحاول أستطيع يمكنني ماذا عندما لكي هذا هذه ذهبت رأيت متحمس متحمسة سأ سأكون حسنا".split())


def not_darija(darija: str) -> list:
    words = re.findall(r"[\u0621-\u064A]+", re.sub(r"[\u064B-\u0652\u0640]", "", darija or ""))
    return sorted({w for w in words if w in NOT_DARIJA or (w.startswith("سأ") and len(w) > 3)})


def translate_to_grandparent(text: str, lang: str, sender_gender: str, grandparent: str, address=None, family_words=None) -> dict:
    t0 = time.time()
    msgs = prompts.x2d_messages(sender_gender, grandparent, lang, text, address, family_words)
    r = luna(msgs, 3000)
    raw = r.choices[0].message.content
    j = extract_json(raw) or {}
    bad = not_darija(j.get("darija_arabic", ""))
    if bad:   # one quick repair: same answer, everyday Moroccan words only
        try:
            fix = luna(msgs + [{"role": "assistant", "content": raw},
                               {"role": "user", "content": f"These words are not Moroccan Darija: {'، '.join(bad)}. A grandparent in Morocco would not say them. "
                                                           "Give the same JSON again with the same meaning, saying those parts the way Moroccans really talk."}], 3000)
            j2 = extract_json(fix.choices[0].message.content) or {}
            if j2.get("darija_arabic") and len(not_darija(j2["darija_arabic"])) < len(bad):
                j2.setdefault("source_lang", j.get("source_lang"))
                j, j["darija_fixed"] = j2, bad
        except Exception:
            pass
    j["seconds"] = round(time.time() - t0, 1)
    return j


# ---------------------------------------------------------------- 3. text -> speech
# ---- cloned voices (WITH CONSENT). Which engine speaks which language is chosen by ear (voice bake-off):
#   GRANDMA_VOICE_BY_LANG="darija:fish,fr:eleven_v2,es:eleven_v2,it:eleven_v2,en:eleven_v2"
#   fish       = Fish Audio S2.1 Pro Free, instant clone from her 3 longest cleaned notes (won for Darija)
#   eleven_v2  = ElevenLabs multilingual v2, max similarity;  eleven_v3 = v3 natural;  eleven_v3c = v3 creative
ELEVEN_SETTINGS = {
    "eleven_v2": ("eleven_multilingual_v2", {"stability": 0.35, "similarity_boost": 1.0, "style": 0.0, "use_speaker_boost": True}),
    "eleven_v3": ("eleven_v3", {"stability": 0.5, "similarity_boost": 1.0}),
    "eleven_v3c": ("eleven_v3", {"stability": 0.0, "similarity_boost": 1.0}),
}
# Fish Audio voices: which of her cleaned notes are sent as the voice sample, and how much variation is allowed.
FISH_PROFILES = {
    "fish": (["PTT-20260912-WA0004", "PTT-20260626-WA0000", "PTT-20260112-WA0004"], 0.6, 0.7),        # longest clips (won Darija)
    "fish_short": (["PTT-20261104-WA0033", "PTT-20261106-WA0040", "PTT-20260715-WA0018"], 0.5, 0.6),  # shorter clips (won English)
}
_fish_refs_cache = {}


def engine_for(speaker, lang):
    if speaker != "grandmother":
        return "eleven_v2" if cloned_voice(speaker) else "gemini"
    table = dict(x.split(":") for x in os.environ.get("GRANDMA_VOICE_BY_LANG", "darija:fish,fr:eleven_v2,es:eleven_v2,it:eleven_v2,en:eleven_v2").split(",") if ":" in x)
    eng = table.get(lang, "eleven_v2")
    if eng.startswith("fish") and not (os.environ.get("FISH_API_KEY") and fish_refs(eng)):
        eng = "eleven_v2"
    if eng.startswith("eleven") and not (cloned_voice(speaker) and os.environ.get("ELEVENLABS_API_KEY")):
        eng = "gemini"
    return eng


def cloned_voice(speaker):
    """ElevenLabs voice cloned WITH CONSENT for this speaker, if any (set in .env)."""
    return os.environ.get({"grandmother": "ELEVENLABS_GRANDMA_VOICE_ID", "grandfather": "ELEVENLABS_GRANDPA_VOICE_ID",
                           "boy": "ELEVENLABS_GRANDCHILD_VOICE_ID", "girl": "ELEVENLABS_GRANDCHILD_VOICE_ID"}.get(speaker, ""), "")


def voice_tag(speaker, lang="darija"):
    eng = engine_for(speaker, lang)
    return "gemini-v2" if eng == "gemini" else f"{eng}:{'grandma-refs:open1:take2' if eng.startswith('fish') else cloned_voice(speaker)}"


def eleven_tts(text, voice_id, engine="eleven_v2"):
    model, settings = ELEVEN_SETTINGS.get(engine, ELEVEN_SETTINGS["eleven_v2"])
    body = {"text": text, "model_id": model, "voice_settings": settings}
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format=pcm_24000",
                                 data=json.dumps(body).encode(), headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"})
    return pcm_to_wav(urllib.request.urlopen(req, timeout=90).read(), 24000)


def fish_refs(engine="fish"):
    """Her cleaned voice notes + their transcripts for this Fish profile (private, data/audio is git-ignored)."""
    if engine not in _fish_refs_cache:
        try:
            rows = {r["file"]: r for r in json.loads((ROOT / "data/audio/grandma_wav/transcripts.json").read_text(encoding="utf-8"))}
            _fish_refs_cache[engine] = [{"audio": (ROOT / f"data/audio/grandma_clean/{f}.mp3").read_bytes(), "text": rows[f]["transcript"]}
                                        for f in FISH_PROFILES[engine][0]]
        except Exception:
            _fish_refs_cache[engine] = []
    return _fish_refs_cache[engine]


def speakable(text: str) -> str:
    """How Darija is handed to a voice (people still see the normal text). A short pause after the pet name
    ("أ جدة... دزت البيرمي") stops the first words from blurring: opening heard right 8/8 vs 6/8, 99% clear vs 95%
    (eval/voice_opening.py)."""
    return re.sub(r"(^|\s)أ (\S+)،\s*", r"\1أ \2... ", text or "")


_SKIP = set("اأإآوىيءؤئةه ")


def _skeleton(t):
    return [c for c in re.sub(r"[\u064B-\u0652\u0640]", "", t or "") if "\u0621" <= c <= "\u064A" and c not in _SKIP]


def darija_heard_ok(text: str, wav: bytes) -> float:
    """Listen back to a Darija voice message: share of its sounds heard, with the opening (first 3 words) weighted in.
    Darija has no fixed spelling, so consonants are compared, not words."""
    import difflib
    heard = asr(wav, "darija").get("text", "")
    def match(a, b):
        a, b = _skeleton(a), _skeleton(b)
        return sum(m.size for m in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks()) / max(1, len(a))
    head = " ".join(text.replace("،", " ").split()[:3])
    return min(match(text, heard), match(head, " ".join(heard.replace("،", " ").split()[:5])))


def best_take(make, text: str, good=0.85):
    """Voice cloning varies from take to take. Make one; if listening back shows blurred or missing words, make a second
    and keep the clearer one. Returns (wav, score, takes)."""
    wav = make()
    try:
        score = darija_heard_ok(text, wav)
    except Exception:
        return wav, None, 1
    if score >= good:
        return wav, round(score, 2), 1
    try:
        wav2 = make()
        score2 = darija_heard_ok(text, wav2)
        return (wav2, round(score2, 2), 2) if score2 > score else (wav, round(score, 2), 2)
    except Exception:
        return wav, round(score, 2), 1


def fish_tts(text, engine="fish"):
    import msgpack
    _, temperature, top_p = FISH_PROFILES[engine]
    body = msgpack.packb({"text": speakable(text), "references": fish_refs(engine), "format": "wav", "latency": "normal", "normalize": True,
                          "temperature": temperature, "top_p": top_p})
    req = urllib.request.Request("https://api.fish.audio/v1/tts", data=body, headers={
        "Authorization": f"Bearer {os.environ['FISH_API_KEY']}", "Content-Type": "application/msgpack", "model": "s2.1-pro-free"})
    return urllib.request.urlopen(req, timeout=120).read()


def tts(text: str, lang: str, speaker: str, feeling=None) -> dict:
    """speaker: grandmother / grandfather / girl / boy. Returns WAV bytes.
    Uses the speaker's own cloned voice (Fish or ElevenLabs, per language) when one exists, otherwise a Gemini voice."""
    eng = engine_for(speaker, lang)
    if eng != "gemini":
        t0 = time.time()
        try:
            if eng.startswith("fish") and lang == "darija":
                wav = best_take(lambda: fish_tts(text, eng), text)[0]
            else:
                wav = fish_tts(text, eng) if eng.startswith("fish") else eleven_tts(text, cloned_voice(speaker), eng)
            return dict(wav=wav, via=f"{eng}/cloned", seconds=round(time.time() - t0, 1), cloned=True)
        except Exception:
            pass  # out of credits or offline: fall back to the free Gemini voice
    voice = VOICES.get(speaker, "Sulafat")
    who = {"grandmother": "a warm, elderly Moroccan grandmother", "grandfather": "a warm, elderly Moroccan grandfather",
           "girl": "a young girl", "boy": "a young boy"}.get(speaker, "a warm voice")
    mood = ", ".join(feeling or []) or "natural"
    style = (f"Say this in Moroccan Darija with a natural Moroccan accent, like {who} talking on the phone ({mood}):"
             if lang == "darija" else f"Say this in {LANG_NAMES.get(lang, lang)}, naturally, like {who} talking to family ({mood}):")
    # Only the words to say: Gemini TTS sometimes reads a style instruction out loud, so none is sent.
    # (The voice is chosen by voiceName; `style` is kept for reference only.)
    body = {"contents": [{"parts": [{"text": text}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
    t0, last = time.time(), ""
    for model in TTS_MODELS:
        for k in google_keys():
            if time.time() - _dead_keys.get((model, k), 0) < 600:
                continue
            req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                                         data=json.dumps(body).encode(), headers={"x-goog-api-key": k, "Content-Type": "application/json"})
            try:
                d = json.load(urllib.request.urlopen(req, timeout=90))
                part = d["candidates"][0]["content"]["parts"][0]["inlineData"]
                raw = base64.b64decode(part["data"])
                wav = raw if raw[:4] == b"RIFF" else pcm_to_wav(raw)
                return dict(wav=wav, via=f"google/{model}/{voice}", seconds=round(time.time() - t0, 1))
            except urllib.error.HTTPError as e:
                last = f"{model}: HTTP {e.code}"
                if e.code in (401, 403, 429):
                    _dead_keys[(model, k)] = time.time()
                if e.code == 404:
                    break
            except Exception as e:
                last = f"{model}: {str(e)[:120]}"
    raise RuntimeError(f"text-to-speech failed ({last})")


# ---------------------------------------------------------------- the grandchild's own voice (learned from their messages)
# With the person's consent, every voice message they send keeps a few seconds of their voice (private, git-ignored).
# Grandma then hears the Darija in THEIR voice (Fish Audio instant cloning, free model). No separate enrollment needed.
VOICES_DIR = ROOT / "data" / "audio" / "voices"
MAX_CLIPS = 6


def _owner_dir(owner):
    import re as _re
    slug = _re.sub(r"[^a-z0-9_-]+", "-", (owner or "grandchild").lower()).strip("-")[:40] or "grandchild"
    return VOICES_DIR / slug


def remember_voice(owner, audio: bytes, transcript: str):
    """Keep this clip as a voice sample (3-30 s of speech). Returns the number of clips kept for this person."""
    d = _owner_dir(owner)
    d.mkdir(parents=True, exist_ok=True)
    clip = d / f"{int(time.time() * 1000)}.mp3"
    with tempfile.TemporaryDirectory() as t:
        src = Path(t) / "in"
        src.write_bytes(audio)
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(src), "-t", "30", "-af", "highpass=f=80,loudnorm=I=-20:TP=-3",
                        "-ac", "1", "-ar", "24000", "-b:a", "96k", str(clip)], check=True)
        out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(clip)], capture_output=True, text=True)
    seconds = float(out.stdout.strip() or 0)
    if seconds < 3:
        clip.unlink(missing_ok=True)
    else:
        clip.with_suffix(".json").write_text(json.dumps({"text": transcript, "seconds": round(seconds, 1)}, ensure_ascii=False), encoding="utf-8")
    clips = sorted(c for c in d.glob("*.mp3") if c.stem.isdigit())   # message clips only; the voice set-up recording stays
    for old in clips[:-MAX_CLIPS]:
        old.unlink(missing_ok=True)
        old.with_suffix(".json").unlink(missing_ok=True)
    return len(clips[-MAX_CLIPS:])


def voice_refs(owner, max_seconds=45):
    """Most recent clips of this person's voice (up to 3, about 45 s), newest first."""
    d = _owner_dir(owner)
    refs, total = [], 0.0
    for clip in sorted((c for c in d.glob("*.mp3") if c.stem.isdigit()), reverse=True):
        meta = clip.with_suffix(".json")
        if not meta.exists():
            continue
        m = json.loads(meta.read_text(encoding="utf-8"))
        refs.append({"id": clip.stem, "audio": clip.read_bytes(), "text": m["text"]})
        total += m.get("seconds", 0)
        if len(refs) >= 3 or total >= max_seconds:
            break
    return refs


def eleven_clone(name: str, audios: list) -> str:
    """Instant voice copy on ElevenLabs from a person's own recording(s). Returns the voice id."""
    import uuid as _uuid
    b = _uuid.uuid4().hex
    parts = [f'--{b}\r\nContent-Disposition: form-data; name="name"\r\n\r\n{name}\r\n'.encode(),
             f'--{b}\r\nContent-Disposition: form-data; name="description"\r\n\r\nKebdti family member, recorded with their consent\r\n'.encode(),
             f'--{b}\r\nContent-Disposition: form-data; name="remove_background_noise"\r\n\r\ntrue\r\n'.encode()]
    for i, a in enumerate(audios):
        parts.append(f'--{b}\r\nContent-Disposition: form-data; name="files"; filename="voice{i}.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n'.encode() + a + b"\r\n")
    parts.append(f"--{b}--\r\n".encode())
    req = urllib.request.Request("https://api.elevenlabs.io/v1/voices/add", data=b"".join(parts), headers={
        "xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": f"multipart/form-data; boundary={b}"})
    return json.load(urllib.request.urlopen(req, timeout=120))["voice_id"]


def eleven_delete(voice_id: str):
    """Remove a voice copy from ElevenLabs (when someone removes their voice or leaves the family)."""
    if not voice_id or not os.environ.get("ELEVENLABS_API_KEY"):
        return
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/voices/{voice_id}", method="DELETE",
                                 headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"]})
    try:
        urllib.request.urlopen(req, timeout=30).read()
    except Exception:
        pass


# Own-voice settings, chosen with the person on their real recordings (eval/own_voice_fish.py): their set-up recording only,
# a little slower and steadier. Fish keeps how they really sound (ElevenLabs was clearer but "doesn't sound like me").
OWN_VOICE = {"temperature": 0.45, "top_p": 0.55, "speed": 0.9}


def own_voice_tts(text, refs, temperature=None, top_p=None, speed=None):
    """Speak `text` in the voice of these reference clips (Fish Audio, free model)."""
    import msgpack
    speed = OWN_VOICE["speed"] if speed is None else speed
    body = {"text": speakable(text), "references": [{"audio": r["audio"], "text": r["text"]} for r in refs], "format": "wav", "latency": "normal",
            "normalize": True, "temperature": OWN_VOICE["temperature"] if temperature is None else temperature,
            "top_p": OWN_VOICE["top_p"] if top_p is None else top_p}
    if speed != 1.0:
        body["prosody"] = {"speed": speed, "volume": 0}
    body = msgpack.packb(body)
    req = urllib.request.Request("https://api.fish.audio/v1/tts", data=body, headers={
        "Authorization": f"Bearer {os.environ['FISH_API_KEY']}", "Content-Type": "application/msgpack", "model": "s2.1-pro-free"})
    return urllib.request.urlopen(req, timeout=120).read()
