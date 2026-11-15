"""Round 2 for Kebdti: top models x 3 systems.

Systems (Darija -> FR/ES/IT/EN, one call returns all four):
  plain        "just ask a general AI": a bare translate prompt
  kebdti       feeling-aware prompt, no glossary
  kebdti_gloss feeling-aware prompt + grandma glossary (few-shot knowledge)
Plus FR/ES/IT/EN -> Darija with the Kebdti prompt.

Usage: .venv/Scripts/python eval/bench_round2.py [--models ...]
"""
import argparse
import json
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from bench_translate import FEELINGS, call, client_for, extract_json  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent

MODELS = [
    ("zenmux", "openai/gpt-6-luna"),
    ("zenmux", "deepseek/deepseek-v4.1-flash"),
    ("zenmux", "google/gemini-3.8-flash"),   # AI Studio returned 503 (overloaded) on Nov 14, so via ZenMux
    ("gemini", "gemini-3.6-flash"),          # AI Studio free tier
]

SYS_PLAIN = """Translate this Moroccan Arabic (Darija) message into French, Spanish, Italian and English.
Output ONLY a JSON object: {"translations": {"fr": "...", "es": "...", "it": "...", "en": "..."}}"""

SYS_KEBDTI = f"""You are Kebdti, a translator that carries the FEELING of a Moroccan grandparent's Darija (Moroccan Arabic) to grandchildren who live abroad and don't speak Darija.

Rules:
1. Translate the meaning and the emotion, not word for word. Moroccan endearments, blessings (du3a) and proverbs must become what a loving grandparent would naturally say in the target language.
2. Never add emotion or content that is not there. Practical or neutral messages stay neutral and plain. Don't add explanations to the translation itself.
3. Keep names, numbers and dates exact.
4. Darija marks gender (a wlidi = my boy, a benti = my girl, verb endings like -ti / -i). Keep the grandchild's gender correct in French, Spanish and Italian. If the gender is unknown, prefer neutral wording.
5. cultural_notes: only for expressions whose literal meaning would confuse a foreigner. Give the expression (Latin letters), its literal meaning and its real meaning, in English, short.
6. feeling: 1 to 3 tags from {FEELINGS}.
7. Output ONLY a JSON object, no markdown, with this shape:
{{"translations": {{"fr": "...", "es": "...", "it": "...", "en": "..."}}, "feeling": ["..."], "cultural_notes": [{{"expression": "...", "literal": "...", "meaning": "..."}}], "confidence": "high|medium|low"}}"""

SYS_X2D = f"""You are Kebdti. A grandchild living abroad sends a message to their grandparent in Morocco. The grandparent speaks only Moroccan Darija and cannot read; your text will be spoken by a voice.

Rules:
1. Write natural, warm Moroccan Darija exactly as a Moroccan family speaks it. NOT Modern Standard Arabic, not Egyptian, not Levantine.
2. Short, simple spoken sentences. Keep the meaning and feeling; don't add or remove content.
3. Address the grandparent the way a Moroccan grandchild would (grandmother: "a mi", "a jdda", "a 7nini"; grandfather: "a jddi", "a bba") and use the correct gender.
4. feeling: 1 to 3 tags from {FEELINGS}.
5. Output ONLY a JSON object, no markdown:
{{"darija_arabic": "...", "darija_latin": "...", "feeling": ["..."]}}"""


def gloss_prompt(glossary):
    lines = "\n".join(f"- {g['expression']}: literally \"{g['literal']}\", really means: {g['meaning']}" for g in glossary)
    return SYS_KEBDTI + "\n\nKnown Moroccan grandparent expressions (always use the real meaning, never the literal one):\n" + lines


def run_model(provider, model, data, out_dir):
    client = client_for(provider)
    systems = {"plain": SYS_PLAIN, "kebdti": SYS_KEBDTI, "kebdti_gloss": gloss_prompt(data["glossary"])}
    rows = []
    for p in data["darija_to_x"]:
        for sname, sprompt in systems.items():
            user = f"Grandparent's message (Darija): {p['darija']}\n(Latin transcription: {p['latin']})" if sname != "plain" else p["darija"]
            try:
                res = call(client, provider, model, sprompt, user)
            except Exception as e:
                res = dict(text=None, error=str(e)[:300], latency=None, cost=0.0)
            res.update(id=p["id"], system=sname, direction="d2x", parsed=extract_json(res.get("text")))
            rows.append(res)
    for p in data["x_to_darija"]:
        try:
            res = call(client, provider, model, SYS_X2D, f"Recipient: {p['to']}\nGrandchild's message ({p['lang']}): {p['text']}")
        except Exception as e:
            res = dict(text=None, error=str(e)[:300], latency=None, cost=0.0)
        res.update(id=p["id"], system="kebdti", direction="x2d", parsed=extract_json(res.get("text")))
        rows.append(res)
    with open(out_dir / f"round2_{model.replace('/', '__')}.jsonl", "w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    return model, rows


def trap_hit(p, j):
    tr = " ".join(str(v) for v in ((j or {}).get("translations") or {}).values()).lower()
    return any(t.lower() in tr for t in p.get("literal_traps", []))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", nargs="*")
    args = ap.parse_args()
    data = json.load(open(ROOT / "eval" / "round2_phrases.json", encoding="utf-8"))
    out_dir = ROOT / "eval" / "results" / "raw"
    out_dir.mkdir(parents=True, exist_ok=True)
    todo = [m for m in MODELS if not args.models or m[1] in args.models]

    results = {}
    with ThreadPoolExecutor(max_workers=len(todo)) as ex:
        for model, rows in ex.map(lambda m: run_model(m[0], m[1], data, out_dir), todo):
            results[model] = rows
            print(f"done: {model}", flush=True)

    gold = {p["id"]: p for p in data["darija_to_x"]}
    trap_items = [p for p in data["darija_to_x"] if p["literal_traps"]]
    neutral = [p["id"] for p in data["darija_to_x"] if p["feeling"] == ["neutral"]]
    L = ["# Round 2 — top models × 3 systems\n",
         f"Literal-trap items: {len(trap_items)} (in glossary: {sum(p['in_glossary'] for p in trap_items)}, not in glossary: {sum(not p['in_glossary'] for p in trap_items)}). Neutral items: {len(neutral)}.\n",
         "| Model | System | JSON ok | Literal traps hit (glossary / unseen) | Feeling match | Added feeling on neutral msgs | Median latency (s) | Cost (USD) |",
         "|---|---|---|---|---|---|---|---|"]
    total = 0.0
    for _, model in todo:
        rows = results[model]
        for sname in ["plain", "kebdti", "kebdti_gloss"]:
            rs = [r for r in rows if r["direction"] == "d2x" and r["system"] == sname]
            ok = [r for r in rs if isinstance(r.get("parsed"), dict)]
            hg = sum(1 for r in ok if gold[r["id"]]["in_glossary"] and trap_hit(gold[r["id"]], r["parsed"]))
            hu = sum(1 for r in ok if not gold[r["id"]]["in_glossary"] and trap_hit(gold[r["id"]], r["parsed"]))
            fm = sum(1 for r in ok if set(map(str.lower, map(str, r["parsed"].get("feeling") or []))) & set(gold[r["id"]]["feeling"]))
            af = sum(1 for r in ok if r["id"] in neutral and set(map(str.lower, map(str, r["parsed"].get("feeling") or []))) & {"love", "longing", "blessing", "care", "worry", "pride"})
            lat = sorted(r["latency"] for r in rs if r.get("latency"))
            cost = sum(r.get("cost") or 0 for r in rs)
            total += cost
            feel = "—" if sname == "plain" else f"{fm}/{len(ok)}"
            addf = "—" if sname == "plain" else f"{af}/{len(neutral)}"
            L.append(f"| `{model}` | {sname} | {len(ok)}/{len(rs)} | {hg} / {hu} | {feel} | {addf} | {lat[len(lat)//2] if lat else '—'} | {cost:.4f} |")
        x = [r for r in rows if r["direction"] == "x2d"]
        total += sum(r.get("cost") or 0 for r in x)
    L.append(f"\n**Total ZenMux cost:** ${total:.4f}\n\n## Side by side (EN / FR), plain vs kebdti_gloss\n")
    for p in data["darija_to_x"]:
        L.append(f"\n### {p['id']} {'[glossary]' if p['in_glossary'] else '[unseen]'} — {p['darija']}  \n_{p['latin']}_ · gold: _{p['meaning_en']}_ · gender: {p['gender']}\n")
        for _, model in todo:
            for sname in ["plain", "kebdti_gloss"]:
                r = next(r for r in results[model] if r["id"] == p["id"] and r["system"] == sname)
                j = r.get("parsed")
                if not isinstance(j, dict):
                    L.append(f"- **{model}** · {sname}: ❌ {r.get('error') or 'invalid JSON'}")
                    continue
                t = j.get("translations") or {}
                L.append(f"- **{model}** · {sname}: EN: {t.get('en')} | FR: {t.get('fr')}")
    L.append("\n## FR/ES/IT/EN → Darija\n")
    for p in data["x_to_darija"]:
        L.append(f"\n### {p['id']} ({p['lang']} → {p['to']}) — {p['text']}\n")
        for _, model in todo:
            r = next(r for r in results[model] if r["id"] == p["id"])
            j = r.get("parsed")
            L.append(f"- **{model}**: " + (f"{j.get('darija_arabic')}  _({j.get('darija_latin')})_" if isinstance(j, dict) else f"❌ {r.get('error') or 'invalid JSON'}"))
    out = ROOT / "eval" / "results" / "round2_report.md"
    out.write_text("\n".join(L), encoding="utf-8")
    print(f"report: {out}\ntotal zenmux cost: ${total:.4f}")


if __name__ == "__main__":
    main()
