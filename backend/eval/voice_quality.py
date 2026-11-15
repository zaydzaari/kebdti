"""Voice quality per path and language: does the cloned voice say every word?

For each voice path the app uses, a few realistic messages (short, medium, long) are spoken, transcribed back with
speech recognition in that language, and compared with the text:
  kept = share of the words heard back in order (a swallowed or garbled word lowers it)
  pace = letters per second
Run: python -X utf8 eval/voice_quality.py [path ...] [--variant NAME]   ->  eval/results/voice_quality.json (+ audio in data/voicefix/quality)
"""
import difflib, json, re, subprocess, sys, time, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from dotenv import load_dotenv
load_dotenv(ROOT / ".env")
from app import pipeline

OUT = ROOT / "data/voicefix/quality"
OUT.mkdir(parents=True, exist_ok=True)
RES = ROOT / "eval/results/voice_quality.json"

# What each voice really says in the app: grandma's messages after translation, grandchildren's messages after translation.
TEXTS = {
    "fr": ["Mon cœur, que Dieu te protège.",
           "Tu me manques tellement, mon fils. Appelle-moi quand tu rentres de l'école, d'accord ?",
           "Si Dieu le veut, tout ira bien. Dis-moi simplement ce qui se passe, ne me cache rien. Mange bien, couvre-toi, et que Dieu te garde pour moi."],
    "es": ["Mi corazón, que Dios te proteja.",
           "Te echo muchísimo de menos, hija mía. Llámame cuando vuelvas del colegio, ¿vale?",
           "Si Dios quiere, todo irá bien. Cuéntame lo que pasa, no me escondas nada. Come bien, abrígate, y que Dios te guarde para mí."],
    "it": ["Cuore mio, che Dio ti protegga.",
           "Mi manchi tantissimo, figlio mio. Chiamami quando torni da scuola, va bene?",
           "Se Dio vuole, andrà tutto bene. Dimmi solo cosa succede, non nascondermi niente. Mangia bene, copriti, e che Dio ti protegga per me."],
    "en": ["My darling, may God protect you.",
           "I miss you so much, my boy. Call me when you get back from school, okay?",
           "God willing, everything will be fine. Just tell me what's going on, don't hide anything from me. Eat well, stay warm, and may God keep you for me."],
    "darija": ["أ كبدتي، الله يحفظك.",
               "أ وليدي، تهلا فراسك.",
               "الله يرضي عليك أ بنتي.",
               "توحشتك بزاف أ وليدي. عيط ليا ملي ترجع من المدرسة، واخا؟",
               "إن شاء الله كلشي غادي يكون مزيان. غير قول ليا شنو واقع، ما تخبي عليا والو. كول مزيان، تغطى، والله يخليك ليا."],
}
CHILD = ["أ جدة، كنبغيك بزاف.",
         "أ جدة، شكرا على الدعاء ديالك.",
         "صافي أ جدة، غادي نعيط ليك غدا.",
         "سلام أ جدة، كيف دايرة؟ نجحت فالامتحان ديالي، دعّي معايا.",
         "توحشتك بزاف أ جدة. عندي الباك هاد العام وراه صعيب، ولكن كنخدم مزيان. إن شاء الله نجي نشوفك فالصيف وناكل الكسكسو ديالك."]

AR = re.compile(r"[ً-ْـ]")


def words(t, lang):
    t = t or ""
    if lang == "darija":
        t = re.sub("[إأآا]", "ا", AR.sub("", t)).replace("ى", "ي").replace("ة", "ه").replace("ؤ", "و")
        return re.findall(r"[ء-ي]+", t)
    t = unicodedata.normalize("NFKD", t.lower())
    t = "".join(c for c in t if not unicodedata.combining(c)).replace("’", "'")
    return re.findall(r"[a-z]+", t)


def kept(target, heard, lang):
    a, b = words(target, lang), words(heard, lang)
    return sum(m.size for m in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks()) / max(1, len(a))


SKIP = set("اأإآوىيءؤئةه ")


def sound(target, heard, lang):
    if lang != "darija":
        return kept(target, heard, lang)
    sk = lambda t: [c for c in AR.sub("", t or "") if "\u0621" <= c <= "\u064A" and c not in SKIP]
    a, b = sk(target), sk(heard)
    return sum(m.size for m in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks()) / max(1, len(a))


def seconds(wav):
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", "pipe:0", "-ac", "1", "-ar", "16000", "-f", "s16le", "pipe:1"],
                         input=wav, capture_output=True, check=True).stdout
    return len(pcm) / 32000


def own_voice_id():
    p = ROOT / "data/audio/voices/yanis/enroll.json"
    return json.loads(p.read_text(encoding="utf-8")).get("eleven_voice_id") if p.exists() else None


def speak(path, text, variant):
    """path: grandma-<lang> or child-darija. variant: 'app' = what the app does now, or a named alternative."""
    if path.startswith("grandma-"):
        lang = path.split("-", 1)[1]
        variant = variant.split("+")[0]
        if variant == "app":
            return pipeline.tts(text, lang, "grandmother")["wav"]
        if variant.startswith("fish"):
            return pipeline.fish_tts(text, variant)
        return pipeline.eleven_tts(text, pipeline.cloned_voice("grandmother"), variant)
    vid = own_voice_id()
    variant = variant.split("+")[0]
    return pipeline.eleven_tts(text, vid, "eleven_v3" if variant == "app" else variant)


TWEAKS = {
    "pad": lambda t: "… " + t,                                                    # a breath before the first word
    "aa": lambda t: re.sub(r"(^|[\s،,.؟!])أ (?=\S)", r"\1آ ", t),               # vocative a -> long aa (how it's said)
    "ya": lambda t: re.sub(r"(^|[\s،,.؟!])أ (?=\S)", r"\1يا ", t),              # vocative a -> ya
    "join": lambda t: re.sub(r"(^|[\s،,.؟!])أ (?=\S)", r"\1آ", t),              # aa glued to the name: آكبدتي
}


def run(path, variant="app", transform=None):
    lang = path.split("-", 1)[1]
    texts = CHILD if path.startswith("child") else TEXTS[lang]
    rows = []
    for i, text in enumerate(texts):
        said = transform(text) if transform else text
        f = OUT / f"{path}_{variant}_{abs(hash(said)) % 10**8}.wav"
        if not f.exists():
            f.write_bytes(speak(path, said, variant))
        wav = f.read_bytes()
        heard = pipeline.asr(wav, "darija" if lang == "darija" else lang)["text"]
        sec = seconds(wav)
        rows.append({"i": i, "text": text, "said": said, "heard": heard, "kept": round(kept(text, heard, lang), 3),
                     "sound": round(sound(text, heard, lang), 3), "seconds": round(sec, 1),
                     "pace": round(len("".join(words(text, lang))) / max(sec, 0.1), 1)})
    k = sum(r["kept"] for r in rows) / len(rows)
    snd = sum(r["sound"] for r in rows) / len(rows)
    print(f"{path:16s} {variant:16s} words {k:5.0%}  sounds {snd:5.0%}  " + " ".join(f"[{r['sound']:.0%}]" for r in rows), flush=True)
    return {"path": path, "variant": variant, "kept": round(k, 3), "sound": round(snd, 3), "rows": rows, "at": int(time.time())}


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    variant = next((a.split("=", 1)[1] for a in sys.argv[1:] if a.startswith("--variant=")), "app")
    tweak = next((a.split("=", 1)[1] for a in sys.argv[1:] if a.startswith("--tweak=")), "")
    paths = args or ["grandma-darija", "grandma-fr", "grandma-es", "grandma-it", "grandma-en", "child-darija"]
    old = json.loads(RES.read_text(encoding="utf-8")) if RES.exists() else []
    for p in paths:
        fns = [TWEAKS[t] for t in tweak.split("+") if t]
        tf = (lambda t: __import__("functools").reduce(lambda acc, fn: fn(acc), fns, t)) if fns else None
        r = run(p, variant + (f"+{tweak}" if tweak else ""), tf)
        old = [o for o in old if not (o["path"] == r["path"] and o["variant"] == r["variant"])] + [r]
        RES.write_text(json.dumps(old, ensure_ascii=False, indent=1), encoding="utf-8")
