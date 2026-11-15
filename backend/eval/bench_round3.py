"""Round 3 for Kebdti: make the Darija warm and Moroccan (v3 style guide + few-shot),
fix Gemini's added feelings on neutral messages, and screen a few stronger challengers.

Parts:
  x2d   FR/ES/IT/EN -> Darija, 18 messages, v3 prompt, all models
  d2x   Darija -> FR/ES/IT/EN, 20 Round-2 messages, v3 prompt + glossary, finalists only

Usage: .venv/Scripts/python -X utf8 eval/bench_round3.py [--models ...] [--parts x2d d2x]
"""
import argparse
import json
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from bench_translate import client_for, extract_json  # noqa: E402
from prompts_v3 import d2x_system, x2d_messages  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent

FINALISTS = [("zenmux", "openai/gpt-6-luna"), ("zenmux", "google/gemini-3.8-flash")]
CHALLENGERS = [  # x2d only
    ("zenmux", "google/gemini-4-hydrogen"),
    ("zenmux", "openai/gpt-6.1-terra"),
    ("zenmux", "deepseek/deepseek-v4-pro"),
    ("zenmux", "mistralai/mistral-large-4"),
]

BAD_WORDS = ["سوف", "لماذا", "الذي", "التي", "أريد", "جدا", "جداً", "كثيرا", "كثيراً", "هل ", "ليس", "لقد", "الآن", "أيضا",
             "عايز", "دلوقتي", "ازيك", "كتير", "هلأ", "منيح", "شو ", "بدي", "مشتاق", "وحشتيني", "ماما الكبيرة"]
EMOTIONAL = {"love", "longing", "blessing", "care", "worry", "pride"}


def call_msgs(client, model, messages, effort="low"):
    kw = dict(model=model, messages=messages, max_tokens=3000, temperature=0.3)
    t0 = time.time()
    try:
        r = client.chat.completions.create(reasoning_effort=effort, **kw)
    except Exception as e:
        if "reasoning" in str(e).lower() or "400" in str(e):
            r = client.chat.completions.create(**kw)
        else:
            raise
    u = r.usage
    text = r.choices[0].message.content
    if isinstance(text, list):  # some providers (Mistral) return content parts
        text = "".join(c.get("text", "") if isinstance(c, dict) else str(c) for c in text)
    return dict(text=text, latency=round(time.time() - t0, 2),
                prompt_tokens=getattr(u, "prompt_tokens", None), completion_tokens=getattr(u, "completion_tokens", None),
                reasoning_tokens=getattr(getattr(u, "completion_tokens_details", None), "reasoning_tokens", None),
                cost=float(getattr(u, "cost", 0) or 0))


def safe(fn):
    try:
        return fn()
    except Exception as e:
        return dict(text=None, error=str(e)[:300], latency=None, cost=0.0)


TAG = ""


def run_model(provider, model, parts, x_data, d_data, out_dir, reuse=False):
    raw = out_dir / f"round3{TAG}_{model.replace('/', '__')}.jsonl"
    if reuse and raw.exists():
        return model, [json.loads(l) for l in open(raw, encoding="utf-8")]
    client = client_for(provider)
    rows = []
    if "x2d" in parts:
        for p in x_data["x_to_darija"]:
            res = safe(lambda: call_msgs(client, model, x2d_messages(p["sender"], p["to"], p["lang"], p["text"])))
            res.update(id=p["id"], direction="x2d", parsed=extract_json(res.get("text")))
            rows.append(res)
    if "d2x" in parts and (provider, model) in FINALISTS:
        sysmsg = d2x_system(d_data["glossary"])
        for p in d_data["darija_to_x"]:
            user = f"Grandparent's message (Darija): {p['darija']}\n(Latin transcription: {p['latin']})"
            res = safe(lambda: call_msgs(client, model, [{"role": "system", "content": sysmsg}, {"role": "user", "content": user}]))
            res.update(id=p["id"], direction="d2x", parsed=extract_json(res.get("text")))
            rows.append(res)
    with open(raw, "w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    return model, rows


def trap_hit(p, j):
    tr = " ".join(str(v) for v in ((j or {}).get("translations") or {}).values()).lower()
    return any(t.lower() in tr for t in p.get("literal_traps", []))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", nargs="*")
    ap.add_argument("--parts", nargs="*", default=["x2d", "d2x"])
    ap.add_argument("--tag", default="", help="suffix for raw/report files, e.g. v3.1")
    ap.add_argument("--reuse", action="store_true", help="load saved raw outputs instead of calling the API")
    args = ap.parse_args()
    global TAG
    TAG = f"_{args.tag}" if args.tag else ""
    x_data = json.load(open(ROOT / "eval" / "round3_phrases.json", encoding="utf-8"))
    d_data = json.load(open(ROOT / "eval" / "round2_phrases.json", encoding="utf-8"))
    out_dir = ROOT / "eval" / "results" / "raw"
    out_dir.mkdir(parents=True, exist_ok=True)
    todo = [m for m in FINALISTS + CHALLENGERS if not args.models or m[1] in args.models]

    results = {}
    with ThreadPoolExecutor(max_workers=len(todo)) as ex:
        for model, rows in ex.map(lambda m: run_model(m[0], m[1], args.parts, x_data, d_data, out_dir, args.reuse), todo):
            results[model] = rows
            print(f"done: {model}  ${sum(r.get('cost') or 0 for r in rows):.4f}", flush=True)

    total = sum(r.get("cost") or 0 for rows in results.values() for r in rows)
    xs = {p["id"]: p for p in x_data["x_to_darija"]}
    L = ["# Round 3 — warm Moroccan Darija (v3 style guide + few-shot)\n",
         "## Into Darija: automatic checks\n",
         "| Model | JSON ok | Non-Moroccan words | Neutral kept neutral (y04, y11) | Median latency (s) | Cost / message (USD) |",
         "|---|---|---|---|---|---|"]
    for _, model in todo:
        rs = [r for r in results[model] if r["direction"] == "x2d"]
        if not rs:
            continue
        ok = [r for r in rs if isinstance(r.get("parsed"), dict)]
        bad = sum(sum(w in (r["parsed"].get("darija_arabic") or "") for w in BAD_WORDS) for r in ok)
        neu = sum(1 for r in ok if r["id"] in ("y04", "y11") and not (set(map(str.lower, map(str, r["parsed"].get("feeling") or []))) & EMOTIONAL))
        lat = sorted(r["latency"] for r in rs if r.get("latency"))
        cost = sum(r.get("cost") or 0 for r in rs) / max(len(rs), 1)
        L.append(f"| `{model}` | {len(ok)}/{len(rs)} | {bad} | {neu}/2 | {lat[len(lat)//2] if lat else '—'} | {cost:.5f} |")

    d_gold = {p["id"]: p for p in d_data["darija_to_x"]}
    neutral = [p["id"] for p in d_data["darija_to_x"] if p["feeling"] == ["neutral"]]
    L += ["\n## Darija → FR/ES/IT/EN (v3 + glossary): automatic checks\n",
          "| Model | JSON ok | Literal traps hit | Added feeling on neutral msgs (e08–e10) | Median latency (s) | Cost / message (USD) |",
          "|---|---|---|---|---|---|"]
    for _, model in todo:
        rs = [r for r in results[model] if r["direction"] == "d2x"]
        if not rs:
            continue
        ok = [r for r in rs if isinstance(r.get("parsed"), dict)]
        traps = sum(1 for r in ok if trap_hit(d_gold[r["id"]], r["parsed"]))
        af = sum(1 for r in ok if r["id"] in neutral and set(map(str.lower, map(str, r["parsed"].get("feeling") or []))) & EMOTIONAL)
        lat = sorted(r["latency"] for r in rs if r.get("latency"))
        cost = sum(r.get("cost") or 0 for r in rs) / max(len(rs), 1)
        L.append(f"| `{model}` | {len(ok)}/{len(rs)} | {traps} | {af}/{len(neutral)} | {lat[len(lat)//2] if lat else '—'} | {cost:.5f} |")

    L.append(f"\n**Total ZenMux cost for this run:** ${total:.4f}\n\n## Into Darija: all outputs (team: rate these)\n")
    for pid, p in xs.items():
        L.append(f"\n### {pid} ({p['lang']}, {p['sender']} → {p['to']}) — {p['text']}\n")
        for _, model in todo:
            r = next((r for r in results[model] if r["id"] == pid and r["direction"] == "x2d"), None)
            if r is None:
                continue
            j = r.get("parsed")
            L.append(f"- **{model}**: " + (f"{j.get('darija_arabic')}  _({j.get('darija_latin')})_ · {j.get('feeling')}" if isinstance(j, dict) else f"❌ {r.get('error') or 'invalid JSON'}"))
    L.append("\n## Darija → EN / FR (v3 + glossary)\n")
    for p in d_data["darija_to_x"]:
        lines = []
        for _, model in todo:
            r = next((r for r in results[model] if r["id"] == p["id"] and r["direction"] == "d2x"), None)
            if r is None:
                continue
            j = r.get("parsed")
            t = (j or {}).get("translations") or {}
            lines.append(f"- **{model}**: EN: {t.get('en')} | FR: {t.get('fr')} · {(j or {}).get('feeling')}" if isinstance(j, dict) else f"- **{model}**: ❌ {r.get('error') or 'invalid JSON'}")
        if lines:
            L.append(f"\n### {p['id']} — {p['darija']}  \n_{p['latin']}_ · gold: _{p['meaning_en']}_\n")
            L += lines
    out = ROOT / "eval" / "results" / f"round3{TAG}_report.md"
    out.write_text("\n".join(L), encoding="utf-8")
    print(f"report: {out}\ntotal zenmux cost: ${total:.4f}")


if __name__ == "__main__":
    main()
