"""Bake-off: the grandchild's own voice speaking Darija. Why did it sound robotic and swallow words, and what fixes it?

Same Darija message, same voice recordings (data/voicefix: his French set-up + an English voice note), several ways.
Each output is transcribed back (Darija speech recognition) and compared with the text it was asked to say:
  words kept = share of the message's words heard back (higher = fewer swallowed words)
  pace       = Arabic letters per second (a rushed, clipped voice speaks unusually fast)
Run: python -X utf8 eval/voice_fix_bake.py   ->  data/voicefix/bake/*.mp3 + results.json + index.html
"""
import difflib, io, json, os, re, subprocess, sys, time, urllib.request, wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from dotenv import load_dotenv
load_dotenv(ROOT / ".env")
from app import pipeline

D = ROOT / "data/voicefix"
OUT = D / "bake"
OUT.mkdir(exist_ok=True)
MSG = json.loads((D / "message.json").read_text(encoding="utf-8"))
TEXT = MSG["text"]
ENROLL = {"audio": (D / "enroll.mp3").read_bytes(), "text": json.loads((D / "enroll.json").read_text(encoding="utf-8"))["text"]}
clip = sorted(D.glob("179*.mp3"))[0]
CLIP = {"audio": clip.read_bytes(), "text": json.loads(clip.with_suffix(".json").read_text(encoding="utf-8"))["text"]}


def fish(text, refs, temperature=0.6, top_p=0.7, normalize=True):
    import msgpack
    body = msgpack.packb({"text": text, "references": refs, "format": "wav", "latency": "normal", "normalize": normalize,
                          "temperature": temperature, "top_p": top_p})
    req = urllib.request.Request("https://api.fish.audio/v1/tts", data=body, headers={
        "Authorization": f"Bearer {os.environ['FISH_API_KEY']}", "Content-Type": "application/msgpack", "model": "s2.1-pro-free"})
    return urllib.request.urlopen(req, timeout=180).read()


def sentences(text, limit=110):
    parts = [p.strip() for p in re.split(r"(?<=[.!؟?])\s+", text) if p.strip()]
    groups, cur = [], ""
    for p in parts:
        if cur and len(cur) + len(p) > limit:
            groups.append(cur); cur = p
        else:
            cur = f"{cur} {p}".strip()
    return groups + ([cur] if cur else [])


def join_wavs(wavs, gap=0.18):
    """Concatenate wav bytes (any rate) into one 24 kHz mono wav with a short breath between sentences."""
    pcm = b""
    for w in wavs:
        raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", "pipe:0", "-ac", "1", "-ar", "24000", "-f", "s16le", "pipe:1"],
                             input=w, capture_output=True, check=True).stdout
        pcm += raw + b"\x00\x00" * int(24000 * gap)
    return pipeline.pcm_to_wav(pcm, 24000)


def eleven_voice(name, files):
    """Instant voice clone on ElevenLabs from his recordings (his own voice, his request)."""
    import uuid
    b = uuid.uuid4().hex
    parts = [f'--{b}\r\nContent-Disposition: form-data; name="name"\r\n\r\n{name}\r\n'.encode(),
             f'--{b}\r\nContent-Disposition: form-data; name="remove_background_noise"\r\n\r\ntrue\r\n'.encode()]
    for i, f in enumerate(files):
        parts.append(f'--{b}\r\nContent-Disposition: form-data; name="files"; filename="ref{i}.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n'.encode() + f + b"\r\n")
    parts.append(f"--{b}--\r\n".encode())
    req = urllib.request.Request("https://api.elevenlabs.io/v1/voices/add", data=b"".join(parts), headers={
        "xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": f"multipart/form-data; boundary={b}"})
    return json.load(urllib.request.urlopen(req, timeout=120))["voice_id"]


AR = re.compile(r"[ً-ْـ]")   # harakat, tatweel


def norm(t):
    t = AR.sub("", t or "")
    t = re.sub("[إأآا]", "ا", t).replace("ى", "ي").replace("ة", "ه").replace("ؤ", "و").replace("ئ", "ي")
    return re.findall(r"[ء-ي]+", t)


def words_kept(target, heard):
    tw, hw = norm(target), norm(heard)
    sm = difflib.SequenceMatcher(None, tw, hw, autojunk=False)
    return round(sum(b.size for b in sm.get_matching_blocks()) / max(1, len(tw)), 3)


def duration(wav):
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", "pipe:0", "-ac", "1", "-ar", "16000", "-f", "s16le", "pipe:1"],
                         input=wav, capture_output=True, check=True).stdout
    return len(pcm) / 32000


def score(name, wav, how):
    (OUT / f"{name}.wav").write_bytes(wav)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(OUT / f"{name}.wav"), "-b:a", "128k", str(OUT / f"{name}.mp3")], check=True)
    sec = duration(wav)
    heard = pipeline.asr(wav, "darija")["text"]
    r = {"name": name, "how": how, "seconds": round(sec, 1), "pace": round(len("".join(norm(TEXT))) / max(sec, 0.1), 1),
         "words_kept": words_kept(TEXT, heard), "heard": heard}
    print(f"{name:22s} kept {r['words_kept']:.0%}  {r['seconds']:5.1f}s  pace {r['pace']:4.1f}  | {heard[:70]}", flush=True)
    return r


results = []
jobs = sys.argv[1:] or ["A", "B", "C", "D", "E", "F"]
if "A" in jobs:
    results.append(score("A_current", (D / "current_output.wav").read_bytes(), "What you heard: Fish, French set-up + English note, whole message at once"))
if "B" in jobs:
    results.append(score("B_fish_setup_only", fish(TEXT, [ENROLL]), "Fish, only the French set-up recording"))
if "C" in jobs:
    results.append(score("C_fish_by_sentence", join_wavs([fish(s, [ENROLL, CLIP]) for s in sentences(TEXT)]),
                         "Fish, both recordings, one sentence at a time"))
if "D" in jobs:
    results.append(score("D_fish_sentence_calm", join_wavs([fish(s, [ENROLL], temperature=0.5, top_p=0.6, normalize=False) for s in sentences(TEXT)]),
                         "Fish, set-up only, sentence by sentence, calmer settings"))
if "E" in jobs or "F" in jobs:
    vid = eleven_voice("kebdti-grandchild-trial", [ENROLL["audio"], CLIP["audio"]])
    (OUT / "eleven_voice_id.txt").write_text(vid)
    if "E" in jobs:
        results.append(score("E_eleven_v3", pipeline.eleven_tts(TEXT, vid, "eleven_v3"), "ElevenLabs clone of your voice, v3 model"))
    if "F" in jobs:
        results.append(score("F_eleven_v2", pipeline.eleven_tts(TEXT, vid, "eleven_v2"), "ElevenLabs clone of your voice, multilingual v2"))

old = json.loads((OUT / "results.json").read_text(encoding="utf-8")) if (OUT / "results.json").exists() else []
merged = {r["name"]: r for r in old + results}
(OUT / "results.json").write_text(json.dumps(list(merged.values()), ensure_ascii=False, indent=1), encoding="utf-8")
