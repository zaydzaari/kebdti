# Round 3 — warm Moroccan Darija (v3 style guide + few-shot)

## Into Darija: automatic checks

| Model | JSON ok | Non-Moroccan words | Neutral kept neutral (y04, y11) | Median latency (s) | Cost / message (USD) |
|---|---|---|---|---|---|
| `openai/gpt-6-luna` | 18/18 | 1 | 2/2 | 3.67 | 0.00008 |
| `google/gemini-3.8-flash` | 18/18 | 1 | 1/2 | 2.9 | 0.00233 |
| `google/gemini-4-hydrogen` | 18/18 | 1 | 2/2 | 6.22 | 0.00469 |
| `openai/gpt-6.1-terra` | 18/18 | 1 | 2/2 | 2.91 | 0.00190 |
| `deepseek/deepseek-v4-pro` | 18/18 | 1 | 2/2 | 9.18 | 0.00191 |
| `mistralai/mistral-large-4` | 17/18 | 1 | 2/2 | 10.26 | 0.00399 |

## Darija → FR/ES/IT/EN (v3 + glossary): automatic checks

| Model | JSON ok | Literal traps hit | Added feeling on neutral msgs (e08–e10) | Median latency (s) | Cost / message (USD) |
|---|---|---|---|---|---|
| `openai/gpt-6-luna` | 20/20 | 0 | 0/3 | 4.14 | 0.00018 |
| `google/gemini-3.8-flash` | 20/20 | 1 | 1/3 | 3.93 | 0.00233 |

**Total ZenMux cost for this run:** $0.3184

## Into Darija: all outputs (team: rate these)


### x01 (fr, unknown → grandmother) — Mamie, j'ai eu mon bac avec mention ! Tu es fière de moi ?

- **openai/gpt-6-luna**: أ لالة، نجحت فالباك بميزة! واش كتفتاخري بيا؟  _(a lalla, nje7t f lbac b mezya! wash katftakhri biyya?)_ · ['pride']
- **google/gemini-3.8-flash**: أ حنيني، راني شديت الباك ديالي بمونسيون! واش فرحانة بيا؟  _(a 7nini, rani chddit lbac dyali b mention! wach fer7ana biya?)_ · ['pride', 'love']
- **google/gemini-4-hydrogen**: أ مي، خديت الباك بمونسيون! واش فرحانة بيا؟  _(a mi, khdit lbac bmention! wach fer7ana biya?)_ · ['pride', 'love']
- **openai/gpt-6.1-terra**: أ مي، جبت الباك بميزة! واش نتي فخورة بيا؟  _(A mi, jebt lbak b miza! Wach nti fekhoura biya?)_ · ['pride']
- **deepseek/deepseek-v4-pro**: أ مي، جبت الباك بميزة! واش نتي فخورة بيا؟  _(a mi, jebt l-bac b mizya! wach nti fakhoura biya?)_ · ['pride']
- **mistralai/mistral-large-4**: أ مي، خديت الباك بgood mention! واش فرحانة فيا؟  _(a mi, khdit lbak bgood mention! wach fer7ana fiya?)_ · ['pride', 'love']

### x02 (es, unknown → grandmother) — Abuela, mañana es mi cumpleaños. ¿Me vas a llamar?

- **openai/gpt-6-luna**: أ لالة، غدا عيد ميلادي. واش غادي تعيطي ليا؟  _(a lalla, ghdda 3id miladi. wash ghadi t3ayti liya?)_ · ['neutral']
- **google/gemini-3.8-flash**: أ مي، غدا عيد ميلادي. واش غادي تعيطي ليا؟  _(a mi, ghedda 3id miladi. wach ghadi t3eyti liya?)_ · ['love', 'longing']
- **google/gemini-4-hydrogen**: أ مي، غدا عيد ميلادي. واش غادي تعيطي ليا؟  _(a mi, ghda 3id miladi. wach ghadi t3eyti liya?)_ · ['love']
- **openai/gpt-6.1-terra**: أ جدتي، غدا عيد ميلادي. واش غادي تعيطي ليا؟  _(a jddti, ghdda 3id miladi. wach ghadi t3ayti liya?)_ · ['neutral']
- **deepseek/deepseek-v4-pro**: أ مي، غدا عيد ميلادي. واش غادي تعيطي ليا؟  _(a mi, ghadda 3id miladi. wash ghadi t3ayti liya?)_ · ['neutral']
- **mistralai/mistral-large-4**: أ مي، غدا عيد ميلادي، واش غادي تتصلي lia؟  _(a mi, ghada 3id miladi, wach ghadi tetsli lia?)_ · ['neutral']

### x03 (it, unknown → grandmother) — Nonna, ho la febbre ma sto bene, non preoccuparti.

- **openai/gpt-6-luna**: أ مي، عندي السخانة ولكن لاباس عليا، ما تقلقيش.  _(a mi, 3andi skhana walakin labas 3liya, ma tqelqich.)_ · ['care', 'worry']
- **google/gemini-3.8-flash**: أ حنيني، فيا السخانة ولكن راني بيخير، ما تقلقيش.  _(a 7nini, fiya skhana walakin rani bikhir, ma t9el9ich.)_ · ['care']
- **google/gemini-4-hydrogen**: أ مي، عندي السخانة ولكن راني بخير، ما تخافيش.  _(a mi, 3endi sskhana walakin rani bikhir, ma tkhafich.)_ · ['care', 'worry']
- **openai/gpt-6.1-terra**: أ جدتي، عندي السخانة ولكن راني مزيان، ما تقلقيش.  _(a jedti, 3endi skhana walakin rani mzyan, ma t9el9ich.)_ · ['care']
- **deepseek/deepseek-v4-pro**: أ مي، عندي السخانة ولكن راني بخير، ما تخافيش.  _(a mi, 3ndi sskhana walakin rani bkhir, ma tkhafich.)_ · ['care']
- **mistralai/mistral-large-4**: أ مي، راني سخون ولكن راني مزيان، ما تخافيش.  _(a mi, rani skhoun walakin rani mzyan, ma tkhafich.)_ · ['care']

### x04 (en, unknown → grandmother) — Grandma, I'm learning to cook your tagine. It's not as good as yours!

- **openai/gpt-6-luna**: أ مي، راني كنتعلم نطيب الطاجين ديالك. ولكن ما كيجيش بنين بحال ديالك!  _(a mi, rani kant3ellem nteyyeb tajine dyalek. walakin ma kayjich bnin b7al dyalek!)_ · ['humor']
- **google/gemini-3.8-flash**: أ حنيني، راني كنتعلم نطيب الطاجين ديالك. والو، ما جاش بنين بحال ديالك!  _(a 7nini, rani kant3ellem ntiyeb ttajin dyalek. walou, ma jach bnin b7al dyalek!)_ · ['humor', 'love']
- **google/gemini-4-hydrogen**: أ حنيني، راني كنتعلم نطيب الطاجين ديالك. ما جاش بنين بحال ديالك!  _(a 7nini, rani knt3ellem nteyyeb ttajin dyalek. ma jach bnin b7al dyalek!)_ · ['love', 'humor']
- **openai/gpt-6.1-terra**: أ جدتي، راني كنتعلم نطيب الطاجين ديالك. ما كيجيش بنين بحال ديالك!  _(a jedditi, rani kente3llem nteyyeb ttajin dyalek. ma kayjich bnin b7al dyalek!)_ · ['neutral']
- **deepseek/deepseek-v4-pro**: أ مي، راني كنتعلم نطيب الطاجين ديالك. ما كيخرجش بحال ديالك!  _(a mi, rani knt3allem ntayyeb ttajin dyalk. ma kayekhrejsh b7al dyalk!)_ · ['love', 'humor']
- **mistralai/mistral-large-4**: أ مي، راني كنتعلم نطيّب الطاجين ديالك، ما طلعش مزيان بحال ديالك!  _(a mi, rani kent3allem nṭayyeb ṭṭajin dyalk, ma ṭle3ch mzyan b7al dyalk!)_ · ['love']

### x05 (fr, unknown → grandmother) — Je t'aime fort, mamie. Prends soin de toi.

- **openai/gpt-6-luna**: كنبغيك بزاف، أ مي. تهلاي فراسك.  _(kanbghik bzaf, a mi. thlay f rassek.)_ · ['love', 'care']
- **google/gemini-3.8-flash**: كنبغيك بزاف أ مي. تهلاي فراسك.  _(kanbghik bzaf a mi. thllay frask.)_ · ['love', 'care']
- **google/gemini-4-hydrogen**: كنبغيك بزاف أ مي، تهلاي فراسك.  _(kanbghik bzaf a mi, thllay frassek.)_ · ['love', 'care']
- **openai/gpt-6.1-terra**: كنبغيك بزاف، أ جدتي. تهلاي فراسك.  _(kanbghik bzzaf, a jedti. tehlay frassek.)_ · ['love', 'care']
- **deepseek/deepseek-v4-pro**: أ حنيني، كنبغيك بزاف. تهلاي فراسك.  _(a 7nini, kanbghik bzaf. thlay f rasek.)_ · ['love', 'care']
- **mistralai/mistral-large-4**: أ مي، كنبغيك بزاف. تهلاي فراسك.  _(a mi, knebghik bzaf. tehli f rask.)_ · ['love', 'care']

### x06 (en, unknown → grandfather) — Grandpa, I'm coming to Morocco for Eid with mom and dad.

- **openai/gpt-6-luna**: أ جدي، غادي نجي للمغرب فالعيد مع ماما وبابا.  _(a jeddi, ghadi nji l lmghrib fl3id m3a mama w baba.)_ · ['neutral']
- **google/gemini-3.8-flash**: أ جدي، راني جاي للمغرب فالعيد مع ماما وبابا.  _(a jeddi, rani jay llmghrib f l3id m3a mama w baba.)_ · ['love', 'longing']
- **google/gemini-4-hydrogen**: أ جدي، راني جاي للمغرب فالعيد مع ماما وبابا.  _(a jeddi, rani jay lmeghrib fl3id m3a mama w baba.)_ · ['love', 'longing']
- **openai/gpt-6.1-terra**: أ جدي، غادي نجي للمغرب فالعيد مع ماما وبابا.  _(a jeddi, ghadi nji lmeghrib f l3id m3a mama w baba.)_ · ['neutral']
- **deepseek/deepseek-v4-pro**: أ جدي، غادي نجي للمغرب فالعيد مع ماما وبابا.  _(a jeddi, ghadi nji lmeghrib f l3id m3a mama w baba.)_ · ['neutral']
- **mistralai/mistral-large-4**: أ dedi، غادي نجي للمغرب فالعيد مع mamá و papa.  _(a dedi, ghadi nji lmaghrib fal3id m3a mama w papa.)_ · ['neutral']

### y01 (fr, girl → grandmother) — Mamie, j'ai eu mon permis du premier coup ! Je suis trop contente.

- **openai/gpt-6-luna**: أ مي، خديت البيرمي من أول مرة! راني فرحانة بزاف.  _(a mi, khdit lbirmi men awal marra! rani fer7ana bzaf.)_ · ['pride']
- **google/gemini-3.8-flash**: أ لالة، شديت البيرمي من الدقة اللولة! راني فرحانة بزاف.  _(a lalla, cheddit lbirmi men ddeqqa lloula! rani fer7ana bzaf.)_ · ['pride', 'love']
- **google/gemini-4-hydrogen**: أ مي، خديت البيرمي من المرة اللولة! راني فرحانة بزاف.  _(a mi, khdit lpermi men lmerra lewla! rani fer7ana bzaf.)_ · ['pride']
- **openai/gpt-6.1-terra**: أ مي، ديت البيرمي من المرة اللولة! راني فرحانة بزاف.  _(a mi, dit lpermi men lmerra lloula! rani fer7ana بزaf.)_ · ['pride']
- **deepseek/deepseek-v4-pro**: أ مي، شديت البيرمي من أول مرة! راني فرحانة بزاف.  _(a mi, cheddit lbirmi mn awal marra! rani fer7ana bzaf.)_ · ['pride']
- **mistralai/mistral-large-4**: أ مي، جبت البيرمي من أول مرة! فرحانة بزاف.  _(a mi, jbet lbirmi mn awel marra! fer7ana bzaf.)_ · ['pride', 'love']

### y02 (en, boy → grandmother) — Grandma, I miss your bread so much. Nothing here tastes like home.

- **openai/gpt-6-luna**: أ حنيني، توحشت الخبز ديالك بزاف. حتى حاجة هنا ما كتجيش بنينة بحال ديال الدار.  _(a 7nini, twe7chte lkhobz dyalek bzaf. 7ta 7aja hna ma katjich bnina b7al dyal ddar.)_ · ['longing']
- **google/gemini-3.8-flash**: أ حنيني، توحشت الخبز ديالك بزاف. حتى حاجة هنا ما عندها المذاق ديال الدار.  _(a 7nini, twe7chtek lkhebz dyalek bzaf. 7ta 7aja hna ma 3ndha lmadaq dyal ddar.)_ · ['longing', 'love']
- **google/gemini-4-hydrogen**: أ حنيني، توحشت الخبز ديالك بزاف. حتى حاجة هنا ما عندها المذاق ديال الدار.  _(a 7nini, twe7echt lkhobz dyalek bzaf. 7ta 7aja hna ma 3endha lmada9 dyal dar.)_ · ['longing']
- **openai/gpt-6.1-terra**: أ مي، توحشت الخبز ديالك بزاف. والو هنا ما عندو بنة ديال الدار.  _(a mi, twe7echt lkhobz dyalek بزاف. walou hna ma 3endo bennet dyal ddar.)_ · ['longing']
- **deepseek/deepseek-v4-pro**: أ حنيني، توحشت خبزك بزاف. ما كاين والو هنا كيجي بحال الدار.  _(a 7nini, twe7cht khobzek bzaf. ma kayn walou hna kiji b7al ddar.)_ · ['longing', 'love']
- **mistralai/mistral-large-4**: أ مي، توحشت على خبزتك بزاف بزاف. ماكاينش هنا حتى حاجة بنينة بحال الدار.  _(a mi, twe7cht 3la khobztek bzaf bzaf. makaynch hna 7ta 7aja bnina b7al ddar.)_ · ['longing', 'love']

### y03 (es, girl → grandfather) — Abuelo, ¿cómo está tu rodilla? ¿Fuiste al médico?

- **openai/gpt-6-luna**: أ جدي، كيف دايرة ركبتك؟ واش مشيتي عند الطبيب؟  _(a jeddi, kif dayra rekbtek? wash mchiti 3and tbib?)_ · ['care']
- **google/gemini-3.8-flash**: أ جدي، كيف بقات ركبتك؟ واش مشيتي عند الطبيب؟  _(a jeddi, kif b9at rekbtik? wach mchiti 3nd tbib?)_ · ['care', 'worry']
- **google/gemini-4-hydrogen**: أ جدي، كيفاش ركبتك دابا؟ واش مشيتي عند الطبيب؟  _(a jeddi, kifach rekbetk daba? wach mchiti 3end tbib?)_ · ['care', 'worry']
- **openai/gpt-6.1-terra**: أ جدي، كيدايرة ركبتك؟ واش مشيتي للطبيب؟  _(a jeddi, kidayra rekbtek? wach mchiti ltbib?)_ · ['care', 'worry']
- **deepseek/deepseek-v4-pro**: أ جدي، كيفاش ركبتك؟ واش مشيتي عند الطبيب؟  _(a jeddi, kifash rekbtk? wash mshiti 3nd ttabib?)_ · ['care', 'worry']
- **mistralai/mistral-large-4**: أ dedi، كيفاش ركبتك؟ واش مشى للطبيب؟  _(a dedi, kifach rekbetek? wach mcha ltbib?)_ · ['care', 'worry']

### y04 (it, boy → grandmother) — Nonna, arrivo sabato alle 15. Papà viene a prenderti.

- **openai/gpt-6-luna**: أ مي، غادي نوصل نهار السبت مع الثلاثة ديال العشية. بابا غادي يجي ياخدك.  _(a mi, ghadi nousel nhar sebt m3a tletta dyal l3chiya. baba ghadi yji yakhdek.)_ · ['neutral']
- **google/gemini-3.8-flash**: أ مي، راني غادي نوصل نهار السبت مع الثلاثة ديال العشية. وبابا غادي يجي يجيبك.  _(a mi, rani ghadi nousel nhar ssebt m3a ttlata dyal l3chiya. w baba ghadi yji yjibek.)_ · ['neutral']
- **google/gemini-4-hydrogen**: أ مي، غادي نوصل نهار السبت مع الثلاثة ديال العشية. بابا غادي يجي يديك.  _(a mi, ghadi nousel nhar ssebt m3a tlata dyal l3chiya. baba ghadi yji yddik.)_ · ['neutral']
- **openai/gpt-6.1-terra**: أ جدتي، غادي نوصل نهار السبت مع الثلاثة ديال العشية. بابا غادي يجي يديك.  _(a jedti, ghadi nwsel nhar ssebt m3a tlatta dyal l3chiya. baba ghadi yji yeddik.)_ · ['neutral']
- **deepseek/deepseek-v4-pro**: أ مي، غادي نجي نهار السبت مع الثلاثة ديال العشية. بابا غادي يجي ياخدك.  _(a mi, ghadi nji nhar ssebt m3a tleta dyal l3chiya. baba ghadi yji yakhdek.)_ · ['neutral']
- **mistralai/mistral-large-4**: أ مي، غادي نجي نهار السبت مع الثلاثة ديال العشية، بابا غادي يجي يجيبك.  _(a mi, ghadi nji nhar sebt m3a tlata dyal l3chiya, baba ghadi yji yjibek.)_ · ['neutral']

### y05 (fr, boy → grandfather) — Papy, j'ai prié pour toi à la mosquée vendredi.

- **openai/gpt-6-luna**: أ جدي، دعيت ليك فالجامع نهار الجمعة.  _(a jeddi, d3it lik f jame3 nhar jjem3a.)_ · ['blessing']
- **google/gemini-3.8-flash**: أ جدي، راني دعيت معاك فالجامع نهار الجمعة.  _(a jeddi, rani d3it m3ak f ljam3 nhar jjem3a.)_ · ['care', 'blessing']
- **google/gemini-4-hydrogen**: أ جدي، دعيت معاك فالجامع نهار الجمعة.  _(a jeddi, d3it m3ak f ljame3 nhar jjem3a.)_ · ['blessing', 'love']
- **openai/gpt-6.1-terra**: أ جدي، دعيت معاك فالجامع نهار الجمعة.  _(a jeddi, d3it m3ak f ljame3 nhar jjem3a.)_ · ['blessing']
- **deepseek/deepseek-v4-pro**: أ جدي، دعيت ليك فالجامع نهار الجمعة.  _(a jeddi, d3it lik f ljame3 nhar jjem3a.)_ · ['blessing', 'love']
- **mistralai/mistral-large-4**: أ dedi، دعيتي ليك فالجامع نهار الجمعة.  _(a jeddi, d3iti lik faljam3 nhar jjem3a.)_ · ['blessing', 'love']

### y06 (en, girl → grandmother) — Grandma, I got engaged! He's a good man, you'll love him.

- **openai/gpt-6-luna**: أ مي، راني تخطبت! راه راجل مزيان، وغادي تبغيه بزاف.  _(a mi, rani tkhettabt! rah rajel mzian, w ghadi tebghih bzaf.)_ · ['love', 'pride']
- **google/gemini-3.8-flash**: أ حنيني، راني تخطبت! راه ولد الناس، غادي يعجبك بزاف.  _(a 7nini, rani tkhtebt! rah wld nass, ghadi y3jbek bzaf.)_ · ['pride', 'love']
- **google/gemini-4-hydrogen**: أ حنيني، راني تخطبت! راه راجل مزيان، غادي تبغيه.  _(a 7nini, rani tkhtebt! rah rajel mezyan, ghadi tebghih.)_ · ['love']
- **openai/gpt-6.1-terra**: أ مي، تخطبت! راه راجل مزيان، غادي يعجبك.  _(a mi, tkhtbet! rah rajel mzyan, ghadi y3jebek.)_ · ['love']
- **deepseek/deepseek-v4-pro**: أ مي، راني تخطبت! هو راجل مزيان، غادي تحبيه.  _(a mi, rani tkhatebt! houwa rajel mzyan, ghadi t7ebbih.)_ · ['love', 'pride']
- **mistralai/mistral-large-4**: أ مي، تخطبت! هو راجل مزيان، غادي تعجبك.  _(a mi, t5tebt! hou rajel mzyan, ghadi t3jebek.)_ · ['love', 'pride']

### y07 (es, boy → grandmother) — Abuela, perdón por no llamarte esta semana, tuve muchos exámenes.

- **openai/gpt-6-luna**: أ مي، سمحي ليا ما عيطتش ليك هاد السيمانة، كانو عندي بزاف ديال الامتحانات.  _(a mi, sme7i lia ma 3eyettch lik had simana, kano 3ndi bzaf dyal limti7anat.)_ · ['neutral']
- **google/gemini-3.8-flash**: أ مي، سمحي ليا حيت ما عيطتش ليك هاد السيمانة، كانو عندي الامتحانات بزاف.  _(a mi, sem7i liya 7it ma 3eyyet-ch lik had ssimana, kano 3endi l'imtihanat bzaf.)_ · ['care', 'love']
- **google/gemini-4-hydrogen**: أ حنيني، سمحي ليا حيت ما عيطتش ليك هاد السيمانة، كانو عندي بزاف ديال الامتحانات.  _(a 7nini, sm7i liya 7it ma 3eyyetch lik had simana, kano 3endi bzaf dyal limti7anat.)_ · ['care']
- **openai/gpt-6.1-terra**: أ جدتي، سمحي ليا ما عيطتش ليك هاد السيمانة، كانو عندي بزاف ديال الامتحانات.  _(a jedti, sem7i liya ma 3iyyettch lik had simana, kano 3endi bzaf dyal limti7anat.)_ · ['neutral']
- **deepseek/deepseek-v4-pro**: أ مي، سمحي ليا ما عيطتش ليك هاد السيمانة، كان عندي بزاف ديال الإمتحانات.  _(a mi, sm7i liya ma 3ayttech lik had ssimana, kan 3endi bzaf dyal l'imti7anat.)_ · ['care', 'worry']
- **mistralai/mistral-large-4**: ❌ invalid JSON

### y08 (fr, girl → grandmother) — Le colis est arrivé, merci. Il y avait les gâteaux et l'huile d'olive.

- **openai/gpt-6-luna**: أ مي، الكولي وصل، بارك الله فيك. كانو فيه الحلوى وزيت العود.  _(a mi, lkoli wsel, barak allah fik. kano fih l7elwa w zit l3oud.)_ · ['gratitude']
- **google/gemini-3.8-flash**: الكولي وصل، بارك الله فيك. لقيت فيه الحلوى والزيت البلدية.  _(l-coli wsel, barek lahu fik. lqit fih l-7elwa w z-zit l-beldiyya.)_ · ['gratitude']
- **google/gemini-4-hydrogen**: الكوليا وصلات، بارك الله فيك. كانو فيها الحلوى وزيت العود.  _(lkolia weslat, barek lah fik. kanou fiha l7elwa w zit l3oud.)_ · ['gratitude']
- **openai/gpt-6.1-terra**: الكوݣي وصل، شكرا. كانو فيه الحلوى وزيت الزيتون.  _(l koli wsel, chokran. kanou fih l7lwa w zit zitoun.)_ · ['neutral']
- **deepseek/deepseek-v4-pro**: أ مي، الكولي وصل، بارك الله فيك. كانو فيه الحلوة وزيت الزيتون.  _(a mi, lcoli wsel, barak allah fik. kanou fih l7alwa w zit zzitoun.)_ · ['neutral']
- **mistralai/mistral-large-4**: أ مي، الباك وصل، الله يرحم والديك. فيه الحلوى وزيت الزيتون.  _(a mi, lbak wssl, lah yr7em walidik. fih l7elwa w zit zziton.)_ · ['gratitude']

### y09 (en, boy → grandfather) — Grandpa, tell me again the story of when you came to France in 1972.

- **openai/gpt-6-luna**: أ جدي، عاود ليا الحكاية ديال ملي جيتي لفرنسا فالعام ديال اثنين وسبعين.  _(a jeddi, 3awed lia l7kaya dyal mlli jiti lfransa fl3am dyal juj w seb3in.)_ · ['love']
- **google/gemini-3.8-flash**: أ جدي، عاود ليا عاوتاني ديك المعاودة ملي جيتي لفرنسا فالعام ديال اثنين وسبعين.  _(a jeddi, 3awed liya 3awtani dik lm3awda mlli jiti lfransa fel3am dyal tnin w seb3in.)_ · ['love', 'longing']
- **google/gemini-4-hydrogen**: أ جدي، عاود ليا عاوتاني القصة ديال ملي جيتي لفرانسا فالعام ديال اثنين وسبعين.  _(a jeddi, 3awed liya 3awtani l9issa dyal melli jiti lfransa f l3am dyal tnin w seb3in.)_ · ['love']
- **openai/gpt-6.1-terra**: أ جدي، عاود ليا القصة ديال ملي جيتي لفرانسا فالعام ديال ألف وتسعمية واثنين وسبعين.  _(a jeddi, 3awed liya l9issa dyal mlli jiti lfransa f l3am dyal alf w tes3miya w tnin w seb3in.)_ · ['neutral']
- **deepseek/deepseek-v4-pro**: أ جدي، عاود ليا الحكاية ديال ملي جيتي لفرانسا فالعام ديال اثنين وسبعين.  _(a jeddi, 3awed liya l7kaya dyal melli jiti lfaransa f l3am dyal tnayn w seb3in.)_ · ['neutral']
- **mistralai/mistral-large-4**: أ dedi، عاود lia الحكاية ديال ملي jit لFrança فالعاام ديال اثنين وسبعين.  _(a dedi, 3aoud lia l7kaya dyal mlli jit lFrança fal3am dyal etnin w se3bin.)_ · ['love']

### y10 (it, girl → grandmother) — Nonna, ti voglio bene. Sei la persona più forte che conosco.

- **openai/gpt-6-luna**: أ لالة، كنبغيك. نتي أقوى وحدة كنعرف.  _(a lalla, kanbghik. nti aqwa wa7da kan3ref.)_ · ['love', 'pride']
- **google/gemini-3.8-flash**: أ مي، كنبغيك بزاف. نتي أقوى وحدة كنعرفها فهاد الدنيا.  _(a mi, kanbghik bzaf. nti aqwa we7da kan3refha fhad ddenya.)_ · ['love', 'pride']
- **google/gemini-4-hydrogen**: أ مي، كنبغيك. نتي أقوى وحدة كنعرفها.  _(a mi, kanbghik. nti a9wa we7da kan3refha.)_ · ['love', 'pride']
- **openai/gpt-6.1-terra**: أ مي، كنبغيك. نتي أقوى وحدة كنعرف.  _(a mi, kanbghik. nti a9wa we7da kan3ref.)_ · ['love', 'pride']
- **deepseek/deepseek-v4-pro**: أ مي، كنبغيك. نتي أقوى وحدة كنعرف.  _(a mi, kanbghik. nti aqwa wehda kan3ref.)_ · ['love', 'pride']
- **mistralai/mistral-large-4**: أ مي، كنبغيك. نتي أقوى واحدة كنعرفها.  _(a mi, kenb8ik. nti aqwa wa7ida ken3refha.)_ · ['love']

### y11 (fr, boy → grandmother) — Mamie, mon téléphone était cassé, c'est pour ça que je ne répondais pas.

- **openai/gpt-6-luna**: أ لالة، التيليفون ديالي كان خاسر، على هاد الشي ما كنتش كنجاوب.  _(a lala, ttilifon dyali kan khaser, 3la had chi ma kontch kanjawb.)_ · ['neutral']
- **google/gemini-3.8-flash**: أ لالة، التيليفون ديالي كان مخسر، داكشي علاش ما كنتش كنجاوب.  _(a lalla, ttillifoun dyali kan mxesser, dakchi 3lach ma kountch kanjawb.)_ · ['care']
- **google/gemini-4-hydrogen**: أ حنيني، التيليفون ديالي كان خاسر، داكشي علاش ما كنتش كنجاوب.  _(a 7nini, tilifoun dyali kan khaser, dakchi 3lach ma kentch kanjawb.)_ · ['neutral']
- **openai/gpt-6.1-terra**: أ مي، التيليفون ديالي كان خاسر، هادشي علاش ما كنتش كنجاوب.  _(a mi, ttilifun dyali kan khaser, hadchi 3lach ma kountch kanjawb.)_ · ['neutral']
- **deepseek/deepseek-v4-pro**: أ مي، التيليفون ديالي كان مهرّس، هاديك علاش ما كنتش كنرد عليك.  _(a mi, ttéléphone dyali kan mherres, hadik 3lach ma kentch kenred 3lik.)_ · ['neutral']
- **mistralai/mistral-large-4**: أ مي، التيليفون ديالي كان خسران، حيت ما كنتش كنرد.  _(a mi, tilifon dyali kan khsran, 7it ma kuntich knard.)_ · ['neutral']

### y12 (en, girl → grandmother) — Happy Eid grandma! I wish I was there with you.

- **openai/gpt-6-luna**: عيد مبارك أ حنيني! يا ريتني نكون معاك.  _(3id mobarak a 7nini! ya ritni nkoun m3ak.)_ · ['love', 'longing']
- **google/gemini-3.8-flash**: مبروك العيد أ مي! تمنيت لو كان كنت معاك تما.  _(mbrouk l3id a mi! tmennit lou kan kent m3ak temma.)_ · ['love', 'longing']
- **google/gemini-4-hydrogen**: عيد مبارك أ حنيني! كنت نتمنى نكون معاكم تما.  _(3id mbarek a 7nini! kent ntmna nkoun m3akom tema.)_ · ['love', 'longing', 'blessing']
- **openai/gpt-6.1-terra**: عيد مبارك أ مي! كون غير كنت تما معاك.  _(3id mbarak a mi! kon ghir kent temma m3ak.)_ · ['blessing', 'longing']
- **deepseek/deepseek-v4-pro**: أ حنيني، عيدك مبارك! يا ريتني كنت معاكي.  _(a 7nini, 3idk mabrouk! ya ritni kent m3aki.)_ · ['love', 'longing']
- **mistralai/mistral-large-4**: عيد مبارك أ مي، بغيت نكون hunak معاك.  _(3id moubarak a mi, bğit nkon hunak m3ak.)_ · ['love', 'longing']

## Darija → EN / FR (v3 + glossary)


### e01 — تبارك الله عليك أوليدي، وليتي راجل!  
_tbarkallah 3lik a wlidi, wlliti rajel!_ · gold: _Look at you, my boy, you've become a man! (proud)_

- **openai/gpt-6-luna**: EN: Tbarkallah, my son, you've become a man! | FR: Tbarkallah, mon fils, tu es devenu un homme ! · ['pride', 'love']
- **google/gemini-3.8-flash**: EN: Look at you, my boy, I'm so proud of you, you've grown into a real man! | FR: Je suis si fière de toi mon garçon, tu es devenu un vrai homme ! · ['pride', 'love', 'blessing']

### e02 — الله يرحم والديك، جبتي ليا الدوا.  
_lah yr7em walidik, jbti liya dwa._ · gold: _Thank you so much for bringing me my medicine._

- **openai/gpt-6-luna**: EN: Thank you so much for bringing me the medicine. | FR: Merci infiniment, tu m’as apporté le médicament. · ['gratitude']
- **google/gemini-3.8-flash**: EN: Thank you so much, God bless your parents, you brought me the medicine. | FR: Merci infiniment, que Dieu bénisse tes parents, tu m'as apporté mes médicaments. · ['gratitude', 'blessing']

### e03 — على سلامتك أبنتي، الحمد لله وصلتي بخير.  
_3la slamtek a benti, l7amdulillah wselti bkhir._ · gold: _Welcome back safe and sound, my girl, thank God you arrived safely._

- **openai/gpt-6-luna**: EN: I’m glad you made it safely, my daughter. Thank God, you arrived safe and sound. | FR: Heureuse que tu sois arrivée sans encombre, ma fille. Dieu merci, tu es bien arrivée. · ['care', 'relief']
- **google/gemini-3.8-flash**: EN: Welcome safely, my girl, thank God you arrived well. | FR: Bienvenue ma fille, Dieu merci tu es bien arrivée. · ['care', 'gratitude', 'love']

### e04 — سير الله يعاونك، وما تنساش تعيط لمك.  
_sir lah y3awnek, w ma tnsach t3iyet l mmok._ · gold: _Go on, good luck, and don't forget to call your mom._

- **openai/gpt-6-luna**: EN: Go on, may God help you, and don’t forget to call your mother. | FR: Vas-y, que Dieu t’aide, et n’oublie pas d’appeler ta mère. · ['blessing', 'care']
- **google/gemini-3.8-flash**: EN: Go on, may God help you, and don't forget to call your mother. | FR: Va, que Dieu t'aide, et n'oublie pas d'appeler ta mère. · ['care', 'blessing']

### e05 — يا كبدتي، شحال كبرتي! الله يحفظك.  
_a kebdti, ch7al kberti! lah y7fdek._ · gold: _My darling, how much you've grown! God protect you._

- **openai/gpt-6-luna**: EN: My darling, how you’ve grown! May God protect you. | FR: Ma chérie, comme tu as grandi ! Que Dieu te protège. · ['love', 'pride', 'blessing']
- **google/gemini-3.8-flash**: EN: My darling, look how much you've grown! God protect you. | FR: Mon cœur, comme tu as grandi ! Que Dieu te protège. · ['love', 'pride', 'blessing']

### e06 — الله يسهل عليك فالخدمة الجديدة أ عينيا.  
_lah ysehhel 3lik f lkhedma jdida a 3iniya._ · gold: _Good luck with your new job, my dear._

- **openai/gpt-6-luna**: EN: Wishing you lots of success in your new job, my dear. | FR: Je te souhaite beaucoup de réussite dans ton nouveau travail, mon trésor. · ['blessing', 'love']
- **google/gemini-3.8-flash**: EN: May God make everything smooth and grant you success in your new job, my dear. | FR: Que Dieu te facilite les choses dans ton nouveau travail, prunelle de mes yeux. · ['blessing', 'love', 'care']

### e07 — الله يعطيك ما تمنيتي فهاد العام.  
_lah y3tik ma tmennity f had l3am._ · gold: _May you get everything you wish for this year._

- **openai/gpt-6-luna**: EN: May God grant you everything you’ve wished for this year. | FR: Que Dieu t’accorde tout ce que tu as souhaité cette année. · ['blessing']
- **google/gemini-3.8-flash**: EN: May God grant you everything your heart desires this year. | FR: Que Dieu t'accorde tout ce que ton cœur désire en cette nouvelle année. · ['blessing', 'love', 'care']

### e08 — الماكلة واجدة، جيو تاكلو.  
_lmakla wajda, jiw taklo._ · gold: _Food's ready, come and eat._

- **openai/gpt-6-luna**: EN: The food is ready, come eat. | FR: Le repas est prêt, venez manger. · ['neutral']
- **google/gemini-3.8-flash**: EN: The food is ready, come eat. | FR: Le repas est prêt, venez manger. · ['neutral']

### e09 — الضو قطع البارح ورجع هاد الصباح.  
_ddaw qta3 lbare7 w rje3 had sbah._ · gold: _The power went out yesterday and came back this morning._

- **openai/gpt-6-luna**: EN: The power went out yesterday and came back this morning. | FR: L’électricité a été coupée hier et est revenue ce matin. · ['neutral']
- **google/gemini-3.8-flash**: EN: The power went out yesterday and came back this morning. | FR: Le courant a été coupé hier et est revenu ce matin. · ['neutral']

### e10 — شريت حولي العيد، كبير ومزيان.  
_chrit 7awli l3id, kbir w mzyan._ · gold: _I bought the sheep for Eid, it's big and nice._

- **openai/gpt-6-luna**: EN: I bought the Eid sheep; it’s big and handsome. | FR: J’ai acheté le mouton de l’Aïd, il est grand et beau. · ['neutral']
- **google/gemini-3.8-flash**: EN: I bought the sheep for Eid, it's big and handsome. | FR: J'ai acheté le mouton de l'Aïd, il est grand et magnifique. · ['pride']

### e11 — راسي كيضرني شوية ولكن لاباس، ما تخلعش.  
_rasi kaydorni chwiya walakin labas, ma tkhla3ch._ · gold: _I have a bit of a headache but I'm fine, don't worry._

- **openai/gpt-6-luna**: EN: I have a bit of a headache, but I’m okay. Don’t worry. | FR: J’ai un peu mal à la tête, mais ça va. Ne t’inquiète pas. · ['care']
- **google/gemini-3.8-flash**: EN: I have a bit of a headache, but I'm fine, don't worry. | FR: J'ai un peu mal à la tête mais ça va, ne t'inquiète pas. · ['care']

### e12 — نتا ضو عينيا.  
_nta daw 3iniya._ · gold: _You're the light of my eyes (you mean everything to me)._

- **openai/gpt-6-luna**: EN: You are the light of my eyes. | FR: Tu es la lumière de mes yeux. · ['love']
- **google/gemini-3.8-flash**: EN: You are the light of my eyes, my darling. | FR: Tu es la prunelle de mes yeux, mon chéri. · ['love', 'pride']

### e13 — قلبي معاك فالامتحان، ربي يكون معاك.  
_qelbi m3ak f limti7an, rebbi ykoun m3ak._ · gold: _I'm with you with all my heart for your exam, may God be with you._

- **openai/gpt-6-luna**: EN: My heart is with you for the exam. May God be with you. | FR: Je pense fort à toi pour l’examen. Que Dieu soit avec toi. · ['care', 'blessing']
- **google/gemini-3.8-flash**: EN: My heart is with you for your exam, may God be by your side. | FR: Tout mon cœur est avec toi pour ton examen, que Dieu soit à tes côtés. · ['love', 'care', 'blessing']

### e14 — اللي فات مات.  
_lli fat mat._ · gold: _What's past is past, let it go._

- **openai/gpt-6-luna**: EN: What’s past is past. | FR: Ce qui est passé est passé. · ['neutral']
- **google/gemini-3.8-flash**: EN: What's in the past is in the past. | FR: Ce qui est passé est passé, c'est du passé. · ['care']

### e15 — الصبر مفتاح الفرج.  
_sber mefta7 lfaraj._ · gold: _Patience is the key to relief (things will get better)._

- **openai/gpt-6-luna**: EN: Patience is the key to getting through hard times. | FR: La patience est la clé pour sortir des épreuves. · ['care']
- **google/gemini-3.8-flash**: EN: Patience is the key to relief. | FR: La patience est la clé de tout soulagement. · ['care']

### e16 — كبرتي ومازال كتعاندي بحال باباك ملي كان صغير!  
_kberti w mazal kat3andi b7al babak mli kan sghir!_ · gold: _You've grown up but you're still as stubborn as your dad was when he was little!_

- **openai/gpt-6-luna**: EN: You've grown up, but you're still as stubborn as your dad was when he was little! | FR: Tu as grandi, mais tu es toujours aussi têtue que ton père quand il était petit ! · ['humor']
- **google/gemini-3.8-flash**: EN: You've grown up and you're still just as stubborn as your dad was when he was little! | FR: Tu as grandi et tu es toujours aussi têtue, exactement comme ton père quand il était petit ! · ['humor', 'love']

### e17 — بلا بيك العيد ما عندو بنة.  
_bla bik l3id ma 3ndo benna._ · gold: _Without you, Eid just isn't the same._

- **openai/gpt-6-luna**: EN: Eid just isn’t the same without you. | FR: Sans toi, l’Aïd n’a pas la même joie. · ['longing', 'love']
- **google/gemini-3.8-flash**: EN: Without you, the holiday just doesn't feel the same. | FR: Sans toi, la fête n'a aucune saveur. · ['longing', 'love']

### e18 — الله يرضي عليك ويجعل البركة فيك.  
_lah yrdi 3lik w yj3el lbaraka fik._ · gold: _God bless you and fill your life with blessings._

- **openai/gpt-6-luna**: EN: May God bless you and make you a source of blessing. | FR: Que Dieu te bénisse et fasse de toi une source de bénédictions. · ['blessing']
- **google/gemini-3.8-flash**: EN: May God bless you and fill your life with blessings and grace. | FR: Que Dieu te bénisse et comble ta vie de Sa grâce. · ['blessing', 'love']

### e19 — بسلامة أوليدي، الله يوصلك على خير.  
_bslama a wlidi, lah ywesslek 3la khir._ · gold: _Goodbye my boy, have a safe trip._

- **openai/gpt-6-luna**: EN: Goodbye, my boy. May God get you there safely. | FR: Bonne route, mon garçon. Que Dieu te mène à bon port. · ['love', 'blessing']
- **google/gemini-3.8-flash**: EN: Goodbye my boy, may God get you there safe and sound. | FR: Au revoir mon garçon, que Dieu te fasse arriver sain et sauf. · ['care', 'blessing']

### e20 — واش باقي كتشرب أتاي بزاف؟ رد بالك من السكر.  
_wach ba9i katchrb atay bzaf? rdd balek mn ssokkar._ · gold: _Are you still drinking lots of tea? Watch out for the sugar._

- **openai/gpt-6-luna**: EN: Are you still drinking a lot of tea? Watch out for the sugar. | FR: Tu bois toujours autant de thé ? Fais attention au sucre. · ['care']
- **google/gemini-3.8-flash**: EN: Are you still drinking so much tea? Watch out for the sugar. | FR: Tu bois toujours autant de thé ? Fais attention au sucre. · ['care']