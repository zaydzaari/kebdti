"""Prompt v4 test (target: Gemini 3.8 Flash via Google AI Studio keys).

d2x on the fresh held-out set eval/final_test_v4.json (31 messages):
  gemini_v4    Gemini 3.8 Flash + prompt v4 (elder-Darija knowledge base + faithfulness contract)  <- target
  gemini_v31   Gemini 3.8 Flash + prompt v3.1 (previous)
  luna_v4      GPT-6 Luna + prompt v4 (side option)
  luna_plain   GPT-6 Luna, bare prompt ("just ask a general AI" baseline)
x2d (into Darija, round3 messages): gemini_v4 vs gemini_v3 outputs saved earlier.
Blind judge: GPT-6.1 Terra on the English output (A/B/C/D shuffled).

Usage: .venv/Scripts/python -X utf8 eval/bench_v4.py [--zenmux-fallback] [--reuse] [--only luna_v4 luna_plain]
"""
import argparse
import json
import random
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from bench_final import SYS_PLAIN  # noqa: E402
from bench_round3 import call_msgs  # noqa: E402
from bench_translate import client_for, extract_json  # noqa: E402
from gemini_pool import GeminiPool  # noqa: E402
import prompts_v3 as v3  # noqa: E402
import prompts_v4 as v4  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "eval" / "results" / "raw"
JUDGE = "openai/gpt-6.1-terra"
EMOTIONAL = {"love", "longing", "blessing", "care", "worry", "pride", "sadness"}
SYS_JUDGE = """You grade translations of Moroccan Darija messages from a grandparent to a grandchild abroad.
You get the gold meaning and several English translations (A, B, C, D). For each give:
- meaning: 2 = a grandchild would understand the real intended meaning and feeling; 1 = partly, or literal wording that is still guessable, or feeling lost; 0 = wrong, missing, or would confuse/upset the grandchild
- added: true if it adds feeling, endearments, blessings or content that the gold meaning does not contain
- natural: 1-3, how natural it sounds as something a grandparent would say in English
Proverbs may keep their image only if the real meaning is clear. Output ONLY JSON: {"A": {"meaning": 0, "added": false, "natural": 3}, "B": {...}, ...}"""


BATCH_D2X = """Below are {n} voice messages from DIFFERENT Moroccan grandparents. Translate each one INDEPENDENTLY, exactly as if it were the only message (don't let one message influence another).
Return ONLY {{"results": [ ... ]}} with one object per message, in the same order. Each object = {{"id": "<id>", ...}} plus exactly the JSON shape described in your instructions.

{body}"""

BATCH_X2D = """Below are {n} messages from DIFFERENT grandchildren. Write each one in Darija INDEPENDENTLY, exactly as if it were the only message.
Return ONLY {{"results": [ ... ]}} with one object per message, in the same order: {{"id": "<id>", "darija_arabic": "...", "darija_latin": "...", "feeling": ["..."]}}.

{body}"""


def build(items, gloss, pool):
    zen = client_for("zenmux")
    v31 = v3.d2x_system(gloss)

    def luna(msgs):
        return call_msgs(zen, "openai/gpt-6-luna", msgs)

    d2x_user = lambda p: f"Grandparent's voice message (Darija): {p['darija']}\n(Latin transcription: {p['latin']})"
    # name -> (kind, fn, system messages or per-item builder)
    return {
        "gemini_v4": ("batch", pool, [{"role": "system", "content": v4.SYS_D2X_V4}], d2x_user),
        "gemini_v31": ("batch", pool, [{"role": "system", "content": v31}], d2x_user),
        "luna_v4": ("single", luna, lambda p: v4.d2x_messages(p["darija"], p["latin"]), None),
        "luna_plain": ("single", luna, lambda p: [{"role": "system", "content": SYS_PLAIN}, {"role": "user", "content": p["darija"]}], None),
    }


def _load(raw):
    if not raw.exists():
        return {}
    return {r["id"]: r for r in map(json.loads, open(raw, encoding="utf-8")) if isinstance(r.get("parsed"), dict)}


def _save(raw, rows):
    with open(raw, "w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")


def batched(pool, prefix_msgs, template, user_of, todo, batch, extra=None):
    """One Gemini request per `batch` messages (saves the 20/day free quota)."""
    out = {}
    for k in range(0, len(todo), batch):
        chunk = todo[k:k + batch]
        body = "\n---\n".join(f"id: {p['id']}\n{user_of(p)}" for p in chunk)
        msgs = prefix_msgs + [{"role": "user", "content": template.format(n=len(chunk), body=body)}]
        try:
            res = pool.chat(msgs, max_tokens=60000)
            j = extract_json(res.get("text")) or {}
            got = {str(o.get("id")): o for o in j.get("results", []) if isinstance(o, dict)}
            err = None
        except Exception as e:
            res, got, err = dict(latency=None, cost=0.0), {}, str(e)[:300]
        print(f"  batch {k // batch + 1}: {len(got)}/{len(chunk)} parsed via {res.get('via')} in {res.get('latency')}s", flush=True)
        for p in chunk:
            o = got.get(p["id"])
            out[p["id"]] = dict(id=p["id"], parsed=o, error=None if o else (err or "missing in batch output"),
                                latency=res.get("latency"), batch_size=len(chunk), cost=(res.get("cost") or 0) / len(chunk), **(extra(p) if extra else {}))
    return out


def run(name, spec, items, reuse, batch):
    kind, fn, a, b = spec
    raw = RAW / f"v4_{name}.jsonl"
    done = _load(raw)
    if reuse:
        return [done.get(p["id"]) or dict(id=p["id"], parsed=None, error="missing") for p in items]
    todo = [p for p in items if p["id"] not in done]  # resume: only redo missing/failed items
    if kind == "batch":
        new = batched(fn, a, BATCH_D2X, b, todo, batch)
    else:
        def one(p):
            try:
                res = fn(a(p))
            except Exception as e:
                res = dict(text=None, error=str(e)[:300], latency=None, cost=0.0)
            res.update(id=p["id"], parsed=extract_json(res.get("text")))
            return res
        with ThreadPoolExecutor(max_workers=4) as ex:
            new = {r["id"]: r for r in ex.map(one, todo)}
    rows = [done.get(p["id"]) or new[p["id"]] for p in items]
    _save(raw, rows)
    return rows


def run_x2d(pool, reuse, batch):
    raw = RAW / "v4_gemini_x2d.jsonl"
    data = json.load(open(ROOT / "eval" / "round3_phrases.json", encoding="utf-8"))["x_to_darija"]
    done = _load(raw)
    if reuse:
        return [done.get(p["id"]) or dict(id=p["id"], text_in=p["text"], parsed=None, error="missing") for p in data]
    todo = [p for p in data if p["id"] not in done]
    prefix = v4.x2d_messages("x", "x", "x", "x")[:-1]  # system + few-shot
    user_of = lambda p: f"Sender: {p['sender']}. Recipient: {p['to']}.\nGrandchild's message ({p['lang']}): {p['text']}"
    new = batched(pool, prefix, BATCH_X2D, user_of, todo, batch, extra=lambda p: dict(text_in=p["text"]))
    rows = [done.get(p["id"]) or new[p["id"]] for p in data]
    _save(raw, rows)
    return rows


def en_of(r):
    j = (r or {}).get("parsed")
    return ((j or {}).get("translations") or {}).get("en") if isinstance(j, dict) else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--zenmux-fallback", action="store_true", help="use paid ZenMux when all Google keys are exhausted")
    ap.add_argument("--reuse", action="store_true")
    ap.add_argument("--only", nargs="*")
    ap.add_argument("--no-x2d", action="store_true")
    ap.add_argument("--gemini-model", default="gemini-3.8-flash")
    ap.add_argument("--batch", type=int, default=11, help="messages per Gemini request")
    args = ap.parse_args()
    items = json.load(open(ROOT / "eval" / "final_test_v4.json", encoding="utf-8"))["items"]
    gloss = json.load(open(ROOT / "eval" / "round2_phrases.json", encoding="utf-8"))["glossary"]
    pool = GeminiPool(model=args.gemini_model, zenmux_fallback=args.zenmux_fallback)
    print(f"google keys: {len(pool.clients)}", flush=True)
    specs = build(items, gloss, pool)
    names = [n for n in specs if not args.only or n in args.only]
    res = {}
    for n in names:
        res[n] = run(n, specs[n], items, args.reuse, args.batch)
        ok = sum(isinstance(r.get("parsed"), dict) for r in res[n])
        print(f"{n}: {ok}/{len(items)} ok, ${sum(r.get('cost') or 0 for r in res[n]):.4f}", flush=True)
    x2d = None if args.no_x2d or args.only else run_x2d(pool, args.reuse, 9)
    print("pool usage:", pool.used, flush=True)
    if args.only:
        return

    by = {n: {r["id"]: r for r in rows} for n, rows in res.items()}
    jpath = RAW / "v4_judge.jsonl"
    if args.reuse and jpath.exists():
        judged = {d["id"]: d for d in map(json.loads, open(jpath, encoding="utf-8"))}
    else:
        jc = client_for("zenmux")
        def one(ip):
            i, p = ip
            order = list(names)
            random.Random(100 + i).shuffle(order)
            letters = dict(zip("ABCD", order))
            user = f"Darija: {p['darija']}\nGold meaning: {p['meaning_en']}\n\n" + "\n".join(f"{L}: {en_of(by[n].get(p['id'])) or '(no output)'}" for L, n in letters.items())
            try:
                r = call_msgs(jc, JUDGE, [{"role": "system", "content": SYS_JUDGE}, {"role": "user", "content": user}])
                j = extract_json(r["text"]) or {}
                return dict(id=p["id"], grades={letters[L]: j.get(L, {}) for L in letters}, cost=r.get("cost") or 0)
            except Exception as e:
                return dict(id=p["id"], grades={}, cost=0, error=str(e)[:200])
        with ThreadPoolExecutor(max_workers=6) as ex:
            judged = {d["id"]: d for d in ex.map(one, enumerate(items))}
        with open(jpath, "w", encoding="utf-8") as f:
            for d in judged.values():
                f.write(json.dumps(d, ensure_ascii=False) + "\n")

    neutral = [p["id"] for p in items if p["feeling"] == ["neutral"]]
    traps = [p for p in items if p["literal_traps"]]
    L = ["# Prompt v4 test: fresh held-out set (31 messages, 26 with expressions NOT in the prompt)\n",
         f"Judge: `{JUDGE}`, blind, English output only. Gemini via Google AI Studio keys (free tier).\n",
         "| System | Meaning (avg 0–2) | Fully understood | Wrong/confusing | Added content | Natural (1–3) | Literal traps | Neutral kept neutral | Unseen expressions fully understood |",
         "|---|---|---|---|---|---|---|---|---|"]
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
        nk = sum(1 for i in neutral if not (set(map(str.lower, map(str, ((by[n][i].get("parsed") or {}).get("feeling") or [])))) & EMOTIONAL)) if n != "luna_plain" else None
        unseen = [p["id"] for p in items if not p["in_kb"]]
        uf = sum(1 for i in unseen if g[i].get("meaning") == 2)
        summary[n] = dict(avg=round(sum(ms) / max(len(ms), 1), 2), full=sum(m == 2 for m in ms), zero=sum(m == 0 for m in ms), added=added)
        L.append(f"| **{n}** | {summary[n]['avg']:.2f} | {summary[n]['full']}/{len(ms)} | {summary[n]['zero']} | {added} | {sum(nat)/max(len(nat),1):.2f} | {th}/{len(traps)} | {'—' if nk is None else f'{nk}/{len(neutral)}'} | {uf}/{len(unseen)} |")
    jc_cost = sum(d.get("cost") or 0 for d in judged.values())
    zen_cost = sum(r.get("cost") or 0 for rows in res.values() for r in rows) + jc_cost + sum(r.get("cost") or 0 for r in (x2d or []))
    L.append(f"\n**ZenMux cost:** ${zen_cost:.4f} · Gemini calls: {pool.used}\n\n## Every message\n")
    for p in items:
        L.append(f"\n### {p['id']} {'[in prompt]' if p['in_kb'] else '[unseen]'} {p['darija']}  \n_{p['latin']}_ · gold: _{p['meaning_en']}_\n")
        for n in names:
            r = by[n].get(p["id"])
            g = judged[p["id"]]["grades"].get(n, {})
            j = (r or {}).get("parsed") or {}
            fr = (j.get("translations") or {}).get("fr") if isinstance(j, dict) else None
            L.append(f"- **{n}** [{g.get('meaning', '?')}{' +added' if g.get('added') else ''}]: EN: {en_of(r) or '❌ ' + str((r or {}).get('error'))} | FR: {fr} · {j.get('feeling') if isinstance(j, dict) else ''}")
    if x2d:
        L.append("\n## Into Darija: Gemini v4 (compare with round3_report.md, Gemini v3)\n")
        for r in x2d:
            j = r.get("parsed")
            L.append(f"- **{r['id']}** {r['text_in']}\n  → " + (f"{j.get('darija_arabic')} · {j.get('feeling')}" if isinstance(j, dict) else f"❌ {r.get('error')}"))
    out = ROOT / "eval" / "results" / "v4_report.md"
    out.write_text("\n".join(L), encoding="utf-8")
    print(json.dumps(summary, indent=1))
    print(f"report: {out}\nzenmux cost: ${zen_cost:.4f}")


if __name__ == "__main__":
    main()
