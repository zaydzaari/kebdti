# Round 1 — reviewer notes (Nov 14, 2026)

Screen: 10 Darija → FR/ES/IT/EN messages + 4 FR/ES/IT/EN → Darija messages, 11 models, one shared "Kebdti" prompt, **no glossary**. Total ZenMux cost: **$0.0235**. Raw outputs: `eval/results/raw/`, auto table: `round1_report.md`.

Darija quality below was judged by the assistant and **must be confirmed by the team (native speakers)**.

## Ranking
| # | Model | Verdict | Why |
|---|---|---|---|
| 1 | `openai/gpt-6-luna` | **Top 3** | 0 literal traps, 14/14 valid JSON, natural Darija ("كيف دايرة مع صحتك؟ خدي دواك"), fastest (3.8 s median), $0.002 for all 14 calls. One gender slip (s09, "devenue" for a boy). |
| 2 | `deepseek/deepseek-v4.1-flash` | **Top 3** | The most natural Darija ("قبلوني ف الجامعة! توحشت كسكسوك بزاف"), cheapest, 14/14 JSON. More literal on blessings ("May God be pleased with you", s02 "keep you for me"). 6.3 s. |
| 3 | `gemini-3.6-flash` (AI Studio, free) | **Top 3** | Most culturally rich ("la prunelle de mes yeux", which is a perfect French idiom, flagged by the auto-check as a false positive). But it **adds content** that wasn't said (e.g. "and always be pleased with you", "Good things take patience!"), and had 1 invalid JSON. The free tier can be overloaded (3.7/3.8 Flash timed out today): a risk for a live demo. |
| 4 | `anthropic/claude-haiku-5.5` | Reserve | Very good English, fast (3.4 s), but weaker Darija ("يا ماما الكبيرة، والله كنتي وحشتيني" sounds Egyptian/Levantine, "مشتاق") and literal "Que Dieu soit satisfait de toi". |
| 5 | `z-ai/glm-5.3-flash` | Out | Literal blessings, Darija errors ("كنحشك", "كلي الدوا"), some MSA ("في", "جميع"). |
| 6 | `qwen/qwen3.8-flash` | Out | Egyptian forms ("وحشتيني"), addresses grandma in the masculine ("كيفاش نتا؟"), wrong words ("شقيت للكسكس"). 11 s. |
| — | `minimax/minimax-m3.1-flash` | Out | Broken Darija, Chinese characters leaked into the output ("清楚地"), wrong gender ("Ma chérie" for a boy). |
| — | `xiaomi/mimo-v2.6-flash` | Out | Nonsense Darija ("تيحمرتي عليّا"), adds content. |
| — | `gemini-3.5-flash-lite`, `gemma-4-31b-it`, `z-ai/glm-4.7-flash-free` | Out | 3–6 invalid/failed outputs out of 14; Gemma and GLM-free are slow (~37–39 s). |

## Findings worth keeping for the write-up
1. **Every model translated *lah ykhlik liya* literally** ("May God keep you for me"), even with a prompt that explicitly asks for feeling over words. Only GPT-6 Luna and Gemini 3.6 softened it ("keep you safe and by my side"). This is direct evidence for the research question, and it justifies the **grandma glossary** (few-shot examples from the dev split).
2. **"Que Dieu soit satisfait de toi"** (literal *lah yrdi 3lik*) appeared in 4 models' French output. The English was usually fine. Literalism differs by target language, so per-language reporting matters.
3. **Gender errors are a real failure type:** Darija marks gender ("a wlidi", "twil"), and several models used the wrong gender in French. Add "gender correct?" to the human rating sheet.
4. **Proverbs:** most models keep the image ("honey / bee stings"), which is fine, but some add an explanation the grandmother never said. Count "added content" as an error.
5. **Darija generation separates models more than translation does.** Chinese models other than DeepSeek produced Egyptian-ish or broken Darija.

## Next: Round 2
GPT-6 Luna vs DeepSeek V4.1 Flash vs Gemini 3.6 Flash, on ~25 dev phrases **with the glossary**, all 4 languages, plus the plain-prompt baseline. Estimated cost: under $0.10.
