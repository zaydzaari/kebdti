"""Into-Darija check: do grandchildren's messages come out as real Moroccan Darija (no Standard Arabic words)?
20 everyday messages, mostly English (the judges' language). Prints each translation, any word repaired, and the totals.
python -X utf8 eval/darija_purity.py  -> eval/results/darija_purity.json"""
import json, sys, time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from dotenv import load_dotenv
load_dotenv(ROOT / ".env")
from app import pipeline

MSGS = [
    ("en", "boy", "Grandma, I passed my driving test today!"),
    ("en", "boy", "I miss you a lot. School is hard this year because of the exams, but I'm working hard. Please pray for me."),
    ("en", "girl", "I'm going to visit you this summer, I promise."),
    ("en", "boy", "I tried to cook your couscous recipe but it wasn't as good as yours."),
    ("en", "girl", "Grandpa, I got accepted into university! I'm going to study medicine."),
    ("en", "boy", "Did you take your medicine today? Mom said your knee hurts."),
    ("en", "girl", "I saw a woman at the market who looked just like you and I almost cried."),
    ("en", "boy", "I'm a bit sad today, I had a fight with my best friend."),
    ("en", "girl", "Thank you so much for the money you sent, you didn't have to."),
    ("en", "boy", "I'm really excited, we won the football match 3 to 1 and I scored!"),
    ("en", "girl", "When I was little you used to tell me stories before I slept. I still remember them."),
    ("en", "boy", "Can you send me a voice note singing the song you used to sing?"),
    ("en", "girl", "I'm trying to learn Darija so I can talk to you better."),
    ("en", "boy", "It's snowing here and it's so cold. I wish I was in the sun with you."),
    ("en", "girl", "I will call you on Sunday after lunch, okay?"),
    ("en", "boy", "Happy Eid grandma! I wish I was there with all the family."),
    ("fr", "boy", "Mamie, j'ai eu mon bac avec mention très bien !"),
    ("es", "girl", "Abuela, mañana tengo un examen muy difícil, reza por mí."),
    ("it", "boy", "Nonna, ho trovato un lavoro! Comincio lunedì."),
    ("en", "girl", "Don't worry about me, I'm eating well and sleeping well."),
]


def one(m):
    lang, g, text = m
    to = "grandfather" if text.startswith("Grandpa") else "grandmother"
    j = pipeline.translate_to_grandparent(text, "auto", g, to, "أ جدي" if to == "grandfather" else "أ جدة", [])
    return {"lang": lang, "text": text, "darija": j.get("darija_arabic", ""), "fixed": j.get("darija_fixed", []),
            "left": pipeline.not_darija(j.get("darija_arabic", "")), "source_lang": j.get("source_lang"), "seconds": j.get("seconds")}


t0 = time.time()
with ThreadPoolExecutor(5) as ex:
    rows = list(ex.map(one, MSGS))
for r in rows:
    flag = f"  [repaired: {', '.join(r['fixed'])}]" if r["fixed"] else ""
    flag += f"  [STILL: {', '.join(r['left'])}]" if r["left"] else ""
    print(f"{r['lang']} {r['source_lang']} | {r['text']}\n      {r['darija']}{flag}")
print(f"\nrepaired: {sum(1 for r in rows if r['fixed'])}/{len(rows)}   still not Darija: {sum(1 for r in rows if r['left'])}/{len(rows)}"
      f"   language detected right: {sum(1 for r in rows if r['source_lang'] == r['lang'])}/{len(rows)}   {time.time() - t0:.0f}s")
(ROOT / "eval/results/darija_purity.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")
