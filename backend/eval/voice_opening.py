"""The first words of a voice message ("أ جدة، ...") sometimes come out blurry. Which way of handing the text to the voice fixes it?
His own voice (Fish, his English set-up recording), 8 messages that start with the pet name. Score: is the opening heard right
(first 2 words) and how clear is the whole message. python -X utf8 eval/voice_opening.py"""
import difflib, json, re, sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from dotenv import load_dotenv
load_dotenv(ROOT / ".env")
from app import pipeline

V = ROOT / "data/audio/voices/yanis"
P = json.loads((V / "enroll.json").read_text(encoding="utf-8"))
REFS = [{"id": "enroll", "audio": (V / "enroll.mp3").read_bytes(), "text": P["text"]}]
OUT = ROOT / "data/voicefix/opening"
OUT.mkdir(parents=True, exist_ok=True)
MSGS = ["أ جدة، دزت البيرمي اليوم!", "أ جدة، توحشتك بزاف.", "أ جدة، غادي نجي نزورك هاد الصيف، كنوعدك.",
        "أ جدي، قبلوني فالجامعة! غادي نقرا الطب.", "أ جدة، شفت مرا فالسوق كانت كتشبه ليك بزاف.",
        "أ جدة، غدا عندي امتحان صعيب بزاف، دعي معايا.", "أ جدة، لقيت خدمة! غادي نبدا نهار الاثنين.", "أ جدة، كنبغيك بزاف."]
AR = re.compile(r"[ً-ْـ]")
SKIP = set("اأإآوىيءؤئةه ")
sk = lambda t: [c for c in AR.sub("", t or "") if "ء" <= c <= "ي" and c not in SKIP]


def match(a, b):
    a, b = sk(a), sk(b)
    return sum(m.size for m in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks()) / max(1, len(a))


def opening_ok(text, heard):
    want = " ".join(text.replace("،", " ").split()[:3])      # "أ جدة دزت"
    got = " ".join(heard.replace("،", " ").split()[:4])
    return match(want, got) >= 0.75


TWEAKS = {
    "as_is": lambda t: t,
    "pause": lambda t: "… " + t,                                     # a breath before the first word
    "long_aa": lambda t: re.sub(r"^أ ", "آ ", t),                   # "aa jedda", how it's really called out
    "ya": lambda t: re.sub(r"^أ ", "يا ", t),                       # "ya jedda"
    "name_first": lambda t: re.sub(r"^أ (\S+)، (.*)$", r"\2 أ \1.", t) if t.startswith("أ ") else t,  # pet name at the end
    "slow_start": lambda t: re.sub(r"^أ (\S+)،", r"أ \1... ", t),   # a longer pause after the pet name
}


def run(name):
    rows = []
    for i, text in enumerate(MSGS):
        said = TWEAKS[name](text)
        f = OUT / f"{name}_{i}.wav"
        if not f.exists():
            f.write_bytes(pipeline.own_voice_tts(said, REFS))
        heard = pipeline.asr(f.read_bytes(), "darija")["text"]
        rows.append({"text": text, "said": said, "heard": heard, "opening": opening_ok(text, heard), "clear": match(text, heard)})
    return name, rows


with ThreadPoolExecutor(3) as ex:
    results = dict(ex.map(run, TWEAKS))
for name, rows in results.items():
    o = sum(r["opening"] for r in rows)
    c = sum(r["clear"] for r in rows) / len(rows)
    print(f"{name:11s} opening right {o}/{len(rows)}   clear {c:.0%}")
(ROOT / "eval/results/voice_opening.json").write_text(json.dumps(results, ensure_ascii=False, indent=1), encoding="utf-8")
