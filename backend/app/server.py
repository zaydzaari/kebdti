"""Kebdti MVP web server.

Run:  .venv/Scripts/python -X utf8 -m uvicorn app.server:app --port 8000
Open: http://localhost:8000            (grandchild app)
      http://localhost:8000/?grandma=1 (grandma mode: one big button)
"""
import hashlib
import os
import re
import json
import threading
import time
import traceback
import uuid
from pathlib import Path

from fastapi import Body, FastAPI, File, Form, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.concurrency import run_in_threadpool

from app import pipeline

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / "data" / "audio"
OUT, CACHE = AUDIO / "out", AUDIO / "cache"
for d in (OUT, CACHE):
    d.mkdir(parents=True, exist_ok=True)
LOG = AUDIO / "conversation.jsonl"
STATIC = Path(__file__).parent / "static"

app = FastAPI(title="Kebdti")
app.mount("/static", StaticFiles(directory=STATIC), name="static")
app.mount("/audio", StaticFiles(directory=AUDIO), name="audio")

# ---------------------------------------------------------------- the family (shared by every phone)
FAMILY_FILE = ROOT / "data" / "family.json"
ELDERS = {"grandmother", "grandfather"}
CHILDREN = {"grandson", "granddaughter"}
LIVE_LANGS = {"fr", "es", "it", "en", "nl", "de", "ar"}
DEFAULT_FAMILY = [
    {"id": "fatna", "name": "Mi Fatna", "role": "grandmother", "lang": "dar", "address": "أ جدة", "voice": "grandma-clone"},
    {"id": "ahmed", "name": "Sidi Ahmed", "role": "grandfather", "lang": "dar", "address": "أ جدي"},
    {"id": "yanis", "name": "Yanis", "role": "grandson", "lang": "en"},
    {"id": "lina", "name": "Lina", "role": "granddaughter", "lang": "es"},
]


def load_family():
    try:
        members = json.loads(FAMILY_FILE.read_text(encoding="utf-8"))["members"]
        if any(m.get("role") in ELDERS for m in members) and any(m.get("role") in CHILDREN for m in members):
            return members
    except Exception:
        pass
    return [dict(m) for m in DEFAULT_FAMILY]


FAMILY = load_family()


def save_family():
    FAMILY_FILE.parent.mkdir(parents=True, exist_ok=True)
    FAMILY_FILE.write_text(json.dumps({"members": FAMILY}, ensure_ascii=False, indent=1), encoding="utf-8")


def member(mid, fallback_role=None):
    m = next((m for m in FAMILY if m["id"] == mid), None)
    if m is None and fallback_role:
        m = next((m for m in FAMILY if m["role"] in fallback_role), None)
    return m


def slug(name):
    import re
    base = re.sub(r"[^a-z0-9]+", "-", (name or "").lower()).strip("-")[:24] or "member"
    sid, i = base, 2
    while any(m["id"] == sid for m in FAMILY):
        sid, i = f"{base}-{i}", i + 1
    return sid


def speaker_for(m):
    """Which voice speaks for this family member."""
    if not m:
        return "grandmother"
    if m["role"] == "grandmother":
        return "grandmother" if m.get("voice") == "grandma-clone" else "elder_f"
    if m["role"] == "grandfather":
        return "grandfather"
    return "boy" if m["role"] == "grandson" else "girl"


# ---------------------------------------------------------------- conversation store (shared by every phone)
_lock = threading.Lock()
CONVO = []
if LOG.exists():
    CONVO = [json.loads(l) for l in open(LOG, encoding="utf-8") if l.strip() and '"id"' in l]
for _m in CONVO:   # messages from before the family existed: Mi Fatna <-> Yanis
    if not _m.get("from_id"):
        _m["from_id"], _m["to_id"] = ("fatna", "yanis") if _m.get("direction") == "from_grandparent" else ("yanis", "fatna")


def _store(entry, profile=None):
    entry["source"] = (profile or {}).get("source") or "app"   # "grandma" (grandma's phone), "translate" (grandchild's own translation)
    if (profile or {}).get("test"):   # automated checks: stored for debugging, never shown to the family
        entry["test"] = True
    entry["id"] = uuid.uuid4().hex[:10]
    entry["at"] = time.time()
    with _lock:
        CONVO.append(entry)
        with open(LOG, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    return entry


@app.get("/")
def index():
    return FileResponse(STATIC / "index.html")


@app.get("/api/conversation")
def conversation(a: str = "", b: str = ""):
    """All recent messages, or only the ones between two family members (a, b)."""
    real = [m for m in CONVO if not m.get("test")]
    if a and b:
        return [m for m in real if {m.get("from_id"), m.get("to_id")} == {a, b}][-60:]
    return real[-60:]


@app.get("/api/family/members")
def family_members():
    return {"members": FAMILY}


@app.put("/api/family/members")
def upsert_member(m: dict = Body(...)):
    name = str(m.get("name", "")).strip()[:40]
    role = m.get("role")
    if not name or role not in ELDERS | CHILDREN:
        return JSONResponse({"error": "Give a name and choose grandma, grandpa, grandson or granddaughter."}, status_code=400)
    lang = "dar" if role in ELDERS else (m.get("lang") if m.get("lang") in LIVE_LANGS else "en")
    with _lock:
        cur = member(m.get("id")) if m.get("id") else None
        if cur:
            cur.update(name=name, role=role, lang=lang)
            if role in ELDERS:
                cur["address"] = str(m.get("address") or cur.get("address") or ("أ جدي" if role == "grandfather" else "أ جدة"))[:20]
            out = cur
        else:
            out = {"id": slug(name), "name": name, "role": role, "lang": lang}
            if role in ELDERS:
                out["address"] = str(m.get("address") or ("أ جدي" if role == "grandfather" else "أ جدة"))[:20]
            FAMILY.append(out)
        save_family()
    return {"member": out, "members": FAMILY}


@app.delete("/api/family/members/{mid}")
def delete_member(mid: str):
    with _lock:
        left = [m for m in FAMILY if m["id"] != mid]
        if not any(m["role"] in ELDERS for m in left) or not any(m["role"] in CHILDREN for m in left):
            return JSONResponse({"error": "A family needs at least one grandparent and one grandchild."}, status_code=400)
        FAMILY[:] = left
        save_family()
    if mid and all(c.isalnum() or c == "-" for c in mid) and len(mid) <= 40:   # their voice leaves with them
        forget_voice(mid)
    return {"members": FAMILY}


@app.post("/api/conversation/revoice")
def revoice():
    """Re-speak grandma's past messages with her current voice (e.g. after cloning or changing the voice per language)."""
    done, failed = 0, 0
    with _lock:
        items = [m for m in CONVO if m.get("direction") == "from_grandparent" and m.get("text")]
    for m in items:
        try:
            url, info = speak_cached(m["text"], m.get("lang", "en"), speaker_for(member(m.get("from_id"), ELDERS)))
            m["audio_url"], m["voice_cloned"] = url, bool(info.get("cloned"))
            done += 1
        except Exception:
            failed += 1
    with _lock:
        LOG.write_text("".join(json.dumps(m, ensure_ascii=False) + "\n" for m in CONVO), encoding="utf-8")
    return {"ok": True, "revoiced": done, "failed": failed}


@app.post("/api/conversation/clear")
def clear():
    with _lock:
        CONVO.clear()
        LOG.write_text("", encoding="utf-8")
    return {"ok": True}


# ---------------------------------------------------------------- voice (cached: never pay twice for the same audio)
def speak_cached(text, lang, speaker, feeling=None):
    key = hashlib.sha1(f"{text}|{lang}|{speaker}|{pipeline.voice_tag(speaker, lang)}".encode()).hexdigest()[:16]
    f = CACHE / f"{key}.wav"
    if f.exists():
        return f"/audio/cache/{f.name}", {"seconds": 0, "via": "cache", "cloned": pipeline.voice_tag(speaker, lang) not in ("gemini", "gemini-v2")}
    v = pipeline.tts(text, lang, speaker, feeling)
    if not v.get("cloned"):  # don't cache a fallback voice under the cloned-voice key
        key = hashlib.sha1(f"{text}|{lang}|{speaker}|gemini-v2".encode()).hexdigest()[:16]
        f = CACHE / f"{key}.wav"
    f.write_bytes(v["wav"])
    return f"/audio/cache/{f.name}", {"seconds": v["seconds"], "via": v["via"], "cloned": bool(v.get("cloned"))}


@app.post("/api/speak")
def speak(payload: dict = Body(...)):
    try:
        url, info = speak_cached(payload["text"], payload.get("lang", "fr"), payload.get("speaker", "grandmother"))
        return {"audio_url": url, **info}
    except Exception as e:
        return JSONResponse({"error": str(e)[:300]}, status_code=500)


async def _input_text(audio, text, lang, steps):
    if audio is not None:
        data = await audio.read()
        if data:
            r = await run_in_threadpool(pipeline.asr, data, lang)   # slow work off the main loop: the inbox keeps answering
            steps["listen"] = r["seconds"]
            return r["text"]
    return (text or "").strip()


# ---------------------------------------------------------------- voices: each person's own voice, set up once (15-30 s)
VOICES = ROOT / "data" / "audio" / "voices"


def voice_profile(mid):
    d = VOICES / (mid or "_")
    meta = d / "enroll.json"
    return json.loads(meta.read_text(encoding="utf-8")) if meta.exists() else None


def own_voice_refs(mid):
    """Reference clips for this person's voice: their voice set-up recording first, then recent messages."""
    # One clean recording in one language works best. Mixing clips in different languages (a French set-up + an English
    # voice note) made the voice robotic and swallow words: 79% of words heard back vs 91% (eval/voice_fix_bake.py).
    prof = voice_profile(mid)
    if prof and (VOICES / mid / "enroll.mp3").exists():
        return [{"id": f"enroll-{prof.get('at', 0)}", "audio": (VOICES / mid / "enroll.mp3").read_bytes(), "text": prof["text"]}]
    return pipeline.voice_refs(mid)[:1]   # no set-up yet: their most recent voice note only


def _save_profile(mid, prof):
    (VOICES / mid / "enroll.json").write_text(json.dumps(prof, ensure_ascii=False), encoding="utf-8")


def eleven_voice_for(mid, prof):
    """This person's ElevenLabs voice copy, made once from their set-up recording (older set-ups get one on first use)."""
    if not prof or not os.environ.get("ELEVENLABS_API_KEY") or not (VOICES / mid / "enroll.mp3").exists():
        return None
    if prof.get("eleven_voice_id"):
        return prof["eleven_voice_id"]
    if prof.get("eleven_failed_at", 0) > time.time() - 3600:   # don't retry a failing copy on every message
        return None
    try:
        prof["eleven_voice_id"] = pipeline.eleven_clone(f"kebdti-{mid}", [(VOICES / mid / "enroll.mp3").read_bytes()])
    except Exception as e:
        print(f"[voice] ElevenLabs copy for {mid} failed: {str(e)[:160]}")
        prof["eleven_failed_at"] = int(time.time())
    _save_profile(mid, prof)
    return prof.get("eleven_voice_id")


def forget_voice(mid):
    """Remove someone's voice everywhere: the ElevenLabs copy and the recordings on this server."""
    import shutil
    prof = voice_profile(mid)
    if prof and prof.get("eleven_voice_id"):
        pipeline.eleven_delete(prof["eleven_voice_id"])
    shutil.rmtree(VOICES / mid, ignore_errors=True)


def own_voice_audio(text, mid, steps):
    """Speak `text` in this person's own voice, cached. None if they have no voice yet.
    Fish first, from their set-up recording, a little slower and steadier: it sounds like them (ElevenLabs was clearer but
    "doesn't sound like me"), and these settings scored 99% clear vs 94% before (eval/own_voice_fish.py).
    ElevenLabs is only the backup if Fish is down."""
    refs = own_voice_refs(mid) if os.environ.get("FISH_API_KEY") else []
    if refs:
        try:
            t1 = time.time()
            tag = "|".join(f"{k}={v}" for k, v in sorted(pipeline.OWN_VOICE.items())) + "|open1|take2"
            key = hashlib.sha1(f"{text}|own|{mid}|{','.join(r['id'] for r in refs)}|{tag}".encode()).hexdigest()[:16]
            f = CACHE / f"{key}.wav"
            if not f.exists():
                if pipeline.text_language(text) == "dar":
                    wav, score, takes = pipeline.best_take(lambda: pipeline.own_voice_tts(text, refs), text)
                    steps["voice_check"], steps["voice_takes"] = score, takes
                else:
                    wav = pipeline.own_voice_tts(text, refs)
                f.write_bytes(wav)
            steps["voice"], steps["voice_via"] = round(time.time() - t1, 1), "fish/own-voice"
            return f"/audio/cache/{f.name}"
        except Exception as e:
            steps["own_voice_error"] = str(e)[:120]
    vid = eleven_voice_for(mid, voice_profile(mid))
    if vid:
        try:
            t1 = time.time()
            f = CACHE / f"{hashlib.sha1(f'{text}|own-eleven-v3|{vid}'.encode()).hexdigest()[:16]}.wav"
            if not f.exists():
                f.write_bytes(pipeline.eleven_tts(text, vid, "eleven_v3"))
            steps["voice"], steps["voice_via"] = round(time.time() - t1, 1), "eleven_v3/own-voice (backup)"
            return f"/audio/cache/{f.name}"
        except Exception as e:
            steps["own_voice_eleven_error"] = str(e)[:120]
    return None


@app.get("/api/voice-profile/{mid}")
def voice_status(mid: str):
    if not member(mid):
        return JSONResponse({"error": "Unknown family member."}, status_code=404)
    prof = voice_profile(mid)
    return {"ready": bool(prof), "seconds": (prof or {}).get("seconds"), "at": (prof or {}).get("at"), "clips": len(pipeline.voice_refs(mid)) if prof else 0}


@app.post("/api/voice-profile/{mid}")
async def voice_enroll(mid: str, audio: UploadFile = File(...)):
    """Set up a person's voice from one 15-30 s recording. Recording it is their consent; stored privately on this server."""
    if not member(mid):
        return JSONResponse({"error": "Unknown family member."}, status_code=404)
    raw = await audio.read()
    try:
        heard = await run_in_threadpool(pipeline.asr, raw, "auto")
    except Exception as e:
        return JSONResponse({"error": "We couldn't listen to that recording. Try again.", "detail": str(e)[:200]}, status_code=502)
    if heard.get("no_speech") or not heard.get("text"):
        return JSONResponse({"error": "We didn't hear your voice. Find a quiet spot and try again."}, status_code=400)
    if heard.get("audio_seconds", 0) < 10:
        return JSONResponse({"error": "That was too short. Talk for at least 15 seconds so Kebdti can learn your voice."}, status_code=400)
    d = VOICES / mid
    d.mkdir(parents=True, exist_ok=True)
    import subprocess, tempfile
    with tempfile.TemporaryDirectory() as t:
        src = Path(t) / "in"
        src.write_bytes(raw)
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(src), "-t", "30", "-af", "highpass=f=80,loudnorm=I=-20:TP=-3",
                        "-ac", "1", "-ar", "24000", "-b:a", "96k", str(d / "enroll.mp3")], check=True)
    old = voice_profile(mid) or {}
    if old.get("eleven_voice_id"):   # a new recording replaces the old copy
        pipeline.eleven_delete(old["eleven_voice_id"])
    prof = {"text": heard["text"], "lang": heard.get("lang"), "seconds": min(30, heard.get("audio_seconds", 0)), "at": int(time.time())}
    _save_profile(mid, prof)
    return {"ready": True, "seconds": prof["seconds"], "lang": prof["lang"], "heard": prof["text"][:200]}


@app.delete("/api/voice-profile/{mid}")
def voice_delete(mid: str):
    if member(mid):
        forget_voice(mid)
    return {"ready": False}


# ---------------------------------------------------------------- the two directions
def deliver_from_elder(p, darija, steps, t0, source_lang_note=None):
    """A grandparent's Darija -> the grandchild's language, in the grandparent's voice."""
    elder = member(p.get("from_id"), ELDERS)
    child = member(p.get("to_id"), CHILDREN)
    lang = p.get("grandchild_lang") if p.get("grandchild_lang") in LIVE_LANGS else (child or {}).get("lang", "en")
    gender = {"grandson": "boy", "granddaughter": "girl"}.get((child or {}).get("role"), p.get("grandchild_gender"))
    p["from_id"], p["to_id"] = (elder or {}).get("id"), (child or {}).get("id")
    tr = pipeline.translate_from_grandparent(darija, gender, lang, p.get("family_words"))
    steps["translate"] = tr.pop("seconds", None)
    out_text = (tr.get("translations") or {}).get(lang, "")
    audio_url, voice_cloned = None, False
    if elder and elder.get("voice") != "grandma-clone":   # their own voice, if they set one up
        audio_url = own_voice_audio(out_text, elder["id"], steps)
        voice_cloned = bool(audio_url)
    if not audio_url:
        try:
            audio_url, info = speak_cached(out_text, lang, speaker_for(elder), tr.get("feeling"))
            steps["voice"] = info["seconds"]
            voice_cloned = info.get("cloned", False)
        except Exception as e:
            steps["voice_error"] = str(e)[:200]
    entry = dict(direction="from_grandparent", original=darija, text=out_text, lang=lang,
                 word_for_word=tr.get("word_for_word"), feeling=tr.get("feeling") or [],
                 notes=tr.get("cultural_notes") or [], confidence=tr.get("confidence"),
                 meaning=(tr.get("understanding") or {}).get("intended_meaning"),
                 audio_url=audio_url, voice_cloned=voice_cloned, steps=steps, seconds=round(time.time() - t0, 1),
                 from_id=p.get("from_id"), to_id=p.get("to_id"), detected="dar")
    return _store(entry, p)


LANG_NAMES = {"fr": "fr", "french": "fr", "français": "fr", "francais": "fr", "es": "es", "spanish": "es", "español": "es", "espanol": "es",
              "it": "it", "italian": "it", "italiano": "it", "en": "en", "english": "en", "anglais": "en",
              "nl": "nl", "dutch": "nl", "nederlands": "nl", "de": "de", "german": "de", "deutsch": "de",
              "ar": "ar", "arabic": "ar", "standard arabic": "ar", "msa": "ar", "fusha": "ar", "other": "other"}
STOPWORDS = {
    "fr": "je tu il elle nous vous est et le la les des une un pas mais pour avec mamie papy mon ma mes ton ta très bien c'est j'ai suis moi toi".split(),
    "es": "yo tú el la los las y es está estoy pero para con mi mis tu muy bien abuela abuelo hola te que qué gracias echo".split(),
    "it": "io tu lui lei è e il lo la gli le un una ma per con mio mia ti mi nonna nonno ciao sono molto bene che grazie senti".split(),
    "en": "i you he she it is are and the a an but for with my your very good grandma grandpa hi hello love miss can how what".split(),
    "de": "ich du er sie es ist und der die das ein eine aber für mit mein dein sehr gut oma opa hallo wie geht nicht dich dir".split(),
    "nl": "ik jij hij zij het is en de een maar voor met mijn jouw heel goed oma opa hoi hallo hoe gaat niet".split(),
    "pt": "eu você ele ela é e o a os as um uma mas para com meu minha muito bem avó avô olá oi como não".split(),
}


def lang_code(label) -> str:
    """The translator's own language label, as fr/es/it/en/other, or "?" when it gave none or something unreadable."""
    v = str(label or "").strip().lower()
    return LANG_NAMES.get(v, "?" if (not v or "|" in v or len(v) > 12) else v)


def guess_language(text: str) -> str:
    """A second, independent opinion from common little words. Returns a code, or "?" when it can't tell."""
    words = re.findall(r"[a-zà-öø-ÿ']+", (text or "").lower())
    if not words:
        return "?"
    scores = {k: sum(w in v for w in words) for k, v in STOPWORDS.items()}
    best = max(scores, key=scores.get)
    ranked = sorted(scores.values(), reverse=True)
    return best if ranked[0] >= 1 and ranked[0] > ranked[1] else "?"


def deliver_from_child(p, src, lang, raw, steps, t0):
    """A grandchild's message (any of fr/es/it/en) -> Darija, in the grandchild's own voice if they have one."""
    child = member(p.get("from_id"), CHILDREN)
    elder = member(p.get("to_id"), ELDERS)
    gender = {"grandson": "boy", "granddaughter": "girl"}.get((child or {}).get("role"), p.get("grandchild_gender") or "unknown")
    p["from_id"], p["to_id"] = (child or {}).get("id"), (elder or {}).get("id")
    owner = (child or {}).get("id") or p.get("voice_owner") or "grandchild"
    consent = bool(p.get("voice_consent")) or bool(voice_profile(owner))
    if consent and raw:   # keep a few seconds of their voice, only with their yes
        try:
            steps["voice_clips"] = pipeline.remember_voice(owner, raw, src)
        except Exception as e:
            steps["voice_clip_error"] = str(e)[:120]
    tr = pipeline.translate_to_grandparent(src, lang if lang in LIVE_LANGS else "auto", gender,
                                           (elder or {}).get("role", p.get("grandparent", "grandmother")),
                                           (elder or {}).get("address") or p.get("address") or None, p.get("family_words"))
    steps["translate"] = tr.pop("seconds", None)
    darija = tr.get("darija_arabic", "")
    said_in, guess = lang_code(tr.get("source_lang")), guess_language(src)
    # e.g. German typed in auto mode: say so, don't pretend. Refuse only when both signals agree it isn't one of ours.
    if lang not in LIVE_LANGS and said_in not in LIVE_LANGS and said_in != "?" and guess not in LIVE_LANGS:
        return JSONResponse({"error": "Kebdti understands Darija, English, French, Spanish, Italian, Dutch, German and Standard Arabic for now."}, status_code=400)
    detected = lang if lang in LIVE_LANGS else said_in if said_in in LIVE_LANGS else guess if guess in LIVE_LANGS else (child or {}).get("lang", "en")
    audio_url = own_voice_audio(darija, owner, steps) if consent else None
    voice_cloned = bool(audio_url)
    if not audio_url:
        try:
            audio_url, info = speak_cached(darija, "darija", "boy" if gender == "boy" else "girl", tr.get("feeling"))
            steps["voice"] = info["seconds"]
            voice_cloned = info.get("cloned", False)
        except Exception as e:
            steps["voice_error"] = str(e)[:200]
    entry = dict(direction="from_grandchild", original=src, lang=detected, text=darija, latin=tr.get("darija_latin"),
                 feeling=tr.get("feeling") or [], audio_url=audio_url, voice_cloned=voice_cloned, steps=steps,
                 seconds=round(time.time() - t0, 1), from_id=p.get("from_id"), to_id=p.get("to_id"), detected=detected)
    return _store(entry, p)


def _fail(e):
    traceback.print_exc()
    return JSONResponse({"error": "Something went wrong. Please try again.", "detail": str(e)[:300]}, status_code=500)


# ---------------------------------------------------------------- grandparent (Darija) -> grandchild
@app.post("/api/grandparent")
async def from_grandparent(audio: UploadFile | None = File(None), text: str = Form(""), profile: str = Form("{}")):
    p = json.loads(profile or "{}")
    p.setdefault("from_id", (member(p.get("from_id"), ELDERS) or {}).get("id"))
    p.setdefault("to_id", (member(p.get("to_id"), CHILDREN) or {}).get("id"))
    steps, t0 = {}, time.time()
    try:
        darija = await _input_text(audio, text, "darija", steps)
        if not darija:
            return JSONResponse({"error": "We didn't hear anything. Try again a bit closer to the phone."}, status_code=400)
        return await run_in_threadpool(deliver_from_elder, p, darija, steps, t0)
    except Exception as e:
        return _fail(e)


# ---------------------------------------------------------------- grandchild (FR/ES/IT/EN) -> grandparent
@app.post("/api/grandchild")
async def from_grandchild(audio: UploadFile | None = File(None), text: str = Form(""), profile: str = Form("{}")):
    p = json.loads(profile or "{}")
    child = member(p.get("from_id"), CHILDREN)
    lang = p.get("grandchild_lang") if p.get("grandchild_lang") in LIVE_LANGS else (child or {}).get("lang", "en")
    steps, t0 = {}, time.time()
    try:
        raw = await audio.read() if audio is not None else b""
        if raw:
            heard = await run_in_threadpool(pipeline.asr, raw, lang)
            steps["listen"] = heard["seconds"]
            src = heard["text"]
        else:
            src = (text or "").strip()
        if not src:
            return JSONResponse({"error": "We didn't hear anything. Try again."}, status_code=400)
        return await run_in_threadpool(deliver_from_child, p, src, lang, raw, steps, t0)
    except Exception as e:
        return _fail(e)


# ---------------------------------------------------------------- one smart route: detects the language and the direction
@app.post("/api/message")
async def message(audio: UploadFile | None = File(None), text: str = Form(""), profile: str = Form("{}")):
    """profile: {me_id, with_id, family_words, voice_consent, ...}. Darija -> from the grandparent to the grandchild;
    French/Spanish/Italian/English -> from the grandchild to the grandparent. Nobody has to pick a language."""
    p = json.loads(profile or "{}")
    me, other = member(p.get("me_id")), member(p.get("with_id"))
    steps, t0 = {}, time.time()
    try:
        raw = await audio.read() if audio is not None else b""
        if raw:
            heard = await run_in_threadpool(pipeline.asr, raw, "auto")
            steps["listen"] = heard["seconds"]
            src, lang = heard["text"], heard.get("lang", "none")
        else:
            src = (text or "").strip()
            lang = pipeline.text_language(src) if src else "none"
            # Arabic letters typed by a grandchild whose language is Standard Arabic: that's Standard Arabic, not a grandparent's Darija
            if lang == "dar" and me and me.get("role") in CHILDREN and me.get("lang") == "ar":
                lang = "ar"
        if not src:
            return JSONResponse({"error": "We didn't hear anything. Try again a bit closer to the phone."}, status_code=400)
        # A grandparent's own phone is always Darija, whatever the recognizer thought (Darija and Standard Arabic share a script)
        if me and me.get("role") in ELDERS and lang == "ar":
            lang = "dar"
        steps["detected"] = lang
        if me and other:
            elder, child = (me, other) if me["role"] in ELDERS else (other, me)
        else:
            elder, child = member(None, ELDERS), member(None, CHILDREN)
        if lang == "dar":
            p["from_id"], p["to_id"] = elder["id"], child["id"]
            p["grandchild_lang"] = child.get("lang", "en")
            return await run_in_threadpool(deliver_from_elder, p, src, steps, t0)
        if lang not in LIVE_LANGS and lang != "auto":
            return JSONResponse({"error": "Kebdti understands Darija, English, French, Spanish, Italian, Dutch, German and Standard Arabic for now."}, status_code=400)
        p["from_id"], p["to_id"] = child["id"], elder["id"]
        return await run_in_threadpool(deliver_from_child, p, src, lang, raw, steps, t0)
    except Exception as e:
        return _fail(e)
