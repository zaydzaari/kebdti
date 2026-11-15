"""Final held-out test for Kebdti: 41 real Moroccan expressions / proverbs (eval/final_phrases.json).

Systems:
  luna_plain   GPT-6 Luna, bare translate prompt ("just ask a general AI" baseline)
  luna_v31     GPT-6 Luna, Kebdti prompt v3.1 + glossary   <- our system
  gemini_v31   Gemini 3.8 Flash, same prompt                <- the other finalist
Scoring:
  - automatic literal-trap check (all 4 languages)
  - added feeling on the 3 neutral messages
  - blind LLM judge (GPT-6.1 Terra, a different model): the 3 English outputs are shuffled as A/B/C,
    and the judge scores each against the gold meaning: 2 = real meaning, 1 = partly / literal but guessable,
    0 = wrong or confusing; plus "added content".

Usage: .venv/Scripts/python -X utf8 eval/bench_final.py [--reuse]
"""
import argparse
import json
import random
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from bench_translate import client_for, extract_json  # noqa: E402
from bench_round3 import call_msgs  # noqa: E402
from prompts_v3 import d2x_system  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "eval" / "results" / "raw"
JUDGE = "openai/gpt-6.1-terra"
EMOTIONAL = {"love", "longing", "blessing", "care", "worry", "pride"}

SYS_PLAIN = """Translate this Moroccan Arabic (Darija) message into French, Spanish, Italian and English.
Output ONLY a JSON object: {"translations": {"fr": "...", "es": "...", "it": "...", "en": "..."}}"""

SYS_JUDGE = """You grade translations of Moroccan Darija messages from a grandparent to a grandchild abroad.
You get the gold meaning and several English translations (A, B, C). For each translation give:
- meaning: 2 = a grandchild would understand the real intended meaning; 1 = partly, or literal wording that is still guessable; 0 = wrong, missing, or would confuse/upset the grandchild
- added: true if it adds feeling or content that the gold meaning does not contain
Proverbs may keep their image IF the real meaning is clear. Output ONLY JSON: {"A": {"meaning": 0, "added": false}, "B": {...}, "C": {...}}"""


def systems(glossary):
    v31 = d2x_system(glossary)
    return {
        "luna_plain": ("openai/gpt-6-luna", SYS_PLAIN, False),
        "luna_v31": ("openai/gpt-6-luna", v31, True),
        "gemini_v31": ("google/gemini-3.8-flash", v31, True),
    }


def run_system(name, spec, items, reuse):
    raw = RAW / f"final_{name}.jsonl"
    if reuse and raw.exists():
        return name, [json.loads(l) for l in open(raw, encoding="utf-8")]
    model, sysmsg, rich = spec
    client = client_for("zenmux")
    rows = []
    for p in items:
        user = f"Grandparent's message (Darija): {p['darija']}\n(Latin transcription: {p['latin']})" if rich else p["darija"]
        try:
            res = call_msgs(client, model, [{"role": "system", "content": sysmsg}, {"role": "user", "content": user}])
        except Exception as e:
            res = dict(text=None, error=str(e)[:300], latency=None, cost=0.0)
        res.update(id=p["id"], parsed=extract_json(res.get("text")))
        rows.append(res)
    with open(raw, "w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    return name, rows


def en_of(r):
    j = r.get("parsed") if r else None
    return ((j or {}).get("translations") or {}).get("en") if isinstance(j, dict) else None


def judge_item(client, p, outs, seed):
    names = list(outs)
    random.Random(seed).shuffle(names)
    letters = dict(zip("ABC", names))
    user = f"Darija: {p['darija']}\nGold meaning: {p['meaning_en']}\n\n" + "\n".join(f"{L}: {outs[n] or '(no output)'}" for L, n in letters.items())
    try:
        res = call_msgs(client, JUDGE, [{"role": "system", "content": SYS_JUDGE}, {"role": "user", "content": user}])
        j = extract_json(res["text"]) or {}
    except Exception as e:
        return {}, 0.0, str(e)[:200]
    return {letters[L]: j.get(L, {}) for L in letters}, res.get("cost") or 0, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--reuse", action="store_true")
    args = ap.parse_args()
    data = json.load(open(ROOT / "eval" / "final_phrases.json", encoding="utf-8"))
    gloss = json.load(open(ROOT / "eval" / "round2_phrases.json", encoding="utf-8"))["glossary"]
    items = data["items"]
    specs = systems(gloss)

    with ThreadPoolExecutor(max_workers=3) as ex:
        res = dict(ex.map(lambda kv: run_system(kv[0], kv[1], items, args.reuse), specs.items()))
    by = {n: {r["id"]: r for r in rows} for n, rows in res.items()}

    jpath = RAW / "final_judge.jsonl"
    if args.reuse and jpath.exists():
        judged = {d["id"]: d for d in (json.loads(l) for l in open(jpath, encoding="utf-8"))}
    else:
        jc = client_for("zenmux")
        def one(ip):
            i, p = ip
            g, c, err = judge_item(jc, p, {n: en_of(by[n].get(p["id"])) for n in specs}, seed=i)
            return dict(id=p["id"], grades=g, cost=c, error=err)
        with ThreadPoolExecutor(max_workers=6) as ex:
            judged = {d["id"]: d for d in ex.map(one, enumerate(items))}
        with open(jpath, "w", encoding="utf-8") as f:
            for d in judged.values():
                f.write(json.dumps(d, ensure_ascii=False) + "\n")

    trap_items = [p for p in items if p["literal_traps"]]
    neutral = [p["id"] for p in items if p["feeling"] == ["neutral"]]
    gen_cost = {n: sum(r.get("cost") or 0 for r in rows) for n, rows in res.items()}
    judge_cost = sum(d.get("cost") or 0 for d in judged.values())

    L = ["# Final held-out test: 41 real Moroccan expressions and proverbs\n",
         f"{len(items)} messages (16 proverbs/idioms from the web, 22 everyday grandparent expressions, 3 neutral). None are in the glossary or the examples. "
         f"Judge: `{JUDGE}`, blind (outputs shuffled as A/B/C), English only.\n",
         "| System | Real meaning (judge, 0–2 avg) | Fully understood (score 2) | Confusing / wrong (score 0) | Added content (judge) | Literal traps hit (any language) | Added feeling on neutral | Median latency (s) | Cost / message |",
         "|---|---|---|---|---|---|---|---|---|"]
    summary = {}
    for n in specs:
        g = [judged[p["id"]]["grades"].get(n, {}) for p in items]
        ms = [x.get("meaning") for x in g if isinstance(x.get("meaning"), (int, float))]
        full = sum(1 for m in ms if m == 2)
        zero = sum(1 for m in ms if m == 0)
        added = sum(1 for x in g if x.get("added") is True)
        traps = 0
        for p in trap_items:
            j = by[n][p["id"]].get("parsed")
            tr = " ".join(str(v) for v in ((j or {}).get("translations") or {}).values()).lower() if isinstance(j, dict) else ""
            traps += any(t.lower() in tr for t in p["literal_traps"])
        af = "—" if n == "luna_plain" else str(sum(1 for i in neutral if set(map(str.lower, map(str, (by[n][i].get("parsed") or {}).get("feeling") or []))) & EMOTIONAL)) + f"/{len(neutral)}"
        lat = sorted(r["latency"] for r in res[n] if r.get("latency"))
        avg = sum(ms) / len(ms) if ms else 0
        summary[n] = dict(avg=avg, full=full, zero=zero, added=added, traps=traps)
        L.append(f"| **{n}** | {avg:.2f} | {full}/{len(ms)} | {zero}/{len(ms)} | {added}/{len(ms)} | {traps}/{len(trap_items)} | {af} | {lat[len(lat)//2] if lat else '—'} | ${gen_cost[n]/len(items):.5f} |")
    L.append(f"\n**ZenMux cost:** generation ${sum(gen_cost.values()):.4f} + judge ${judge_cost:.4f} = **${sum(gen_cost.values()) + judge_cost:.4f}**\n")

    L.append("## Every message (EN, with judge score)\n")
    for p in items:
        L.append(f"\n### {p['id']} [{p['source']}] {p['darija']}  \n_{p['latin']}_ · gold: _{p['meaning_en']}_\n")
        for n in specs:
            r = by[n].get(p["id"])
            g = judged[p["id"]]["grades"].get(n, {})
            j = (r or {}).get("parsed")
            fr = ((j or {}).get("translations") or {}).get("fr") if isinstance(j, dict) else None
            L.append(f"- **{n}** [{g.get('meaning', '?')}{' +added' if g.get('added') else ''}]: EN: {en_of(r) or '❌ ' + str((r or {}).get('error'))} | FR: {fr}")
    out = ROOT / "eval" / "results" / "final_report.md"
    out.write_text("\n".join(L), encoding="utf-8")
    print(json.dumps(summary, indent=1))
    print(f"report: {out}\ncost: ${sum(gen_cost.values()) + judge_cost:.4f}")


if __name__ == "__main__":
    main()
