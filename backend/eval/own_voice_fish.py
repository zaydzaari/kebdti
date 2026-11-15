"""His own voice with Fish (sounds like him) but clearer Darija. Which Fish settings keep his voice and stop the swallowed words?

Same recordings as the app (data/voicefix: French set-up + English voice note). Each version is transcribed back and scored:
  sounds = share of the message's consonants heard back in order (fair for Darija, which has no standard spelling)
Run: python -X utf8 eval/own_voice_fish.py [V2 V3 ...]  -> data/voicefix/fish/*.mp3, results.json, index.html
"""
import difflib, html, json, os, re, subprocess, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from dotenv import load_dotenv
load_dotenv(ROOT / ".env")
from app import pipeline

D = ROOT / "data/voicefix"
OUT = D / "fish"
OUT.mkdir(exist_ok=True)
MSG = json.loads((D / "message.json").read_text(encoding="utf-8"))
ENROLL = {"audio": (D / "enroll.mp3").read_bytes(), "text": json.loads((D / "enroll.json").read_text(encoding="utf-8"))["text"]}
clip = sorted(D.glob("179*.mp3"))[0]
CLIP = {"audio": clip.read_bytes(), "text": json.loads(clip.with_suffix(".json").read_text(encoding="utf-8"))["text"]}
TEXTS = [MSG["text"], "أ جدة، كنبغيك بزاف.", "صافي أ جدة، غادي نعيط ليك غدا إن شاء الله."]
LATIN = [MSG["latin"], "a jedda, kanbghik bzaf.", "safi a jedda, ghadi n3iyet lik ghedda inchallah."]


def fish(text, refs, temperature=0.6, top_p=0.7, speed=1.0, normalize=True):
    import msgpack
    body = {"text": text, "references": refs, "format": "wav", "latency": "normal", "normalize": normalize,
            "temperature": temperature, "top_p": top_p}
    if speed != 1.0:
        body["prosody"] = {"speed": speed, "volume": 0}
    req = urllib.request.Request("https://api.fish.audio/v1/tts", data=msgpack.packb(body), headers={
        "Authorization": f"Bearer {os.environ['FISH_API_KEY']}", "Content-Type": "application/msgpack", "model": "s2.1-pro-free"})
    return urllib.request.urlopen(req, timeout=180).read()


def sentences(text):
    return [p.strip() for p in re.split(r"(?<=[.!؟?])\s+", text) if p.strip()]


def pcm(wav, rate=24000):
    return subprocess.run(["ffmpeg", "-loglevel", "error", "-i", "pipe:0", "-ac", "1", "-ar", str(rate), "-f", "s16le", "pipe:1"],
                          input=wav, capture_output=True, check=True).stdout


def by_sentence(text, **kw):
    out = b""
    for s in sentences(text):
        out += pcm(fish(s, **kw)) + b"\x00\x00" * int(24000 * 0.22)
    return pipeline.pcm_to_wav(out, 24000)


def arabizi_for_voice(t):
    """Latin Darija spelled so a French/English voice reads it right: 7->h, 3->a, 9->q, 5->kh, 2->'."""
    return t.replace("7", "h").replace("3", "a").replace("9", "q").replace("5", "kh").replace("2", "'")


SKIP = set("اأإآوىيءؤئةه ")
AR = re.compile(r"[ً-ْـ]")


def sound(target, heard):
    sk = lambda t: [c for c in AR.sub("", t or "") if "ء" <= c <= "ي" and c not in SKIP]
    a, b = sk(target), sk(heard)
    return sum(m.size for m in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks()) / max(1, len(a))


BOTH = [ENROLL, CLIP]
VARIANTS = {
    "V1": ("What you heard before: both recordings, normal settings", lambda t, i: fish(t, BOTH)),
    "V2": ("Both recordings, 10% slower", lambda t, i: fish(t, BOTH, speed=0.9)),
    "V3": ("Both recordings, steadier voice", lambda t, i: fish(t, BOTH, temperature=0.4, top_p=0.5)),
    "V4": ("Both recordings, slower + steadier, one sentence at a time", lambda t, i: by_sentence(t, refs=BOTH, temperature=0.45, top_p=0.55, speed=0.9)),
    "V5": ("French set-up only, slower + steadier", lambda t, i: fish(t, [ENROLL], temperature=0.45, top_p=0.55, speed=0.9)),
    "V6": ("Both recordings, Darija written in Latin letters, slower", lambda t, i: fish(arabizi_for_voice(LATIN[i]), BOTH, speed=0.9)),
    "V7": ("English note only, slower + steadier", lambda t, i: fish(t, [CLIP], temperature=0.45, top_p=0.55, speed=0.9)),
}

if __name__ == "__main__":
    pick = sys.argv[1:] or list(VARIANTS)
    res_f = OUT / "results.json"
    results = json.loads(res_f.read_text(encoding="utf-8")) if res_f.exists() else {}
    for v in pick:
        how, make = VARIANTS[v]
        rows = []
        for i, t in enumerate(TEXTS):
            f = OUT / f"{v}_{i}.wav"
            if not f.exists():
                f.write_bytes(make(t, i))
                subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(f), "-b:a", "128k", str(f.with_suffix(".mp3"))], check=True)
            heard = pipeline.asr(f.read_bytes(), "darija")["text"]
            rows.append({"text": t, "heard": heard, "sound": round(sound(t, heard), 3), "seconds": round(len(pcm(f.read_bytes(), 16000)) / 32000, 1)})
        score = sum(r["sound"] for r in rows) / len(rows)
        results[v] = {"how": how, "sound": round(score, 3), "rows": rows}
        print(f"{v} {score:5.0%}  " + " ".join(f"[{r['sound']:.0%} {r['seconds']}s]" for r in rows) + f"  {how}", flush=True)
        res_f.write_text(json.dumps(results, ensure_ascii=False, indent=1), encoding="utf-8")
