"""Luna-only test on the fresh held-out set (eval/final_test_v4.json), via Straitly.

Systems:
  luna_plain    bare prompt, "just ask a general AI" baseline   (saved earlier, ZenMux)
  luna_v4       prompt v4, reasoning effort low                  (saved earlier, ZenMux)
  luna_v4_med   prompt v4, reasoning effort medium               (Straitly)
  luna_v4_high  prompt v4, reasoning effort high                 (Straitly)
Blind judge: GPT-6.1 Terra (Straitly), English output, the 4 systems shuffled as A-D.

Usage: .venv/Scripts/python -X utf8 eval/bench_luna.py [--reuse]
"""
import argparse
import json
import os
import random
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

sys.path.insert(0, str(Path(__file__).resolve().parent))
from bench_translate import extract_json  # noqa: E402
from bench_v4 import SYS_JUDGE, en_of  # noqa: E402
import prompts_v4 as v4  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "eval" / "results" / "raw"
load_dotenv(ROOT / ".env")
PRICE = {"gpt-6-luna": (0.06, 0.30), "gpt-6.1-terra": (0.60, 3.00)}  # USD per 1M tokens (Straitly, Nov 14)
EMOTIONAL = {"love", "longing", "blessing", "care", "worry", "pride", "sadness"}


def straitly():
    return OpenAI(base_url="https://api.straitly.ai/v1", api_key=os.environ["STRAITLY_API_KEY"], timeout=180, max_retries=2)


def call(client, model, messages, effort):
    t0 = time.time()
    r = client.chat.completions.create(model=model, messages=messages, max_tokens=16000, reasoning_effort=effort)
    u = r.usage
    pin, pout = PRICE[model]
    pt, ct = getattr(u, "prompt_tokens", 0) or 0, getattr(u, "completion_tokens", 0) or 0
    rt = getattr(getattr(u, "completion_tokens_details", None), "reasoning_tokens", None)
    return dict(text=r.choices[0].message.content, latency=round(time.time() - t0, 2), prompt_tokens=pt,
                completion_tokens=ct, reasoning_tokens=rt, cost=(pt * pin + ct * pout) / 1e6)


def run(name, effort, items, reuse):
    raw = RAW / f"v4_{name}.jsonl"
    done = {}
    if raw.exists():
        done = {r["id"]: r for r in map(json.loads, open(raw, encoding="utf-8")) if isinstance(r.get("parsed"), dict)}
    if reuse or effort is None:
        return [done.get(p["id"]) or dict(id=p["id"], parsed=None, error="missing") for p in items]
    c = straitly()

    def one(p):
        if p["id"] in done:
            return done[p["id"]]
        try:
            res = call(c, "gpt-6-luna", v4.d2x_messages(p["darija"], p["latin"]), effort)
        except Exception as e:
            res = dict(text=None, error=str(e)[:300], latency=None, cost=0.0)
        res.update(id=p["id"], parsed=extract_json(res.get("text")))
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
    items = json.load(open(ROOT / "eval" / "final_test_v4.json", encoding="utf-8"))["items"]
    systems = {"luna_plain": None, "luna_v4": None, "luna_v4_med": "medium", "luna_v4_high": "high"}
    res = {}
    for n, eff in systems.items():
        res[n] = run(n, eff, items, args.reuse)
        rs = res[n]
        print(f"{n}: {sum(isinstance(r.get('parsed'), dict) for r in rs)}/{len(rs)} ok · ${sum(r.get('cost') or 0 for r in rs):.4f} · "
              f"avg out {sum(r.get('completion_tokens') or 0 for r in rs)//len(rs)} tok", flush=True)
    by = {n: {r["id"]: r for r in rows} for n, rows in res.items()}
    names = list(systems)

    jpath = RAW / "v4_luna_judge.jsonl"
    if args.reuse and jpath.exists():
        judged = {d["id"]: d for d in map(json.loads, open(jpath, encoding="utf-8"))}
    else:
        c = straitly()

        def one(ip):
            i, p = ip
            order = list(names)
            random.Random(200 + i).shuffle(order)
            letters = dict(zip("ABCD", order))
            user = f"Darija: {p['darija']}\nGold meaning: {p['meaning_en']}\n\n" + "\n".join(f"{L}: {en_of(by[n].get(p['id'])) or '(no output)'}" for L, n in letters.items())
            try:
                r = call(c, "gpt-6.1-terra", [{"role": "system", "content": SYS_JUDGE}, {"role": "user", "content": user}], "low")
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
    unseen = [p["id"] for p in items if not p["in_kb"]]
    L = ["# Luna on the fresh held-out set (31 messages, 26 with expressions NOT in the prompt)\n",
         "Judge: GPT-6.1 Terra (blind, English only). v4 = elder-Darija knowledge base + faithfulness contract.\n",
         "| System | Meaning (avg 0–2) | Fully understood | Wrong/confusing | Added content | Natural (1–3) | Literal traps | Neutral kept neutral | Unseen fully understood | Median latency (s) | Cost / msg |",
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
        nk = "—" if n == "luna_plain" else f"{sum(1 for i in neutral if not (set(map(str.lower, map(str, ((by[n][i].get('parsed') or {}).get('feeling') or [])))) & EMOTIONAL))}/{len(neutral)}"
        uf = sum(1 for i in unseen if g[i].get("meaning") == 2)
        lat = sorted(r["latency"] for r in res[n] if r.get("latency"))
        cost = sum(r.get("cost") or 0 for r in res[n]) / len(items)
        summary[n] = dict(avg=round(sum(ms) / max(len(ms), 1), 2), full=sum(m == 2 for m in ms), zero=sum(m == 0 for m in ms), added=added, unseen_full=uf)
        L.append(f"| **{n}** | {summary[n]['avg']:.2f} | {summary[n]['full']}/{len(ms)} | {summary[n]['zero']} | {added} | {sum(nat)/max(len(nat),1):.2f} | {th}/{len(traps)} | {nk} | {uf}/{len(unseen)} | {lat[len(lat)//2] if lat else '—'} | ${cost:.5f} |")
    total = sum(r.get("cost") or 0 for n in ("luna_v4_med", "luna_v4_high") for r in res[n]) + sum(d.get("cost") or 0 for d in judged.values())
    L.append(f"\n**Straitly cost of this run:** ${total:.4f}\n\n## Every message\n")
    for p in items:
        L.append(f"\n### {p['id']} {'[in prompt]' if p['in_kb'] else '[unseen]'} {p['darija']}  \n_{p['latin']}_ · gold: _{p['meaning_en']}_\n")
        for n in names:
            r = by[n].get(p["id"])
            g = judged[p["id"]]["grades"].get(n, {})
            j = (r or {}).get("parsed") or {}
            und = (j.get("understanding") or {}).get("intended_meaning") if isinstance(j, dict) else None
            L.append(f"- **{n}** [{g.get('meaning', '?')}{' +added' if g.get('added') else ''}]: EN: {en_of(r) or '❌ ' + str((r or {}).get('error'))}" + (f"  _(understood: {und})_" if und else ""))
    out = ROOT / "eval" / "results" / "v4_luna_report.md"
    out.write_text("\n".join(L), encoding="utf-8")
    print(json.dumps(summary, indent=1))
    print(f"report: {out}\nstraitly cost: ${total:.4f}")


if __name__ == "__main__":
    main()
