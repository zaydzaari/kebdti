"""Round-1 translation screen for Kebdti.

Runs every model on the screening phrases (Darija -> FR/ES/IT/EN in one call,
and FR/ES/IT/EN -> Darija), records latency, tokens, cost and raw output,
and writes a markdown report with automatic checks.

Usage:
    .venv/Scripts/python eval/bench_translate.py            # all models
    .venv/Scripts/python eval/bench_translate.py --models deepseek/deepseek-v4.1-flash
"""
import argparse
import json
import os
import re
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

PROVIDERS = {
    "zenmux": dict(base_url="https://zenmux.ai/api/v1", key="ZENMUX_API_KEY"),
    "gemini": dict(base_url="https://generativelanguage.googleapis.com/v1beta/openai/", key="GEMINI_API_KEY"),
}

# (provider, model id)
MODELS = [
    ("zenmux", "deepseek/deepseek-v4.1-flash"),
    ("zenmux", "qwen/qwen3.8-flash"),
    ("zenmux", "z-ai/glm-5.3-flash"),
    ("zenmux", "minimax/minimax-m3.1-flash"),
    ("zenmux", "xiaomi/mimo-v2.6-flash"),
    ("zenmux", "z-ai/glm-4.7-flash-free"),
    ("zenmux", "openai/gpt-6-luna"),
    ("zenmux", "anthropic/claude-haiku-5.5"),
    # Gemini 3.8 / 3.7 Flash were overloaded (503 / timeouts) on Nov 14; Pro models need a paid tier.
    ("gemini", "gemini-3.6-flash"),
    ("gemini", "gemini-3.5-flash-lite"),
    ("gemini", "gemma-4-31b-it"),
]

FEELINGS = ["love", "longing", "care", "worry", "pride", "blessing", "humor", "gratitude", "neutral"]

SYS_D2X = f"""You are Kebdti, a translator that carries the FEELING of a Moroccan grandparent's Darija (Moroccan Arabic) to grandchildren who live abroad and don't speak Darija.

Rules:
1. Translate the meaning and the emotion, not word for word. Moroccan endearments, blessings (du3a) and proverbs must become what a loving grandparent would naturally say in the target language.
2. Never add emotion that is not there. Practical or neutral messages stay neutral and plain.
3. Keep names, numbers and dates exact.
4. cultural_notes: only for expressions whose literal meaning would confuse a foreigner. Give the expression (Latin letters), its literal meaning and its real meaning, in English, short.
5. feeling: 1 to 3 tags from {FEELINGS}.
6. Output ONLY a JSON object, no markdown, with this shape:
{{"translations": {{"fr": "...", "es": "...", "it": "...", "en": "..."}}, "feeling": ["..."], "cultural_notes": [{{"expression": "...", "literal": "...", "meaning": "..."}}], "confidence": "high|medium|low"}}"""

SYS_X2D = f"""You are Kebdti. A grandchild living abroad sends a message to their grandmother in a village in Morocco. She speaks only Moroccan Darija and cannot read; your text will be spoken to her by a voice.

Rules:
1. Write natural, warm Moroccan Darija exactly as a Moroccan family would speak it. NOT Modern Standard Arabic, not Egyptian, not Levantine.
2. Short, simple spoken sentences. Keep the meaning and feeling; don't add or remove content.
3. Address her the way a Moroccan grandchild would (for example "a mi", "a jdda", "a 7nini").
4. feeling: 1 to 3 tags from {FEELINGS}.
5. Output ONLY a JSON object, no markdown:
{{"darija_arabic": "...", "darija_latin": "...", "feeling": ["..."]}}"""

DARIJA_MARKERS = ["غادي", "بزاف", "واش", "ديال", "دابا", "راه", "كن", "كي", "شي", "ماشي", "مزيان", "توحشت", "بغيت", "نجي", "ليك", "ديالك", "حنيني", "جدة", "مي "]
MSA_MARKERS = ["سوف", "لماذا", "الذي", "التي", "جداً", "جدا", "أريد", "إنني", "لقد", "كثيراً", "هل ", "ليس"]


def client_for(provider):
    p = PROVIDERS[provider]
    return OpenAI(base_url=p["base_url"], api_key=os.environ[p["key"]], timeout=90, max_retries=1)


def extract_json(text):
    if not text:
        return None
    text = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.M).strip()
    m = re.search(r"\{.*\}", text, re.S)
    if not m:
        return None
    try:
        return json.loads(m.group(0))
    except json.JSONDecodeError:
        return None


def call(client, provider, model, system, user):
    kwargs = dict(model=model, messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
                  max_tokens=3000, temperature=0.3)
    t0 = time.time()
    try:
        r = client.chat.completions.create(reasoning_effort="low", **kwargs)
    except Exception as e:  # some providers reject reasoning_effort
        if "reasoning" in str(e).lower() or "400" in str(e):
            r = client.chat.completions.create(**kwargs)
        else:
            raise
    dt = time.time() - t0
    u = r.usage
    cost = float(getattr(u, "cost", 0) or 0) if u else 0.0
    reasoning = getattr(getattr(u, "completion_tokens_details", None), "reasoning_tokens", None) if u else None
    return dict(text=r.choices[0].message.content, latency=round(dt, 2),
                prompt_tokens=getattr(u, "prompt_tokens", None), completion_tokens=getattr(u, "completion_tokens", None),
                reasoning_tokens=reasoning, cost=cost)


def run_model(provider, model, phrases, out_dir):
    client = client_for(provider)
    rows = []
    for p in phrases["darija_to_x"]:
        try:
            res = call(client, provider, model, SYS_D2X, f"Grandmother's message (Darija): {p['darija']}\n(Latin transcription: {p['latin']})")
        except Exception as e:
            res = dict(text=None, error=str(e)[:300], latency=None, cost=0.0)
        res.update(id=p["id"], direction="d2x", parsed=extract_json(res.get("text")))
        rows.append(res)
    for p in phrases["x_to_darija"]:
        try:
            res = call(client, provider, model, SYS_X2D, f"Grandchild's message ({p['lang']}): {p['text']}")
        except Exception as e:
            res = dict(text=None, error=str(e)[:300], latency=None, cost=0.0)
        res.update(id=p["id"], direction="x2d", parsed=extract_json(res.get("text")))
        rows.append(res)
    safe = model.replace("/", "__")
    with open(out_dir / f"round1_{safe}.jsonl", "w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    return model, rows


def score(phrases, rows):
    gold = {p["id"]: p for p in phrases["darija_to_x"] + phrases["x_to_darija"]}
    s = dict(json_ok=0, total=len(rows), literal_hits=0, feeling_overlap=0, added_feeling=0,
             darija_markers=0, msa_markers=0, latency=[], cost=0.0, errors=0)
    for r in rows:
        s["cost"] += r.get("cost") or 0
        if r.get("latency"):
            s["latency"].append(r["latency"])
        if r.get("error"):
            s["errors"] += 1
        j = r.get("parsed")
        if not isinstance(j, dict):
            continue
        s["json_ok"] += 1
        g = gold[r["id"]]
        feel = [str(x).lower() for x in (j.get("feeling") or [])]
        if set(feel) & set(g["feeling"]):
            s["feeling_overlap"] += 1
        if r["direction"] == "d2x":
            tr = " ".join(str(v) for v in (j.get("translations") or {}).values()).lower()
            s["literal_hits"] += sum(1 for t in g.get("literal_traps", []) if t.lower() in tr)
            if g["feeling"][0] == "neutral" and set(feel) & {"love", "longing", "blessing", "care", "worry"}:
                s["added_feeling"] += 1
        else:
            d = j.get("darija_arabic") or ""
            s["darija_markers"] += sum(1 for m in DARIJA_MARKERS if m in d)
            s["msa_markers"] += sum(1 for m in MSA_MARKERS if m in d)
    lat = sorted(s["latency"])
    s["latency_median"] = lat[len(lat) // 2] if lat else None
    return s


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", nargs="*")
    args = ap.parse_args()
    phrases = json.load(open(ROOT / "eval" / "screen_phrases.json", encoding="utf-8"))
    out_dir = ROOT / "eval" / "results" / "raw"
    out_dir.mkdir(parents=True, exist_ok=True)
    todo = [m for m in MODELS if not args.models or m[1] in args.models]

    results = {}
    with ThreadPoolExecutor(max_workers=len(todo)) as ex:
        for model, rows in ex.map(lambda m: run_model(m[0], m[1], phrases, out_dir), todo):
            results[model] = rows
            print(f"done: {model}", flush=True)

    lines = ["# Round 1 — translation screen\n",
             "| Model | JSON ok | Errors | Literal traps hit | Feeling match | Added feeling (neutral msgs) | Darija markers / MSA markers (x→Darija) | Median latency (s) | Cost (USD) |",
             "|---|---|---|---|---|---|---|---|---|"]
    total_cost = 0.0
    for _, model in todo:
        s = score(phrases, results[model])
        total_cost += s["cost"]
        lines.append(f"| `{model}` | {s['json_ok']}/{s['total']} | {s['errors']} | {s['literal_hits']} | {s['feeling_overlap']}/{s['total']} | "
                     f"{s['added_feeling']}/2 | {s['darija_markers']} / {s['msa_markers']} | {s['latency_median']} | {s['cost']:.5f} |")
    lines.append(f"\n**Total ZenMux cost:** ${total_cost:.4f} (Gemini via AI Studio free tier not counted)\n")

    lines.append("\n## Side-by-side outputs\n")
    gold = phrases["darija_to_x"] + phrases["x_to_darija"]
    for g in gold:
        src = g.get("darija") or g.get("text")
        lines.append(f"\n### {g['id']} — {src}\n\nGold meaning: _{g['meaning_en']}_ · gold feeling: {g['feeling']}\n")
        for _, model in todo:
            r = next(x for x in results[model] if x["id"] == g["id"])
            j = r.get("parsed")
            if not isinstance(j, dict):
                lines.append(f"- **{model}**: ❌ {r.get('error') or 'invalid JSON'}")
                continue
            if r["direction"] == "d2x":
                t = j.get("translations") or {}
                notes = "; ".join(f"{n.get('expression')} = {n.get('meaning')}" for n in (j.get("cultural_notes") or []) if isinstance(n, dict))
                lines.append(f"- **{model}** [{', '.join(map(str, j.get('feeling') or []))}]\n  - EN: {t.get('en')}\n  - FR: {t.get('fr')}\n  - ES: {t.get('es')}\n  - IT: {t.get('it')}" + (f"\n  - notes: {notes}" if notes else ""))
            else:
                lines.append(f"- **{model}** [{', '.join(map(str, j.get('feeling') or []))}]: {j.get('darija_arabic')}  \n  _{j.get('darija_latin')}_")
    report = ROOT / "eval" / "results" / "round1_report.md"
    report.write_text("\n".join(lines), encoding="utf-8")
    print(f"report: {report}\ntotal zenmux cost: ${total_cost:.4f}")


if __name__ == "__main__":
    main()
