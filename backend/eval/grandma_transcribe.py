"""Transcribe grandma's real WhatsApp voice notes (data/audio/grandma_wav) with Gemini 3.8 Flash (via Straitly),
and rate each one for cloning (clarity, noise, other speakers).

Output: data/audio/grandma_wav/transcripts.json  (private: data/audio is git-ignored)
The team then corrects the Darija and writes the intended meaning -> the real held-out test set.
"""
import base64
import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "eval"))
load_dotenv(ROOT / ".env")
from bench_translate import extract_json  # noqa: E402

DIR = ROOT / "data" / "audio" / "grandma_wav"
SYSTEM = """You listen to a WhatsApp voice note from an elderly Moroccan grandmother speaking Darija (maybe with a rural or northern accent).
Return ONLY JSON:
{"transcript": "exactly what is said, in Arabic script, the way Moroccans write Darija (keep French loanwords as said). Mark unclear words as [غير واضح].",
 "speakers": "who speaks (e.g. 'one elderly woman' or 'elderly woman + a child in the background')",
 "clarity": 1-5 (5 = every word clear),
 "noise": 1-5 (5 = silent background),
 "clone_ok": true/false (true only if ONE speaker, clear, little noise, no music/TV),
 "summary_en": "one sentence: what she says, in plain English",
 "feeling": ["1-3 of: love, longing, care, worry, pride, blessing, humor, gratitude, sadness, neutral"]}"""


from gemini_pool import GeminiPool  # noqa: E402
POOLS = [GeminiPool("gemini-3.8-flash"), GeminiPool("gemini-3.6-flash")]  # free Google keys, rotating


def one(wav):
    b64 = base64.b64encode(wav.read_bytes()).decode()
    msgs = [{"role": "system", "content": SYSTEM},
            {"role": "user", "content": [{"type": "input_audio", "input_audio": {"data": b64, "format": "wav"}}]}]
    last = None
    for pool in POOLS:
        try:
            r = pool.chat(msgs, max_tokens=6000, attempts=6)
            j = extract_json(r["text"]) or {"error": (r["text"] or "")[:300]}
            j["model"] = pool.model
            break
        except Exception as e:
            last = str(e)[:200]
    else:
        j = {"error": last}
    j["file"] = wav.stem
    return j


def main():
    durations = dict(l.split() for l in (DIR / "durations.txt").read_text().splitlines() if l.strip())
    wavs = sorted(DIR.glob("*.wav"))
    with ThreadPoolExecutor(max_workers=3) as ex:
        rows = list(ex.map(one, wavs))
    for r in rows:
        r["seconds"] = round(float(durations.get(r["file"], 0)), 1)
    (DIR / "transcripts.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")
    for r in rows:
        print(f"{r['file']} {r['seconds']}s clarity={r.get('clarity')} noise={r.get('noise')} clone_ok={r.get('clone_ok')} | {r.get('speakers')}\n   {r.get('summary_en')}")


if __name__ == "__main__":
    main()
