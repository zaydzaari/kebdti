# Final held-out test — reviewer notes (Nov 14, 2026)

**Test set:** `eval/final_phrases.json`, 41 messages:
- 16 proverbs and idioms collected from the web: mwnlifestyle.com "Exploring the Moroccan idioms and proverbs" and "In Darija we say", and arabamerica.com "Proverbs in Moroccan Arabic that don't make much sense when translated into English". Each was put into a grandparent's sentence.
- 22 everyday grandparent expressions.
- 3 neutral messages.

**None of them appear in the glossary or the prompt examples**, so this is a fair held-out test of prompt v3.1. Arabic spelling and gold meanings were written by the assistant and must be checked by the team.

**Judge:** GPT-6.1 Terra, a different model from both finalists. It was blind: the three English outputs were shuffled as A/B/C. It scored only the English translation, not the cultural notes. Cost: $0.15.

**Files:** raw outputs in `raw/final_*.jsonl`; the full table and every output in `final_report.md`.

## Results
| System | Real meaning (avg 0–2) | Fully understood | Added content | Literal traps (17 items) | Neutral kept neutral | Cost / message |
|---|---|---|---|---|---|---|
| GPT-6 Luna, plain prompt (baseline) | 1.56 | 23/41 | 4 | **4** | — | $0.00009 |
| **GPT-6 Luna, Kebdti v3.1** | 1.73 | 30/41 | **4** | **1** | 3/3 | **$0.00021** |
| Gemini 3.8 Flash, Kebdti v3.1 | **1.80** | **34/41** | 7 | 1 | 3/3 | $0.00268 (13×) |

## What the numbers hide
- **Luna explains proverbs in the cultural note, not in the translation.** For h01 (honey/bees), h05 (peaches), h11 (scissors) and h13 (camel's hump), Luna keeps the image in the translation and gives the real meaning in `cultural_notes`. The judge saw only the translation. In the app the grandchild also gets the note, so Luna's real score is higher than 30/41.
- **Gemini's extra points come with added content:**
  - "don't let anger win" (h33)
  - "my sweet girl" (h34)
  - "May God bless your wedding" (h22)
  - "Bless your hands" (h19)

  It also failed to return a valid answer once (h01).
- **Luna's real misses:**
  - h36 "kebdi 3lik" ("my heart aches for you"): Luna dropped the feeling and confused it with the glossary's "kebdti" (my darling).
  - h20 "lah yhdik" became a literal "May God guide you" (it means "oh come on").
  - h25 "lah ysam7ek" became "May God forgive you" (it means "oh you!").

  These are glossary candidates for the real dev set.

## Final decision
**GPT-6 Luna with prompt v3.1** is the Kebdti translator, in both directions.
- It is the most faithful: least added content, and neutral messages stay neutral.
- It is 13× cheaper than Gemini and just as fast.
- Proverbs are explained in the cultural note.
- Gemini 3.8 Flash understands slightly more but adds content and costs more. Keep it as an optional "premium" or backup.

## For the write-up
- **Baseline → Kebdti on unseen expressions:**
  - literal traps 4 → 1;
  - fully understood messages 23 → 30;
  - the plain prompt has no cultural notes at all.
- **The warmth / faithfulness trade-off is real:** the model that understood the most (Gemini) also added the most.
