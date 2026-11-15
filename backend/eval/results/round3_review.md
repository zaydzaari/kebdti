# Round 3 — reviewer notes (Nov 14, 2026)

Goal: make GPT-6 Luna write Darija as warm and Moroccan as Gemini 3.8 Flash, fix Gemini's errors, and check whether a stronger model is worth paying for.

What changed: prompt **v3** (`eval/prompts_v3.py`) adds:
- a Moroccan Darija style guide: Moroccan words to use, Standard Arabic/Egyptian/Levantine words to never use, how to address grandma vs grandpa, and the grandchild's gender;
- 4 few-shot examples;
- a stricter "practical messages are neutral" rule.

**v3.1** adds fixes for the mistakes seen in v3 (فخورة → فرحانة بيا, تحبيه → تبغيه, دعيت معاك, no untranslated "Tbarkallah", feeling tags only from the list).

Test: 18 messages into Darija (x01–x06 from Round 2, plus 12 new ones, 2 of them neutral) and the 20 Round-2 Darija messages into FR/ES/IT/EN.

Raw outputs: `raw/round3_*.jsonl`, `raw/round3_v3.1_*.jsonl`. Tables: `round3_report.md`, `round3_v3.1_report.md`. Cost: $0.33 for this round (Gemini 3.8 Flash $0.09, Gemini 4 Hydrogen $0.08, Mistral $0.07, GPT-6.1 Terra $0.03, DeepSeek V4 Pro $0.03, Luna $0.01).

⚠️ Darija judgements are the assistant's. **The team must confirm them.** v3.1 was tuned on these same messages, so the final scores must come from the held-out real family phrases.

## Into Darija
| Model | Cost / msg | Latency | Neutral kept neutral | Verdict |
|---|---|---|---|---|
| **GPT-6 Luna v3.1** | **$0.0002** | 3.7 s | 2/2 | **Pick.** Now natural and warm: "خديت البيرمي من أول مرة! راني فرحانة بزاف", "سمحي ليا ما عيطتش ليك هاد السيمانة", "كون غير كنت معاك", "دعيت معاك فالجامع". Errors left: "مخلوع" for a broken phone (should be خاسر/مهرس), "زيت العود" (check), "أ لالة" used a bit too often. |
| Gemini 3.8 Flash v3 | $0.0023 (≈10×) | 2.9 s | 1/2 | Still the most colourful ("من الدقة اللولة", "راه ولد الناس", "الزيت البلدية"), but it adds content, made a strange phrase in y09 ("ديك المعاودة") and tagged a neutral message as "care". |
| Gemini 4 Hydrogen | $0.0047 (≈20×) | 6.2 s | 2/2 | Very natural and clean, about the same level as Luna v3.1, but slower and 20× the price. "زيت العود" again. |
| GPT-6.1 Terra | $0.0019 | 2.9 s | 2/2 | Correct but colder ("أ جدتي" everywhere), under-tags feelings, one typo letter (ݣ). |
| DeepSeek V4 Pro | $0.0019 | 9.2 s | 2/2 | Natural ("مهرّس" is very Moroccan) but "تحبيه" (not Moroccan) and slow. |
| Mistral Large 4 | $0.0040 | 10.3 s | 2/2 | **Out:** Latin letters inside the Arabic ("أ dedi", "bgood mention"), 1 invalid JSON. |

## Darija → FR/ES/IT/EN (v3 + glossary)
| Model | Literal traps | Added feeling on neutral msgs | Notes |
|---|---|---|---|
| **GPT-6 Luna v3.1** | **0** | **0/3** | v3 left "Tbarkallah" untranslated; v3.1 gives "Well done, my son, you've become a man!" FR uses "la prunelle de mes yeux". Still says "ma chérie" when the gender is unknown (e05). |
| Gemini 3.8 Flash v3 | 1 | 1/3 (Eid sheep tagged "pride") | Better than Round 2 (was 2/3), but it still **adds content**: e01 "I'm so proud of you" was never said, and e02 "God bless your parents" is half-literal. |

## Decision
- **GPT-6 Luna with prompt v3.1, in both directions.** Prompt engineering closed most of the warmth gap with Gemini at 1/10–1/20 of the cost, and Luna is the most faithful (no added content, neutral stays neutral).
- **Gemini is not worth it for Kebdti.** Its warmth comes partly from adding things the person didn't say, which breaks the "never add feeling" promise. Gemini on the Google key also kept timing out today, so it can't be relied on for a live demo.
- **Backup:** DeepSeek V4.1 Flash (cheap) or Gemini 4 Hydrogen (best quality if money doesn't matter).
- **Darija-specialised open models** (Atlas-Chat 9B/27B, MBZUAI, 2024, Gemma-2 based) exist and could run on the RTX 5070. They're older than these frontier models, so they're only worth testing later as an "open-source baseline" for the write-up.

## For the write-up
- Prompt engineering is measurable: Luna's Darija went from "stiff" (Round 2: "آ الجدة") to natural (v3.1) with zero extra cost per message.
- A trade-off worth reporting: the warmest model (Gemini) was also the least faithful. **Warmth must come from wording, not from added content.**
