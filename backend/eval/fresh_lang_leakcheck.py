"""Leak check for eval/fresh_lang_test.json: is any key expression (or its core words) already in the prompt or an earlier set?"""
import json, re, pathlib
E = pathlib.Path(__file__).parent
corpus = {f.name: f.read_text(encoding="utf-8") for f in [E / "prompts_v4.py"] + [p for p in E.glob("*.json") if p.name != "fresh_lang_test.json"]}
norm = lambda s: re.sub(r"[ً-ْـ،.؟!]", "", s)
items = json.load(open(E / "fresh_lang_test.json", encoding="utf-8"))["items"]
leaks = 0
for it in items:
    k = norm(it["key"])
    if not k:
        continue
    found = [n for n, t in corpus.items() if k in norm(t)]
    words = [w for w in k.split() if len(w) > 3 and w not in ("الله", "عليك", "ديال", "هاد")]
    partial = {w: [n for n, t in corpus.items() if w in norm(t)] for w in words}
    partial = {w: v for w, v in partial.items() if v}
    leaks += bool(found)
    print(f"{it['id']} {it['key']:<26} exact:{found or '-'}  words:{partial or '-'}")
print("exact leaks:", leaks)
