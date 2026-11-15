# Luna on prompt v4: reviewer notes (Nov 14, 2026)

**Test set:** fresh held-out set `eval/final_test_v4.json`, 31 messages. 27 use expressions that were NOT in the prompt when it was tested. 3 are neutral.

**Judge:** GPT-6.1 Terra, blind, English only.

**Where it ran:** Straitly (medium/high runs + judge: **$0.035**); the plain and low runs were reused from ZenMux.

**Files:** `v4_luna_report.md` (every message), `raw/v4_luna_*.jsonl`.

| System | Fully understood | Unseen expressions fully understood | Wrong | Added content | Natural (1–3) | Literal traps | Neutral kept | Latency | Cost / msg |
|---|---|---|---|---|---|---|---|---|---|
| Luna, plain prompt (baseline) | 18/31 | 15/27 | 2 | 1 | 2.65 | 4/12 | — | 3.8 s | $0.0001 |
| Luna v4, thinking low | 21/31 | 17/27 | 1 | 2 | 2.77 | 2/12 | 3/3 | 5.2 s | $0.0002 |
| Luna v4, thinking medium | 21/31 | 17/27 | 2 | 2 | 2.81 | 2/12 | 2/3 | 9.7 s | $0.0003 |
| **Luna v4, thinking high** | **25/31** | **21/27** | 1 | 2 | **2.87** | 2/12 | 3/3 | 9.6 s | $0.0003 |

## What still went wrong (Luna v4, high)
- **ميمتك** became "your mother". It means "your grandma", i.e. the speaker herself. All 4 versions made this mistake.
- **إمتى نفرح بيك** became "When will you make me happy?". It means "When will I see you married?". All 4 versions made this mistake.
- **Proverbs kept the image** (tar and honey, the carpenter's door, clapping with one hand), with the meaning only in cultural_notes.
- **The judge's two "added content" flags are not real errors:** "maternal uncle" (خال is exactly that) and "keep it full" (part of the blessing).

## Fix: prompt v4.1
Section 7 of `prompts_v4.py` adds these expressions, ~12 more proverbs, and a rule to use the target language's own proverb.

Re-check on the 6 missed items: **6/6 fixed**.
- "Have you forgotten your grandma?"
- "When will I get to see you married?"
- "There's no place like home"
- "Les cordonniers sont les plus mal chaussés"
- "My condolences to you all"

⚠️ This re-check is in-sample, because the fixes came from this test. The honest held-out score is the table above (v4, high: 25/31).

## Decision for Luna
- **GPT-6 Luna + prompt v4.1 + thinking "high"**: best quality, about $0.0003 per message. That's about **3,000 messages per $1** on Straitly.
- **Latency:** about 10 s per translation. That's fine for voice notes, which are asynchronous, but too slow for a live phone-call feel. Use "low" (5 s) if speed matters more.
- **Plain → Kebdti v4 (high):** fully understood 18 → 25 of 31, literal traps 4 → 2, unseen expressions 15 → 21 of 27.
