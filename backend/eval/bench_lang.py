"""Per-language benchmark on a FRESH held-out set (eval/fresh_lang_test.json, 20 grandparent messages, leak-checked).

Darija -> EN / FR / ES / IT
  baseline  GPT-6 Luna with a plain "translate this" prompt (same model, same effort, no Kebdti knowledge)
  kebdti    the app's own function: pipeline.translate_from_grandparent (prompt v4.3)
  judge     GPT-6.1 Terra, blind (A/B shuffled), in each language, against the gold meaning:
            meaning 0-2, literal trap (key expression translated word for word), added content, natural 1-3
Voice     each Kebdti translation spoken in the grandmother's cloned voice (with her consent), heard back by
          speech recognition: share of words heard correctly, per language
EN/FR/ES/IT -> Darija (5 grandchild messages per language)
  kebdti    pipeline.translate_to_grandparent; checked automatically for non-Moroccan Arabic words; printed for the
            team's Darija speaker to check by hand

.venv/Scripts/python -X utf8 eval/bench_lang.py [--reuse] [--no-voice]
"""
import argparse, json, random, re, sys, time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

E = Path(__file__).resolve().parent
ROOT = E.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(E))
from dotenv import load_dotenv
load_dotenv(ROOT / ".env")
from app import pipeline                                   # noqa: E402
from bench_translate import client_for, extract_json       # noqa: E402
from bench_round3 import call_msgs                         # noqa: E402
from bench_luna import straitly                            # noqa: E402

RAW = E / "results" / "raw"
RAW.mkdir(parents=True, exist_ok=True)
LANGS = {"en": "English", "fr": "French", "es": "Spanish", "it": "Italian"}
SYS_PLAIN = """Translate this Moroccan Arabic (Darija) message into French, Spanish, Italian and English.
Output ONLY a JSON object: {"translations": {"fr": "...", "es": "...", "it": "...", "en": "..."}}"""
SYS_JUDGE = """You grade translations of a Moroccan grandparent's Darija voice message to a grandchild abroad. The translations are in {lang}.
You get the gold meaning (in English), the expression that a word-for-word translation gets wrong (may be empty), and two {lang} translations, A and B.
For each translation give:
- meaning: 2 = a {lang}-speaking grandchild would understand the real intended meaning and feeling; 1 = partly, or literal wording that is still guessable, or feeling lost; 0 = wrong, missing, or would confuse/upset the grandchild
- literal: true if the tricky expression was translated word for word so that its real meaning is lost (false if there is no tricky expression)
- added: true if it adds feeling, endearments, blessings or content the gold meaning does not contain
- natural: 1-3, how natural it sounds in {lang} as something a grandparent would say
Output ONLY JSON: {{"A": {{"meaning": 0, "literal": false, "added": false, "natural": 3}}, "B": {{...}}}}"""
X2D = {
    "en": ["Grandma, I got my first job! I start on Monday.", "I'm sorry I didn't call last week, exams were crazy.", "Can you send me your recipe for harira? Mine never tastes like yours.",
           "I dreamt about your house last night, the smell of mint tea.", "Don't worry about me, I'm eating well and sleeping enough."],
    "fr": ["Mamie, j'ai eu mon permis du premier coup !", "Je pense fort à toi, prends soin de toi.", "On arrive le 3 juillet, prépare-nous des msemen !",
           "Désolée de ne pas avoir appelé, j'étais malade.", "Papa dit que tu as encore oublié tes médicaments…"],
    "es": ["Abuela, ¡aprobé todos los exámenes!", "Te echo muchísimo de menos, ¿cómo estás?", "Este verano voy a ir a verte, te lo prometo.",
           "Me he comprado una chilaba para la boda de mi prima.", "No te preocupes, el trabajo va bien."],
    "it": ["Nonna, ho trovato un appartamento vicino all'università!", "Mi manchi tanto, ti penso ogni giorno.", "Ho cucinato il tuo cuscus, ma non è buono come il tuo.",
           "Domani ho un colloquio, prega per me.", "Scusa se non ti ho chiamata, ero stanchissimo."],
}


def load(name):
    f = RAW / f"lang_{name}.jsonl"
    return {d["id"]: d for d in map(json.loads, open(f, encoding="utf-8"))} if f.exists() else {}


def save(name, rows):
    with open(RAW / f"lang_{name}.jsonl", "w", encoding="utf-8") as f:
        for r in rows.values():
            f.write(json.dumps(r, ensure_ascii=False) + "\n")


def words(t):
    t = (t or "").lower().replace("’", "'").replace("‘", "'")   # curly and straight apostrophes are the same word
    t = re.sub(r"(our)", "or", t)                                         # British/American spelling (neighbours/neighbors)
    return re.findall(r"[a-zà-öø-ÿñ']+", t)


def heard_share(said, heard):
    import difflib
    a, b = words(said), words(heard)
    return difflib.SequenceMatcher(None, a, b).ratio() if a else 0.0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--reuse", action="store_true")
    ap.add_argument("--no-voice", action="store_true")
    a = ap.parse_args()
    items = json.load(open(E / "fresh_lang_test.json", encoding="utf-8"))["items"]
    zen = client_for("zenmux")

    # 1. translations
    base, keb = (load("baseline"), load("kebdti")) if a.reuse else ({}, {})

    def run_base(it):
        for k in range(3):
            r = call_msgs(zen, "openai/gpt-6-luna", [{"role": "system", "content": SYS_PLAIN}, {"role": "user", "content": it["darija"]}], effort="low")
            j = extract_json(r["text"]) or {}
            if j.get("translations"):
                return dict(id=it["id"], tr=j["translations"], seconds=r["latency"], cost=r["cost"])
        return dict(id=it["id"], tr={}, error="no json")

    def run_keb(it, L="en"):   # the app translates into ONE language per call: the grandchild's
        for k in range(3):
            try:
                j = pipeline.translate_from_grandparent(it["darija"], None, L)
                if j.get("translations"):
                    return dict(id=it["id"], tr=j["translations"], literal=j.get("word_for_word"), notes=j.get("cultural_notes"),
                                feeling=j.get("feeling"), confidence=j.get("confidence"), seconds=j.get("seconds"))
            except Exception as e:
                err = str(e)[:200]
        return dict(id=it["id"], tr={}, error=locals().get("err", "no json"))

    with ThreadPoolExecutor(6) as ex:
        todo = [it for it in items if it["id"] not in base]
        for r in ex.map(run_base, todo): base[r["id"]] = r
        todo = [it for it in items if it["id"] not in keb]
        for r in ex.map(run_keb, todo): keb[r["id"]] = r
        # French, Spanish and Italian: one call each, exactly as the app does for a grandchild who speaks that language
        def more(job):
            it, L = job
            r = run_keb(it, L)
            return it["id"], L, r
        jobs = [(it, L) for it in items for L in ("fr", "es", "it") if L not in keb[it["id"]]["tr"]]
        for iid, L, r in ex.map(more, jobs):
            keb[iid]["tr"][L] = r["tr"].get(L, "")
            keb[iid].setdefault("by_lang", {})[L] = {k: v for k, v in r.items() if k not in ("id", "tr")}
    save("baseline", base); save("kebdti", keb)
    print("translated", len(base), len(keb), flush=True)

    # 2. blind judge per language
    judged = load("judge") if a.reuse else {}
    rnd = random.Random(7)
    jobs = []
    for it in items:
        for L in LANGS:
            jid = f"{it['id']}:{L}"
            if jid in judged and judged[jid].get('grades'):
                continue
            flip = rnd.random() < 0.5
            A, B = (keb, base) if flip else (base, keb)
            jobs.append((jid, it, L, flip, A[it["id"]]["tr"].get(L, ""), B[it["id"]]["tr"].get(L, "")))

    sc = straitly()   # the judge runs on Straitly, as in the earlier rounds

    def judge(job):
        jid, it, L, flip, ta, tb = job
        user = f"Gold meaning: {it['gold']}\nTricky expression: {it['key'] or '(none)'}\nDarija: {it['darija']}\n\nA: {ta}\nB: {tb}"
        for k in range(3):
            try:
                r = call_msgs(sc, "gpt-6.1-terra", [{"role": "system", "content": SYS_JUDGE.format(lang=LANGS[L])}, {"role": "user", "content": user}], effort="low")
            except Exception as e:
                err = str(e)[:200]; time.sleep(2); continue
            j = extract_json(r["text"]) or {}
            if "A" in j and "B" in j:
                g = {"kebdti": j["A"] if flip else j["B"], "baseline": j["B"] if flip else j["A"]}
                return dict(id=jid, grades=g, cost=r["cost"])
        return dict(id=jid, grades={}, error=locals().get("err", "judge failed"))

    with ThreadPoolExecutor(6) as ex:
        for r in ex.map(judge, jobs): judged[r["id"]] = r
    save("judge", judged)
    print("judged", len(judged), flush=True)

    # 3. voice: Kebdti translation in the grandmother's cloned voice, heard back
    voice = load("voice") if a.reuse else {}
    if not a.no_voice:
        def speak(job):
            vid, text, L = job
            try:
                wav = pipeline.tts(text, L, "grandmother")["wav"]
                heard = pipeline.asr(wav, L).get("text", "")
                return dict(id=vid, said=text, heard=heard, kept=round(heard_share(text, heard), 3))
            except Exception as e:
                return dict(id=vid, said=text, error=str(e)[:200])
        jobs = [(f"{it['id']}:{L}", keb[it["id"]]["tr"].get(L, ""), L) for it in items for L in LANGS
                if f"{it['id']}:{L}" not in voice and keb[it["id"]]["tr"].get(L)]
        with ThreadPoolExecutor(4) as ex:
            for r in ex.map(speak, jobs): voice[r["id"]] = r
        save("voice", voice)
        print("voiced", len(voice), flush=True)
    for r in voice.values():   # score again from what was said and heard (no new audio)
        if "heard" in r:
            r["kept"] = round(heard_share(r["said"], r["heard"]), 3)

    # 4. into Darija
    x2d = load("x2d") if a.reuse else {}
    jobs = [(f"{L}{i + 1}", L, t) for L, ts in X2D.items() for i, t in enumerate(ts) if f"{L}{i + 1}" not in x2d]

    def into(job):
        xid, L, t = job
        try:
            j = pipeline.translate_to_grandparent(t, L, "boy", "grandmother", "أ جدة")
            d = j.get("darija_arabic", "")
            return dict(id=xid, lang=L, text=t, darija=d, latin=j.get("darija_latin"), source_lang=j.get("source_lang"),
                        not_darija=pipeline.not_darija(d), fixed=j.get("darija_fixed"), seconds=j.get("seconds"))
        except Exception as e:
            return dict(id=xid, lang=L, text=t, error=str(e)[:200])
    with ThreadPoolExecutor(6) as ex:
        for r in ex.map(into, jobs): x2d[r["id"]] = r
    save("x2d", x2d)

    # 5. report
    out = ["# Per-language test on a fresh held-out set", "",
           f"20 new grandparent messages ({sum(1 for i in items if i['key'])} with a tricky expression, {sum(1 for i in items if not i['key'])} neutral), written after the prompt was frozen and leak-checked "
           "against the prompt and every earlier set (`eval/fresh_lang_leakcheck.py`). Same model for both systems (GPT-6 Luna, low effort). "
           "Judge: GPT-6.1 Terra, blind (A/B shuffled), in each language, against the gold meaning. Darija spellings and gold meanings were written with an AI assistant.", "",
           "## Darija → each language", "",
           "| Language | System | Fully understood | Wrong / confusing | Literal traps (of keyed) | Added content | Natural (1–3) | Voice: words heard back |",
           "|---|---|---|---|---|---|---|---|"]
    keyed = [i for i in items if i["key"]]
    summary = {}
    for L in LANGS:
        for sysn in ("baseline", "kebdti"):
            g = [judged.get(f"{i['id']}:{L}", {}).get("grades", {}).get(sysn, {}) for i in items]
            g = [x for x in g if x]
            full = sum(1 for x in g if x.get("meaning") == 2); wrong = sum(1 for x in g if x.get("meaning") == 0)
            lit = sum(1 for i in keyed if judged.get(f"{i['id']}:{L}", {}).get("grades", {}).get(sysn, {}).get("literal"))
            add = sum(1 for x in g if x.get("added")); nat = sum(x.get("natural", 0) for x in g) / max(1, len(g))
            v = ""
            if sysn == "kebdti" and voice:
                ks = [voice[f"{i['id']}:{L}"]["kept"] for i in items if voice.get(f"{i['id']}:{L}", {}).get("kept") is not None]
                v = f"{100 * sum(ks) / max(1, len(ks)):.0f}% ({len(ks)} notes)" if ks else ""
            summary[(L, sysn)] = dict(full=full, n=len(g), wrong=wrong, lit=lit, keyed=len(keyed), added=add, natural=round(nat, 2), voice=v)
            out.append(f"| {LANGS[L]} | {'**Kebdti**' if sysn == 'kebdti' else 'Baseline (plain prompt)'} | {full}/{len(g)} | {wrong} | {lit}/{len(keyed)} | {add} | {nat:.2f} | {v or '—'} |")
    out += ["", "## Into Darija (grandchild → grandparent)", "", "| Language | Messages | Pure Moroccan Darija (no Standard/Middle-Eastern words) | Repaired automatically |", "|---|---|---|---|"]
    for L in LANGS:
        rows = [r for r in x2d.values() if r.get("lang") == L and not r.get("error")]
        out.append(f"| {LANGS[L]} | {len(rows)} | {sum(1 for r in rows if not r['not_darija'])}/{len(rows)} | {sum(1 for r in rows if r.get('fixed'))} |")
    out += ["", "## Every message", ""]
    for it in items:
        out.append(f"### {it['id']} · {it['type']} · {it['darija']}")
        out.append(f"gold: _{it['gold']}_" + (f" · tricky: **{it['key']}**" if it["key"] else ""))
        for L in LANGS:
            g = judged.get(f"{it['id']}:{L}", {}).get("grades", {})
            b, k = g.get("baseline", {}), g.get("kebdti", {})
            out.append(f"- {L} baseline [{b.get('meaning', '?')}{' literal' if b.get('literal') else ''}]: {base[it['id']]['tr'].get(L, '')}")
            out.append(f"- {L} **kebdti** [{k.get('meaning', '?')}{' literal' if k.get('literal') else ''}]: {keb[it['id']]['tr'].get(L, '')}")
        out.append("")
    out += ["## Into Darija, every message (for the Darija speaker to check)", ""]
    for r in sorted(x2d.values(), key=lambda r: r["id"]):
        out.append(f"- {r['id']} ({r['lang']}) {r['text']} → **{r.get('darija', r.get('error'))}**" + (f" ⚠ {r['not_darija']}" if r.get("not_darija") else ""))
    cost = sum(r.get("cost") or 0 for r in list(base.values()) + list(judged.values()))
    out += ["", f"API cost of baseline + judge calls reported by the gateway: ${cost:.4f} (Kebdti calls go through the app's own provider order)."]
    (E / "results" / "lang_report.md").write_text("\n".join(out), encoding="utf-8")
    json.dump({f"{k[0]}:{k[1]}": v for k, v in summary.items()}, open(E / "results" / "lang_summary.json", "w"), indent=1)
    for line in out[:16]:
        print(line)


if __name__ == "__main__":
    main()
