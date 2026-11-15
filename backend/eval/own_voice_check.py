"""Check someone's own voice on the live site: send a few test messages (never shown to the family), score how clear the
Darija in their voice is, and build a listening page.  python -X utf8 eval/own_voice_check.py [URL] [member]"""
import difflib, html, json, re, subprocess, sys, urllib.request, uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from dotenv import load_dotenv
load_dotenv(ROOT / ".env")
from app import pipeline

U = sys.argv[1] if len(sys.argv) > 1 else "https://kebdti.51-170-131-7.sslip.io"
ME = sys.argv[2] if len(sys.argv) > 2 else "yanis"
OUT = ROOT / "data/voicefix/english"
OUT.mkdir(parents=True, exist_ok=True)
MESSAGES = ["Hi grandma, I love you so much.",
            "Grandma, I passed my driving test today! I can't wait to drive you to the market this summer.",
            "I miss you a lot. School is hard this year because of the exams, but I'm working hard. Please pray for me, and I'll call you on Sunday."]

AR = re.compile(r"[ً-ْـ]")
SKIP = set("اأإآوىيءؤئةه ")


def sound(target, heard):
    sk = lambda t: [c for c in AR.sub("", t or "") if "ء" <= c <= "ي" and c not in SKIP]
    a, b = sk(target), sk(heard)
    return sum(m.size for m in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks()) / max(1, len(a))


def form(url, fields):
    b = uuid.uuid4().hex
    data = b"".join(f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode() for k, v in fields.items()) + f"--{b}--\r\n".encode()
    return json.load(urllib.request.urlopen(urllib.request.Request(url, data=data, headers={"Content-Type": f"multipart/form-data; boundary={b}"}), timeout=240))


rows = []
for i, msg in enumerate(MESSAGES):
    r = form(U + "/api/test/translate", {"auto": "1", "me_id": ME, "with_id": "fatna", "text": msg, "test": "1"})
    wav = urllib.request.urlopen(U + r["audioUrl"], timeout=60).read()
    f = OUT / f"msg{i}.wav"
    f.write_bytes(wav)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(f), "-b:a", "128k", str(f.with_suffix(".mp3"))], check=True)
    heard = pipeline.asr(wav, "darija")["text"]
    rows.append({"english": msg, "darija": r["translation"], "latin": r.get("translit"), "own_voice": r.get("cloned"), "heard": heard, "clear": round(sound(r["translation"], heard), 3)})
    print(f"[{rows[-1]['clear']:.0%} clear, own voice={r.get('cloned')}] {msg}\n   said : {r['translation']}\n   heard: {heard}", flush=True)

avg = sum(r["clear"] for r in rows) / len(rows)
print(f"\naverage clear: {avg:.0%}")
cards = "".join(f'''<article><p class="en">{html.escape(r['english'])}</p><p class="ar" dir="rtl">{html.escape(r['darija'])}</p>
<p class="lat">{html.escape(r['latin'] or '')}</p><audio controls preload="none" src="msg{i}.mp3"></audio><small>{round(r['clear']*100)}% clear</small></article>''' for i, r in enumerate(rows))
(OUT / "index.html").write_text(f'''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your English recording: your voice in Darija</title>
<style>body{{margin:0;font:16px/1.5 system-ui,sans-serif;background:#1b1917;color:#f2ece4}}main{{max-width:720px;margin:0 auto;padding:28px 18px}}h1{{font-size:24px}}
article{{background:#211f1c;border:1px solid #39332e;border-radius:14px;padding:14px 16px;margin:12px 0;display:flex;flex-direction:column;gap:6px}}.en{{margin:0;color:#c2b9ad}}
.ar{{margin:0;font-size:21px;line-height:1.7}}.lat{{margin:0;color:#a79b8d;font-style:italic;font-size:14px}}audio{{width:100%}}small{{color:#c3cfb4;font-weight:600}}</style></head><body><main>
<h1>Your voice in Darija, learned from your English recording</h1><p style="color:#c2b9ad">What Mi Fatna hears when you send these English messages. Average {round(avg*100)}% clear.</p>{cards}</main></body></html>''', encoding="utf-8")
