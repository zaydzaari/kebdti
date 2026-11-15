# Round 2 — reviewer notes (Nov 14, 2026)

20 new Darija messages (5 with glossary expressions, 15 without) × 3 systems (plain / Kebdti / Kebdti + glossary) + 6 messages into Darija. Raw: `eval/results/raw/round2_*.jsonl`, table: `round2_report.md`. ZenMux cost for Round 2: **$0.197** (Gemini 3.8 Flash was $0.16 of that).

Darija quality is the assistant's judgement and **must be confirmed by the team**.

## Results
| Model | Literal traps: plain → Kebdti → Kebdti+glossary | Neutral messages kept neutral (glossary) | Median latency | Cost per message (glossary system) | Darija writing |
|---|---|---|---|---|---|
| **GPT-6 Luna** | 3 → 2 → **0** | 3/3 | ~4.4 s | ~$0.0002 | Natural ("ردي بالك على راسك", "ما كيجينيش زوين بحال ديالك"); one stiff address ("آ الجدة") |
| **DeepSeek V4.1 Flash** | 4 → 2 → 2 | 3/3 | ~6.2 s | ~$0.0003 | Natural; uses "أ مي" (can also mean "mom") |
| **Gemini 3.8 Flash** (ZenMux) | 2 → 1 → 1 | 2/3 tagged neutral messages as "care" | ~5.9 s | ~$0.0024 (≈10× GPT-6 Luna) | **Warmest, most Moroccan** ("أ حنيني"، "تهلاي فراسك"، "ما جاش بنين بحال ديالك") |
| Gemini 3.6 Flash (AI Studio free) | — | — | — | free | **58/60 calls failed with 429** (free-tier rate limit exhausted) |

## Decision
- **Main Kebdti translator (Darija → FR/ES/IT/EN): GPT-6 Luna + glossary.** The only system with zero literal translations, the cheapest, the fastest and 100% valid JSON.
- **Writing Darija (FR/ES/IT/EN → Darija): GPT-6 Luna for now; Gemini 3.8 Flash is the candidate to beat.** It wrote the most natural, warmest Darija, at ~10× the price (still ~$0.002 per message). The team decides by rating the x01–x06 outputs.
- **Cheap backup:** DeepSeek V4.1 Flash. It sometimes ignores the glossary ("Que Dieu soit satisfait de toi" in e18 even with the glossary).
- **"Just ask a general AI" baseline:** GPT-6 Luna with the plain prompt (same model, so the comparison is fair).
- **Don't depend on the Gemini free tier:** it was overloaded (3.7/3.8 Flash: 503s and timeouts) and rate-limited (3.6 Flash: 429s). The Pro models return 429 on this key. As far as we can tell, the Google AI Pro subscription covers the Gemini app, not API quota, so they would need API billing.

## Evidence for the write-up
1. **The glossary works:** GPT-6 Luna's literal translations went from 3 (plain) → 2 (Kebdti prompt) → 0 (Kebdti + glossary).
2. **The scariest literal error:** with the plain prompt, *"lah yr7em walidik"* (= "thank you so much") became **"May God have mercy on your parents"** in GPT-6 Luna and DeepSeek. To a grandchild, that sounds like their parents have died.
3. **Unseen expressions** (not in the glossary: *3la slamtek*, *bslama*, *lli fat mat*, *bla bik l3id ma 3ndo benna*) were handled well by all three top models with the Kebdti prompt. The plain prompt produced "ce qui est passé est mort" (DeepSeek).
4. **The automatic trap check over-counts a few cases:** Spanish *"luz de mis ojos"* and Maghrebi French *"Que Dieu te facilite"* are real, natural expressions. Final scoring must be done by humans.
