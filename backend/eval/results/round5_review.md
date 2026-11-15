# Round 5 — Luna + prompt v4.2, reviewer notes (Nov 14, 2026)

**Test set:** fresh held-out set `eval/round5_test.json`, 32 Darija messages.
- None of the key expressions were in the prompt.
- No Latin transcription was given, like the real app.
- 3 messages imitate speech-recognition output (no punctuation, repeated words).
- 4 messages are neutral.
- Plus 10 messages into Darija, using the family's own address word.

**Judge:** GPT-6.1 Terra, blind, English only. One item (r19) was not judged: Straitly returned "Spend cap reached ($0.04 of $1.00 this day)".

**Cost:** $0.045 on Straitly.

**Files:** `round5_report.md`, `raw/r5_*.jsonl`.

## Results
| System | Fully understood | Wrong | Natural (1–3) | Neutral kept | Noisy speech | Latency | Cost / msg |
|---|---|---|---|---|---|---|---|
| Luna, plain prompt, thinking high | 17/31 | 3 | 2.45 | — | 3/3 | 8 s | $0.0001 |
| **Luna v4.2, thinking low** | **21/31** | **1** | **2.87** | 4/4 | 3/3 | 9 s | $0.0004 |
| Luna v4.2, thinking high | 18/31 | 2 | 2.61 | 4/4 | 3/3 | 14 s | $0.0004 |

This set is harder than round 4: rare proverbs, and no Latin help.

## What we learned
1. **The prompt still helps a lot on unseen material:** 17 → 21 fully understood, wrong answers 3 → 1, and it sounds more natural (2.45 → 2.87).
2. **"High" thinking is not consistently better:**
   - Round 4: high 25, low 21.
   - Round 5: low 21, high 18.
   - Over both rounds they are equal (≈ 43 vs 42 of 62), and low is faster.
   → **Use thinking "low".**
3. **Speech-recognition noise is handled:** all 3 noisy messages were understood (r26, r27, r28). Repetitions were merged and "satisfied" was not used for الله يرضي عليك.
4. **Remaining failures are rare proverbs the model doesn't know:**
   - اللي ما عندو كبير يشريه
   - زيد الما زيد الدقيق
   - مول الفز كيقفز
   - العكر على الخنونة

   Worst case: for مول الفز كيقفز the model **invented** a confident wrong proverb ("Who dares, wins" / "Old habits die hard").
5. **Some judge "errors" are really answer-key issues** and need team review:
   - r18 "نقيتي" (my Darija for "got good grades" may be wrong)
   - r22 "الصبرديلة"
   - r21 "keep you for your parents" (acceptable)
   - r27 "summer djellaba" (the noisy sentence is truly ambiguous)

## Into Darija (Luna v4.2, high): looks very good, team to confirm
- The family's word is used every time (أ حنا، أ لالة، أ مي، أ سيدي).
- The girl's gender is correct: "كنت معصبة", "راني مزيانة".
- Natural wording: "سمحي ليا", "كتسلم عليك", "بحال ما وريتي ليا", "الطران تأخر".
- 0 non-Moroccan words.

## Fixes in prompt v4.3
- **New rule:** never invent a meaning for an unknown proverb. Translate literally, set confidence to "low", and add an "uncertain" note so the app can show "Kebdti isn't sure".
- **Added** the round-5 expressions and proverbs (so this set is no longer held-out).
- **Family words fixed:** ميمتك = your **mother**. The family profile now passes the address word and the grandchild's gender.
