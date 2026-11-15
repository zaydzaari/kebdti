"""Round 5: Luna + prompt v4.2 on a fresh held-out set (eval/round5_test.json), via Straitly.

d2x systems (32 messages):
  luna_plain_high   bare prompt, thinking high (baseline: same model and effort, no Kebdti prompt)
  luna_v42_low      prompt v4.2, thinking low (fast option)
  luna_v42_high     prompt v4.2, thinking high (candidate)
x2d: luna_v42_high on 10 grandchild messages (family address word passed when known).
Blind judge: GPT-6.1 Terra on the English output.

Usage: .venv/Scripts/python -X utf8 eval/bench_round5.py [--reuse]
"""
import argparse
import json
import random
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from bench_final import SYS_PLAIN  # noqa: E402
from bench_luna import call, straitly  # noqa: E402
from bench_round3 import BAD_WORDS  # noqa: E402
from bench_translate import extract_json  # noqa: E402
from bench_v4 import SYS_JUDGE, en_of  # noqa: E402
import prompts_v4 as v4  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "eval" / "results" / "raw"
EMOTIONAL = {"love", "longing", "blessing", "care", "worry", "pride", "sadness"}
SYSTEMS = {
    "luna_plain_high": ("high", lambda p: [{"role": "system", "content": SYS_PLAIN}, {"role": "user", "content": p["darija"]}]),
    "luna_v42_low": ("low", lambda p: v4.d2x_messages(p["darija"], None, p.get("profile_gender"))),
    "luna_v42_high": ("high", lambda p: v4.d2x_messages(p["darija"], None, p.get("profile_gender"))),
}
# Note: no Latin transcription is given here (the real app only has the speech-recognition output).


def run_rows(name, items, make, effort, reuse, extra=lambda p: {}):
    raw = RAW / f"r5_{name}.jsonl"
    done = {}
    if raw.exists():
        done = {r["id"]: r for r in map(json.loads, open(raw, encoding="utf-8")) if isinstance(r.get("parsed"), dict)}
    if reuse:
        return [done.get(p["id"]) or dict(id=p["id"], parsed=None, error="missing") for p in items]
    c = straitly()

    def one(p):
        if p["id"] in done:
            return done[p["id"]]
        try:
            res = call(c, "gpt-6-luna", make(p), effort)
        except Exception as e:
            res = dict(text=None, error=str(e)[:300], latency=None, cost=0.0)
        res.update(id=p["id"], parsed=extract_json(res.get("text")), **extra(p))
        return res
    with ThreadPoolExecutor(max_workers=6) as ex:
        rows = list(ex.map(one, items))
    with open(raw, "w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--reuse", action="store_true")
    args = ap.parse_args()
    data = json.load(open(ROOT / "eval" / "round5_test.json", encoding="utf-8"))
    items, xs = data["darija_to_x"], data["x_to_darija"]
    res = {n: run_rows(n, items, mk, eff, args.reuse) for n, (eff, mk) in SYSTEMS.items()}
    x2d = run_rows("luna_v42_high_x2d", xs, lambda p: v4.x2d_messages(p["sender"], p["to"], p["lang"], p["text"], p.get("address")),
                   "high", args.reuse, extra=lambda p: dict(text_in=p["text"]))
    for n, rs in list(res.items()) + [("x2d", x2d)]:
        print(f"{n}: {sum(isinstance(r.get('parsed'), dict) for r in rs)}/{len(rs)} ok, ${sum(r.get('cost') or 0 for r in rs):.4f}", flush=True)
    by = {n: {r["id"]: r for r in rows} for n, rows in res.items()}
    names = list(SYSTEMS)

    jpath = RAW / "r5_judge.jsonl"
    if args.reuse and jpath.exists():
        judged = {d["id"]: d for d in map(json.loads, open(jpath, encoding="utf-8"))}
    else:
        c = straitly()

        def one(ip):
            i, p = ip
            order = list(names)
            random.Random(500 + i).shuffle(order)
            letters = dict(zip("ABC", order))
            user = f"Darija: {p['darija']}\nGold meaning: {p['meaning_en']}\n\n" + "\n".join(f"{L}: {en_of(by[n].get(p['id'])) or '(no output)'}" for L, n in letters.items())
            try:
                r = call(c, "gpt-6.1-terra", [{"role": "system", "content": SYS_JUDGE.replace("(A, B, C, D)", "(A, B, C)")}, {"role": "user", "content": user}], "low")
                j = extract_json(r["text"]) or {}
                return dict(id=p["id"], grades={letters[L]: j.get(L, {}) for L in letters}, cost=r["cost"])
            except Exception as e:
                return dict(id=p["id"], grades={}, cost=0, error=str(e)[:200])
        with ThreadPoolExecutor(max_workers=6) as ex:
            judged = {d["id"]: d for d in ex.map(one, enumerate(items))}
        with open(jpath, "w", encoding="utf-8") as f:
            for d in judged.values():
                f.write(json.dumps(d, ensure_ascii=False) + "\n")

    neutral = [p["id"] for p in items if p["feeling"] == ["neutral"]]
    traps = [p for p in items if p["literal_traps"]]
    asr = [p["id"] for p in items if p.get("asr_noise")]
    L = ["# Round 5: Luna + prompt v4.2 on a fresh held-out set\n",
         f"{len(items)} Darija messages (none of the key expressions are in the prompt; {len(asr)} contain speech-recognition-style noise; {len(neutral)} neutral). "
         "No Latin transcription given (like the real app). Judge: GPT-6.1 Terra, blind, English only.\n",
         "| System | Meaning (avg 0–2) | Fully understood | Wrong/confusing | Added content | Natural (1–3) | Literal traps | Neutral kept neutral | Noisy speech understood | Median latency (s) | Cost / msg |",
         "|---|---|---|---|---|---|---|---|---|---|---|"]
    summary = {}
    for n in names:
        g = {p["id"]: judged[p["id"]]["grades"].get(n, {}) for p in items}
        ms = [x.get("meaning") for x in g.values() if isinstance(x.get("meaning"), (int, float))]
        nat = [x.get("natural") for x in g.values() if isinstance(x.get("natural"), (int, float))]
        added = sum(1 for x in g.values() if x.get("added") is True)
        th = 0
        for p in traps:
            j = by[n][p["id"]].get("parsed")
            tr = " ".join(str(v) for v in ((j or {}).get("translations") or {}).values()).lower() if isinstance(j, dict) else ""
            th += any(t.lower() in tr for t in p["literal_traps"])
        nk = "—" if "plain" in n else f"{sum(1 for i in neutral if not (set(map(str.lower, map(str, ((by[n][i].get('parsed') or {}).get('feeling') or [])))) & EMOTIONAL))}/{len(neutral)}"
        af = sum(1 for i in asr if g[i].get("meaning") == 2)
        lat = sorted(r["latency"] for r in res[n] if r.get("latency"))
        summary[n] = dict(avg=round(sum(ms) / max(len(ms), 1), 2), full=sum(m == 2 for m in ms), zero=sum(m == 0 for m in ms), added=added, traps=th)
        L.append(f"| **{n}** | {summary[n]['avg']:.2f} | {summary[n]['full']}/{len(ms)} | {summary[n]['zero']} | {added} | {sum(nat)/max(len(nat),1):.2f} | {th}/{len(traps)} | {nk} | {af}/{len(asr)} | {lat[len(lat)//2] if lat else '—'} | ${sum(r.get('cost') or 0 for r in res[n])/len(items):.5f} |")
    bad = sum(sum(w in ((r.get("parsed") or {}).get("darija_arabic") or "") for w in BAD_WORDS) for r in x2d)
    total = sum(r.get("cost") or 0 for rs in list(res.values()) + [x2d] for r in rs) + sum(d.get("cost") or 0 for d in judged.values())
    L.append(f"\nInto Darija (10 messages, high): non-Moroccan words found: {bad}.  \n**Straitly cost of this round:** ${total:.4f}\n\n## Every message\n")
    for p in items:
        L.append(f"\n### {p['id']} {'[noisy speech] ' if p.get('asr_noise') else ''}{p['darija']}  \n_{p['latin']}_ · gold: _{p['meaning_en']}_ · profile: {p.get('profile_gender')}\n")
        for n in names:
            r = by[n].get(p["id"])
            g = judged[p["id"]]["grades"].get(n, {})
            j = (r or {}).get("parsed") or {}
            fr = (j.get("translations") or {}).get("fr") if isinstance(j, dict) else None
            L.append(f"- **{n}** [{g.get('meaning', '?')}{' +added' if g.get('added') else ''}]: EN: {en_of(r) or '❌ ' + str((r or {}).get('error'))} | FR: {fr}")
    L.append("\n## Into Darija (team: rate these)\n")
    for p, r in zip(xs, x2d):
        j = r.get("parsed") or {}
        L.append(f"- **{p['id']}** ({p['lang']}, {p['sender']} → {p['to']}, family word: {p.get('address')}) {p['text']}\n  → {j.get('darija_arabic')} · {j.get('feeling')}")
    out = ROOT / "eval" / "results" / "round5_report.md"
    out.write_text("\n".join(L), encoding="utf-8")
    print(json.dumps(summary, indent=1))
    print(f"report: {out}\nstraitly cost: ${total:.4f}")


if __name__ == "__main__":
    main()
