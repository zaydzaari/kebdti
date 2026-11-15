# Round 1 — translation screen

| Model | JSON ok | Errors | Literal traps hit | Feeling match | Added feeling (neutral msgs) | Darija markers / MSA markers (x→Darija) | Median latency (s) | Cost (USD) |
|---|---|---|---|---|---|---|---|---|
| `deepseek/deepseek-v4.1-flash` | 14/14 | 0 | 5 | 13/14 | 0/2 | 10 / 0 | 6.32 | 0.00441 |
| `qwen/qwen3.8-flash` | 14/14 | 0 | 4 | 14/14 | 0/2 | 16 / 0 | 10.95 | 0.00447 |
| `z-ai/glm-5.3-flash` | 14/14 | 0 | 3 | 14/14 | 0/2 | 15 / 0 | 6.21 | 0.00151 |
| `minimax/minimax-m3.1-flash` | 14/14 | 0 | 3 | 12/14 | 1/2 | 11 / 0 | 3.79 | 0.00260 |
| `xiaomi/mimo-v2.6-flash` | 14/14 | 0 | 5 | 14/14 | 0/2 | 10 / 0 | 10.28 | 0.00139 |
| `z-ai/glm-4.7-flash-free` | 9/14 | 5 | 4 | 9/14 | 1/2 | 0 / 0 | 39.23 | 0.00377 |
| `openai/gpt-6-luna` | 14/14 | 0 | 0 | 13/14 | 0/2 | 13 / 0 | 3.75 | 0.00196 |
| `anthropic/claude-haiku-5.5` | 14/14 | 0 | 3 | 14/14 | 0/2 | 17 / 0 | 3.42 | 0.00340 |
| `gemini-3.6-flash` | 13/14 | 1 | 4 | 13/14 | 1/2 | 14 / 0 | 4.22 | 0.00000 |
| `gemini-3.5-flash-lite` | 11/14 | 3 | 2 | 11/14 | 1/2 | 9 / 0 | 2.3 | 0.00000 |
| `gemma-4-31b-it` | 7/14 | 6 | 3 | 7/14 | 0/2 | 15 / 0 | 37.26 | 0.00000 |

**Total ZenMux cost:** $0.0235 (Gemini via AI Studio free tier not counted)


## Side-by-side outputs


### s01 — يا كبدتي، إمتى غادي تجي؟ الله يرضي عليك أوليدي.

Gold meaning: _My darling, when are you coming? God bless you, my dear boy._ · gold feeling: ['love', 'longing', 'blessing']

- **deepseek/deepseek-v4.1-flash** [love, longing, blessing]
  - EN: My darling, when will you come? May God be pleased with you, my child.
  - FR: Mon cœur, quand est-ce que tu vas venir ? Que Dieu te bénisse, mon enfant.
  - ES: Mi corazón, ¿cuándo vas a venir? Que Dios te bendiga, hijo mío.
  - IT: Cuore mio, quando verrai? Che Dio ti benedica, figlio mio.
  - notes: kebdti = A term of endearment like 'my darling' or 'my heart'.; lah yrdi 3lik = A loving blessing and expression of approval and affection.
- **qwen/qwen3.8-flash** [love, longing, blessing]
  - EN: My sweetheart, when are you coming? May God be pleased with you, my child.
  - FR: Mon cœur, quand est-ce que tu viens ? Que Dieu te garde, mon enfant.
  - ES: Mi corazón, ¿cuándo vienes? Que Dios te guarde, mi niño.
  - IT: Il mio cuore, quando vieni? Che Dio ti custodisca, figlio mio.
  - notes: kebdti = A Moroccan endearment — the liver is seen as the seat of love and emotion, so it means 'my most precious one'
- **z-ai/glm-5.3-flash** [love, longing, blessing]
  - EN: My little heart, when are you coming? May God be pleased with you, my child.
  - FR: Mon petit cœur, quand est-ce que tu viens ? Que Dieu soit satisfait de toi, mon enfant.
  - ES: Mi corazón, ¿cuándo vas a venir? Que Dios esté complacido contigo, hijo mío.
  - IT: Cuore mio, quando verrai? Che Dio sia compiaciuto di te, figlio mio.
  - notes: kebdti = a tender endearment in Moroccan Darija — the liver is seen as the seat of love and affection, like 'my darling' or 'my dear one'.; lah yrdi 3lik = a warm blessing expressing deep affection and gratitude toward someone.
- **minimax/minimax-m3.1-flash** [love, longing, blessing]
  - EN: My treasure, when will you come? May God be pleased with you, my child.
  - FR: Ma chérie, quand est-ce que tu viendras ? Que Dieu soit satisfait de toi, mon enfant.
  - ES: Mi tesoro, ¿cuándo vendrás? Que Dios esté complacido contigo, mi niña.
  - IT:  mia tesoro, quando verrai? Che Dio sia contento di te, mia bambina.
  - notes: يا كبدتي = An affectionate endearment meaning "my treasure" or "my dearest."; الله يرضي عليك = A traditional blessing expressing the wish that God blesses and protects someone.
- **xiaomi/mimo-v2.6-flash** [longing, love, blessing]
  - EN: My darling, when are you coming? May God be pleased with you, my child.
  - FR: Ma chérie, quand tu vas venir ? Que Dieu soit satisfait de toi, mon enfant.
  - ES: Mi vida, ¿cuándo vienes? Que Dios esté contento contigo, hijo mío.
  - IT: Tesoro mio, quando verrai? Che Dio sia contento di te, figlio mio.
  - notes: ya kebdti = my darling, term of endearment; lah yrdi 3lik = blessing expressing approval and affection
- **z-ai/glm-4.7-flash-free** [love, longing, blessing]
  - EN: My heart, when are you coming? May God bless you, my child.
  - FR: Mon cœur, quand est-ce que tu viens ? Que Dieu te bénisse, mon fils.
  - ES: Mi corazón, ¿cuándo vienes? Que Dios te bendiga, mi hijo.
  - IT: Mio cuore, quando vieni? Che Dio ti benedica, mio figlio.
  - notes: Kebda = A term of endearment for a very beloved person.; Allah yrdi 3lik = A traditional blessing meaning 'May God be pleased with you'.
- **openai/gpt-6-luna** [love, longing, blessing]
  - EN: My darling, when are you coming? May God bless you, my son.
  - FR: Mon chéri, quand est-ce que tu viens ? Que Dieu te bénisse, mon fils.
  - ES: Cariño, ¿cuándo vas a venir? Que Dios te bendiga, hijo mío.
  - IT: Tesoro, quando vieni? Che Dio ti benedica, figlio mio.
  - notes: a kebdti = a tender way to say “my darling” or “my dear”
- **anthropic/claude-haiku-5.5** [longing, love, blessing]
  - EN: My darling, when are you coming? May God bless you, my child.
  - FR: Mon cœur, quand est-ce que tu viens ? Que Dieu soit satisfait de toi, mon petit.
  - ES: Mi amor, ¿cuándo vienes? Que Dios te bendiga, mi niño.
  - IT: Amore mio, quando vieni? Che Dio ti benedica, figlio mio.
  - notes: kebdti = my darling, my dear one (a tender term of endearment); lah yrdi 3lik = a blessing, like 'God bless you'; a wlidi = my dear child, used affectionately for grandchildren of any gender
- **gemini-3.6-flash** [love, longing, blessing]
  - EN: My precious child, when are you coming to visit? May God bless you and always be pleased with you, my dear.
  - FR: Mon cœur, quand est-ce que tu viens me voir ? Que Dieu te bénisse et t'accorde Sa grâce, mon enfant.
  - ES: Mi vida, ¿cuándo vas a venir? Que Dios te bendiga y te acompañe siempre, hijo mío.
  - IT: Gioia mia, quando verrai a trovarmi? Che Dio ti benedica e ti protegga sempre, figlio mio.
  - notes: Kebdti (كبدتي) = An intense term of endearment for a child/grandchild, referring to them as one's own vital organ.; Lah yrdi 3lik (الله يرضي عليك) = A traditional parental blessing wishing divine favor, protection, and success upon a loved one.
- **gemini-3.5-flash-lite** [love, longing, blessing]
  - EN: My heart, when are you coming? God bless you, my boy.
  - FR: Mon cœur, quand est-ce que tu viens ? Que Dieu te bénisse, mon petit.
  - ES: Mi corazón, ¿cuándo vas a venir? Que Dios te bendiga, hijo mío.
  - IT: Vita mia, quando vieni? Che Dio ti benedica, figlio mio.
  - notes: a kebdti = my dearest, my heart (the liver is considered the seat of affection in Moroccan culture); lah yrdi 3lik = God bless you / may you have my parental blessing
- **gemma-4-31b-it**: ❌ Error code: 500

### s02 — الله يخليك ليا أبنتي.

Gold meaning: _I love you so much, my dear girl (I pray God keeps you in my life)._ · gold feeling: ['love', 'blessing']

- **deepseek/deepseek-v4.1-flash** [blessing, love, care]
  - EN: May God keep you for me, my daughter.
  - FR: Que Dieu te garde pour moi, ma fille.
  - ES: Que Dios te guarde para mí, hija mía.
  - IT: Che Dio ti conservi per me, figlia mia.
  - notes: lah ykhlik liya = A loving blessing: may God keep you safe and in my life.; a benti = An affectionate way an older person addresses a younger woman or girl, not always literally one's daughter.
- **qwen/qwen3.8-flash** [love, blessing, longing]
  - EN: May God keep you for me, my daughter.
  - FR: Que Dieu te garde pour moi, ma fille.
  - ES: Que Dios te conserve para mí, hija mía.
  - IT: Che Dio ti conservi per me, figlia mia.
  - notes: lah ykhlik liya = A common Moroccan prayer expressing deep love and the wish that the person stays alive and present in one's life.; benti = Grandparents use this as a term of endearment for grandchildren, regardless of the grandchild's actual gender.
- **z-ai/glm-5.3-flash** [love, blessing]
  - EN: May God keep you for me, my daughter.
  - FR: Que Dieu te garde pour moi, ma fille.
  - ES: Que Dios te conserve para mí, hija mía.
  - IT: Che Dio ti custodisca per me, figlia mia.
  - notes: lah ykhlik liya = A tender blessing expressing how precious the person is to the speaker.
- **minimax/minimax-m3.1-flash** [love, blessing]
  - EN: May God keep you for me, my daughter.
  - FR: Que Dieu te conserve pour moi, ma fille.
  - ES: Que Dios te conserve para mí, mi hija.
  - IT: Che Dio ti conservi per me, mia figlia.
  - notes: lah ykhlik liya = A warm prayer that God will preserve the beloved child and keep her close to the speaker.
- **xiaomi/mimo-v2.6-flash** [love, blessing]
  - EN: May God keep you for me, my daughter.
  - FR: Que Dieu te garde pour moi, ma fille.
  - ES: Que Dios te guarde para mí, hija.
  - IT: Che Dio ti conservi per me, figlia mia.
  - notes: lah ykhlik = may God protect you, preserve you — a tender blessing; benti = term of endearment for a granddaughter or a younger female relative
- **z-ai/glm-4.7-flash-free** [love, care, blessing]
  - EN: May God keep you for me, my daughter.
  - FR: Que Dieu te garde pour moi, ma chérie.
  - ES: Que Dios te guarde para mí, mi hija.
  - IT: Che Dio ti tenga per me, mia figlia.
  - notes: A benti = A common term of endearment used for a granddaughter or daughter.; Ykhlik = A standard prayer for protection and preservation.
- **openai/gpt-6-luna** [love, blessing]
  - EN: May God keep you safe and by my side, my daughter.
  - FR: Que Dieu te garde auprès de moi, ma fille.
  - ES: Que Dios te me cuide, hija mía.
  - IT: Che Dio ti protegga e ti tenga sempre con me, figlia mia.
  - notes: lah ykhlik liya = An affectionate blessing: may you stay safe and remain in my life.
- **anthropic/claude-haiku-5.5** [blessing, love]
  - EN: May God keep you for me, my dear daughter.
  - FR: Que Dieu te garde pour moi, ma fille.
  - ES: Que Dios te conserve para mí, hija mía.
  - IT: Che Dio ti protegga per me, figlia mia.
  - notes: الله يخليك ليا = A common blessing for long life and protection, said with tenderness. Grandparents use it to say they want the person to stay safe and near them for many years.; أبنتي (a benti) = An affectionate term used for a granddaughter or any dear young girl, not only one's own child.
- **gemini-3.6-flash** [love, blessing, care]
  - EN: May God protect you and keep you in my life, my dear daughter.
  - FR: Que Dieu te protège et te garde toujours auprès de moi, ma fille adorée.
  - ES: Que Dios te me cuide y te conserve siempre a mi lado, mi niña.
  - IT: Che Dio ti protegga e ti tenga sempre al mio fianco, figlia mia.
  - notes: Lah ykhlik liya = A loving prayer asking God to preserve your loved one's life and keep them near you.
- **gemini-3.5-flash-lite** [love, blessing]
  - EN: May God keep you for me, my daughter.
  - FR: Que Dieu te garde pour moi, ma fille.
  - ES: Que Dios te cuide para mí, hija mía.
  - IT: Che Dio ti custodisca per me, figlia mia.
- **gemma-4-31b-it** [love, blessing]
  - EN: May God keep you in my life, my sweet girl.
  - FR: Que Dieu te garde pour moi, ma chérie.
  - ES: Que Dios te guarde para mí, mi niña.
  - IT: Che Dio ti conservi per me, piccola mia.
  - notes: Lah ykhlik liya = A heartfelt prayer asking God to preserve the person and keep them safe and present in the speaker's life.

### s03 — واش كليتي مزيان؟ ما تبقاش تسهر بزاف.

Gold meaning: _Have you been eating well? Don't stay up too late._ · gold feeling: ['care', 'worry']

- **deepseek/deepseek-v4.1-flash** [care, worry]
  - EN: Did you eat well? Don't stay up too late.
  - FR: Tu as bien mangé ? Ne veille pas trop tard.
  - ES: ¿Has comido bien? No te quedes hasta muy tarde despierto/a.
  - IT: Hai mangiato bene? Non restare alzato fino a tardi.
- **qwen/qwen3.8-flash** [care, love]
  - EN: Did you eat well? Stop staying up so late.
  - FR: Tu as bien mangé ? Arrête de veiller si tard.
  - ES: ¿Comiste bien? Deja de trasnochar tanto.
  - IT: Hai mangiato bene? Non stare sveglio fino a tardi.
  - notes: wach kliti mzyan = In Moroccan culture, asking about food is the standard way to ask 'how are you?' — it's a general check-in on wellbeing, not just about the meal.
- **z-ai/glm-5.3-flash** [care, worry]
  - EN: Have you eaten well? Don't stay up too late.
  - FR: As-tu bien mangé ? Ne reste pas debout trop tard.
  - ES: ¿Has comido bien? No te quedes despierto hasta tan tarde.
  - IT: Hai mangiato bene? Non restare sveglio fino a tarda notte.
- **minimax/minimax-m3.1-flash** [care]
  - EN: Did you eat well? Don’t stay up too late.
  - FR: Tu as bien mangé ? Ne reste pas debout trop tard.
  - ES: ¿Has comido bien? No te quedes despierto hasta tarde.
  - IT: Hai mangiato bene? Non stare sveglio troppo tardi.
- **xiaomi/mimo-v2.6-flash** [care, worry, love]
  - EN: Did you eat well? And don't stay up too late, okay?
  - FR: Tu as bien mangé ? Et ne reste pas trop tard à la nuit, hein.
  - ES: ¿Comiste bien? No te quedes despierto/a tan tarde, ¿eh?
  - IT: Hai mangiato bene? E non restare sveglio/a fino a tardi, eh?
- **z-ai/glm-4.7-flash-free** [care, concern]
  - EN: How are you doing? Did you eat well? Don't stay up too late, you need your rest.
  - FR: Comment ça va ? As-tu bien mangé ? Ne reste pas tard le soir, tu as besoin de repos.
  - ES: ¿Cómo estás? ¿Has comido bien? No te quedes despierto hasta tarde, duérmete temprano.
  - IT: Come stai? Hai mangiato bene? Non restare sveglio troppo, vai a dormire presto.
  - notes: واش كليتي مزيان؟ = How are you? / Are you doing okay? (This is the standard way Moroccans greet each other).
- **openai/gpt-6-luna** [care]
  - EN: Did you eat well? Don’t stay up too late.
  - FR: Tu as bien mangé ? Ne veille pas trop tard.
  - ES: ¿Has comido bien? No te quedes despierto hasta muy tarde.
  - IT: Hai mangiato bene? Non fare troppo tardi.
- **anthropic/claude-haiku-5.5** [care, love]
  - EN: Have you eaten well, my love? Please don't stay up too late.
  - FR: Tu as bien mangé, mon cœur ? Ne veille pas trop tard, je t'en prie.
  - ES: ¿Has comido bien, mi amor? No te quedes despierto hasta tan tarde, por favor.
  - IT: Hai mangiato bene, tesoro mio? Non stare sveglio fino a tardi, ti prego.
- **gemini-3.6-flash** [care, worry]
  - EN: Have you eaten well, my dear? Please don't stay up so late.
  - FR: Tu as bien mangé, mon enfant ? Ne reste pas debout jusqu'à pas d'heure, s'il te plaît.
  - ES: ¿Has comido bien, mi vida? No te quedes despierto hasta tan tarde.
  - IT: Hai mangiato bene, tesoro mio? Non stare alzato fino a tardi.
- **gemini-3.5-flash-lite** [care, worry]
  - EN: Did you eat well, my dear? Don't stay up too late.
  - FR: Tu as bien mangé, mon cœur ? Ne veille pas trop tard, fais attention à toi.
  - ES: ¿Has comido bien, mi vida? No te quedes despierto hasta tan tarde.
  - IT: Hai mangiato bene, amore mio? Non fare tardi la notte.
- **gemma-4-31b-it** [care, love]
  - EN: Did you eat well, my dear? Don't stay up too late.
  - FR: Tu as bien mangé, mon chéri ? Ne veille pas trop tard.
  - ES: ¿Has comido bien, cariño? No te quedes despierto hasta muy tarde.
  - IT: Hai mangiato bene, tesoro? Non fare troppo tardi la notte.

### s04 — توحشتك بزاف، الدار خاوية بلا بيك.

Gold meaning: _I miss you so much, the house feels empty without you._ · gold feeling: ['longing', 'love']

- **deepseek/deepseek-v4.1-flash** [love, longing]
  - EN: I miss you so much, the house is empty without you.
  - FR: Tu me manques tellement, la maison est vide sans toi.
  - ES: Te extraño muchísimo, la casa está vacía sin ti.
  - IT: Mi manchi tantissimo, la casa è vuota senza di te.
- **qwen/qwen3.8-flash** [longing, love, care]
  - EN: I miss you so much, the house feels empty without you.
  - FR: Tu me manques tellement, la maison est vide sans toi.
  - ES: Te extraño muchísimo, la casa está vacía sin ti.
  - IT: Mi manchi tantissimo, la casa è vuota senza di te.
  - notes: ddar khawya bla bik = a common Moroccan way to express how deeply someone's absence is felt at home — the house is not literally empty, but emotionally so.
- **z-ai/glm-5.3-flash** [longing, love]
  - EN: I miss you so much, the house feels empty without you.
  - FR: Tu me manques beaucoup, la maison est vide sans toi.
  - ES: Te echo mucho de menos, la casa está vacía sin ti.
  - IT: Mi manchi molto, la casa è vuota senza di te.
- **minimax/minimax-m3.1-flash** [love, longing]
  - EN: I miss you so much. The house feels empty without you.
  - FR: Tu me manques tellement. La maison feels empty without toi.
  - ES: Te echo de menos. La casa se siente vacía sin ti.
  - IT: Mi manchi tantissimo. La casa sembra vuota senza di te.
  - notes: توحشتك = I miss you and long for your presence.; الدار خاوية بلا بيك = Life at home feels incomplete when you are not there.
- **xiaomi/mimo-v2.6-flash** [longing, love]
  - EN: I miss you so much — the house feels empty without you.
  - FR: Tu me manques terriblement, la maison est vide sans toi.
  - ES: Me haces mucha falta, la casa está vacía sin ti.
  - IT: Mi manchi tantissimo, la casa è vuota senza di te.
  - notes: ddar khawya bla bik = the home feels lifeless and lonely when you're away
- **z-ai/glm-4.7-flash-free** [longing, care, love]
  - EN: I missed you so much, sweetie. The house feels empty without you.
  - FR: Je t'ai manqué beaucoup, ma chérie. La maison est vide sans toi.
  - ES: Te he echado de menos mucho, mi vida. La casa está vacía sin ti.
  - IT: Ti sei molto mancata, tesoro. La casa è vuota senza di te.
  - notes: الدار خاوية بلا بيك = A common expression to express loneliness and the feeling that the home lacks warmth or life when the family member is absent.
- **openai/gpt-6-luna** [love, longing]
  - EN: I miss you so much; the house feels empty without you.
  - FR: Tu me manques tellement, la maison est vide sans toi.
  - ES: Te echo muchísimo de menos; la casa está vacía sin ti.
  - IT: Mi manchi tantissimo, la casa è vuota senza di te.
- **anthropic/claude-haiku-5.5** [longing, love]
  - EN: I miss you so much, my dear. The house feels empty without you.
  - FR: Tu me manques tellement, mon cœur. La maison est vide sans toi.
  - ES: Te extraño muchísimo, mi amor. La casa está vacía sin ti.
  - IT: Mi manchi tantissimo, tesoro mio. La casa è vuota senza di te.
- **gemini-3.6-flash** [longing, love]
  - EN: I miss you so much, my dear; the house feels completely empty without you.
  - FR: Tu me manques tellement, mon enfant ; la maison est toute vide sans toi.
  - ES: Te extraño muchísimo, mi vida; la casa está tan vacía sin ti.
  - IT: Mi manchi tantissimo, tesoro mio; la casa è così vuota senza di te.
  - notes: twe7chtek = I miss you deeply
- **gemini-3.5-flash-lite** [longing, love]
  - EN: I miss you so much, my dear. The house feels so empty without you.
  - FR: Tu me manques tellement, mon cœur. La maison est si vide sans toi.
  - ES: Te extraño muchísimo, mi vida. La casa se siente tan vacía sin ti.
  - IT: None
- **gemma-4-31b-it** [love, longing]
  - EN: I miss you so much, my dear. The house feels so empty without you.
  - FR: Tu me manques tellement, mon chéri. La maison est vide sans toi.
  - ES: Te extraño muchísimo, cielo. La casa se siente vacía sin ti.
  - IT: Mi manchi tantissimo, tesoro. La casa è vuota senza di te.
  - notes: ddar khawya = a way to express that a loved one's absence is deeply felt and the home lacks joy without them

### s05 — الله يحفظك وينجحك فقرايتك.

Gold meaning: _May God protect you and help you succeed in your studies._ · gold feeling: ['blessing', 'care']

- **deepseek/deepseek-v4.1-flash** [blessing, care, love]
  - EN: May God protect you and make you succeed in your studies.
  - FR: Que Dieu te protège et te fasse réussir dans tes études.
  - ES: Que Dios te proteja y te haga triunfar en tus estudios.
  - IT: Che Dio ti protegga e ti faccia riuscire nei tuoi studi.
- **qwen/qwen3.8-flash** [blessing, care, love]
  - EN: May God protect you and grant you success in your studies, my dear.
  - FR: Que Dieu te protège et te donne la réussite dans tes études, mon cœur.
  - ES: Que Dios te guarde y te haga triunfar en tus estudios, mi vida.
  - IT: Che Dio ti protegga e ti dia successo nei tuoi studi, tesoro mio.
  - notes: lah y7fdek = A very common Moroccan prayer/blessing (du3a) used by elders; it carries deep affection and is almost always paired with a wish for success.
- **z-ai/glm-5.3-flash** [blessing, love]
  - EN: May God protect you and help you succeed in your studies.
  - FR: Que Dieu te protège et te fasse réussir dans tes études.
  - ES: Que Dios te proteja y te haga triunfar en tus estudios.
  - IT: Che Dio ti protegga e ti faccia avere successo negli studi.
- **minimax/minimax-m3.1-flash** [care, blessing]
  - EN: May God protect you and help you succeed in your studies.
  - FR: Que Dieu te protège et te fasse réussir dans tes études.
  - ES: Que Dios te proteja y te haga tener éxito en tus estudios.
  - IT: Che Dio ti protegga e ti faccia riuscire negli studi.
- **xiaomi/mimo-v2.6-flash** [blessing, love, care]
  - EN: May God watch over you and help you succeed in your studies, my dear.
  - FR: Que Dieu te protège et te fasse réussir dans tes études, mon chéri.
  - ES: Que Dios te proteja y te haga triunfar en tus estudios, mi vida.
  - IT: Che Dio ti protegga e ti faccia riuscire nei tuoi studi, tesoro mio.
- **z-ai/glm-4.7-flash-free** [blessing, care, pride]
  - EN: May God keep you safe and help you succeed in your studies, my dear.
  - FR: Que Dieu te protège et te bénisse dans tes études, ma chérie.
  - ES: Que Dios te guarde a salvo y te dé éxito en tus estudios, mi cielo.
  - IT: Che Dio ti protegga e ti dia successo nei tuoi studi, tesoro.
  - notes: Allah y7fdek = A standard protective blessing wishing safety and health.
- **openai/gpt-6-luna** [blessing, care]
  - EN: May God protect you and help you succeed in your studies.
  - FR: Que Dieu te protège et t’aide à réussir tes études.
  - ES: Que Dios te proteja y te ayude a tener éxito en tus estudios.
  - IT: Che Dio ti protegga e ti aiuti ad avere successo negli studi.
- **anthropic/claude-haiku-5.5** [blessing, love]
  - EN: May God keep you safe and help you succeed in your studies.
  - FR: Que Dieu te protège et te fasse réussir dans tes études.
  - ES: Que Dios te cuide y te haga triunfar en tus estudios.
  - IT: Che Dio ti protegga e ti faccia riuscire negli studi.
- **gemini-3.6-flash** [blessing, love, care]
  - EN: May God protect you and grant you success in your studies, my dear.
  - FR: Que Dieu te protège et te fasse réussir dans tes études, mon enfant.
  - ES: Que Dios te proteja y te dé mucho éxito en tus estudios, mi vida.
  - IT: Che Dio ti protegga e ti faccia riuscire nei tuoi studi, tesoro mio.
- **gemini-3.5-flash-lite** [blessing, care]
  - EN: May God protect you and help you succeed in your studies.
  - FR: Que Dieu te protège et te réussisse dans tes études.
  - ES: Que Dios te proteja y te dé éxito en tus estudios.
  - IT: Che Dio ti protegga e ti faccia avere successo nei tuoi studi.
  - notes: Lah y7fdek = A common blessing used to express love, safety, and protection.
- **gemma-4-31b-it** [blessing, love, care]
  - EN: May God protect you and grant you success in your studies, my dear.
  - FR: Que Dieu te protège et t'accorde la réussite dans tes études, mon enfant.
  - ES: Que Dios te proteja y te dé éxito en tus estudios, cariño.
  - IT: Che Dio ti protegga e ti faccia avere successo nei tuoi studi, tesoro.
  - notes: Allah yahfdek = A common blessing used to express deep love and a wish for the person's safety and well-being.

### s06 — خالك عيط اليوم، كيسلم عليك.

Gold meaning: _Your uncle called today, he says hi._ · gold feeling: ['neutral']

- **deepseek/deepseek-v4.1-flash** [neutral]
  - EN: Your maternal uncle called today; he sends you his greetings.
  - FR: Ton oncle maternel a appelé aujourd’hui, il te passe le bonjour.
  - ES: Tu tío materno llamó hoy, te manda saludos.
  - IT: Tuo zio materno ha chiamato oggi, ti manda i saluti.
- **qwen/qwen3.8-flash** [neutral]
  - EN: Your uncle called today, he sends his regards.
  - FR: Ton oncle a appelé aujourd'hui, il t'envoie ses salutations.
  - ES: Tu tío llamó hoy, te manda saludos.
  - IT: Tuo zio ha chiamato oggi, ti manda i saluti.
- **z-ai/glm-5.3-flash** [neutral]
  - EN: Your uncle (mother's side) called today, he sends you his greetings.
  - FR: Ton oncle (côté maternel) a appelé aujourd'hui, il te passe le bonjour.
  - ES: Tu tío (lado materno) llamó hoy, te manda saludos.
  - IT: Tuo zio (lato materno) ha chiamato oggi, ti manda i suoi saluti.
- **minimax/minimax-m3.1-flash** [care, blessing]
  - EN: You seem sad today. May God keep you safe.
  - FR: Tu sembles triste aujourd’hui. Que Dieu te protège.
  - ES: Hoy pareces triste. Que Dios te proteja.
  - IT: Oggi sembri triste. Che Dio ti protegga.
  - notes: خالك عيط = you seem sad or upset; كيسلم عليك = a blessing wishing someone safety and well-being
- **xiaomi/mimo-v2.6-flash** [neutral]
  - EN: Your uncle called today — he sends his greetings.
  - FR: Ton oncle a appelé aujourd'hui, il t'envoie ses salutations.
  - ES: Tu tío llamó hoy y te manda saludos.
  - IT: Tuo zio ha chiamato oggi e ti manda i suoi saluti.
- **z-ai/glm-4.7-flash-free**: ❌ Error code: 429 - 该模型当前访问量过大，请您稍后再试 (request_id: c539f55aa1c443babfd07fc35a152037)
- **openai/gpt-6-luna** [neutral]
  - EN: Your uncle called today; he sends his regards.
  - FR: Ton oncle a appelé aujourd’hui, il te passe le bonjour.
  - ES: Tu tío llamó hoy, te manda saludos.
  - IT: Tuo zio ha chiamato oggi, ti manda i saluti.
- **anthropic/claude-haiku-5.5** [neutral]
  - EN: Your uncle called today, he sends you his greetings.
  - FR: Ton oncle a appelé aujourd'hui, il te salue.
  - ES: Tu tío llamó hoy, te manda saludos.
  - IT: Tuo zio ha chiamato oggi, ti saluta.
- **gemini-3.6-flash** [neutral, care]
  - EN: Your uncle called today, he sends you his warmest greetings.
  - FR: Ton oncle maternel a appelé aujourd'hui, il te passe son grand bonjour.
  - ES: Tu tío materno llamó hoy, te manda muchos saludos.
  - IT: Tuo zio materno ha chiamato oggi, ti manda un caro saluto.
  - notes: kaysllem 3lik = He sends his regards / says hello
- **gemini-3.5-flash-lite** [neutral]
  - EN: Your uncle called today, he says hello.
  - FR: Ton oncle a appelé aujourd'hui, il te passe le bonjour.
  - ES: Tu tío llamó hoy, te manda saludos.
  - IT: Tuo zio ha chiamato oggi, ti saluta.
- **gemma-4-31b-it**: ❌ Error code: 500

### s07 — الشتا طاحت اليوم بزاف، الحمد لله.

Gold meaning: _It rained a lot today, thank God._ · gold feeling: ['neutral', 'gratitude']

- **deepseek/deepseek-v4.1-flash** [gratitude, neutral]
  - EN: It rained a lot today, thank God.
  - FR: Il a beaucoup plu aujourd’hui, Dieu merci.
  - ES: Hoy ha llovido mucho, gracias a Dios.
  - IT: Oggi ha piovuto molto, grazie a Dio.
  - notes: l7amdulillah = thank God; a common expression of gratitude or acceptance
- **qwen/qwen3.8-flash** [neutral, gratitude]
  - EN: It rained a lot today, thank God.
  - FR: Il a beaucoup plu aujourd'hui, Dieu merci.
  - ES: Hoy ha llovido mucho, gracias a Dios.
  - IT: Oggi ha piovuto molto, grazie a Dio.
  - notes: l7amdulillah = A very common expression of gratitude in Moroccan daily life, used naturally after mentioning something good
- **z-ai/glm-5.3-flash** [gratitude, neutral]
  - EN: It rained a lot today, thank God.
  - FR: Il a beaucoup plu aujourd'hui, Dieu merci.
  - ES: Hoy ha llovido mucho, gracias a Dios.
  - IT: Oggi è piovuto molto, grazie a Dio.
  - notes: l7amdulillah = A common expression of gratitude or contentment, said for good news
- **minimax/minimax-m3.1-flash** [gratitude, neutral]
  - EN: It rained a lot today, thank God.
  - FR: Il a beaucoup plu aujourd’hui, merci à Dieu.
  - ES: Hoy ha llovido mucho, gracias a Dios.
  - IT: Oggi ha piovuto molto, grazie a Dio.
  - notes: Alhamdulillah (l7amdulillah) = A way of saying thank God or expressing gratitude and relief.
- **xiaomi/mimo-v2.6-flash** [gratitude, neutral]
  - EN: It rained a lot today, thank God.
  - FR: Il est tombé beaucoup de pluie aujourd'hui, Dieu soit loué.
  - ES: Hoy ha llovido mucho, gracias a Dios.
  - IT: Oggi è piovuto tanto, grazie a Dio.
  - notes: l7amdulillah = thank God / alhamdulillah
- **z-ai/glm-4.7-flash-free** [neutral, care]
  - EN: It's very cold today, thank God.
  - FR: Il fait très froid aujourd'hui, merci Dieu.
  - ES: Hace mucho frío hoy, gracias a Dios.
  - IT: Fa molto freddo oggi, grazie a Dio.
  - notes: Chta = Winter / The cold season.
- **openai/gpt-6-luna** [gratitude]
  - EN: It rained a lot today, thank goodness.
  - FR: Il a beaucoup plu aujourd’hui, Dieu merci.
  - ES: Hoy ha llovido muchísimo, gracias a Dios.
  - IT: Oggi è piovuto tantissimo, grazie a Dio.
  - notes: l7amdulillah = Thank God; an expression of gratitude or relief.
- **anthropic/claude-haiku-5.5** [gratitude, neutral]
  - EN: It rained a lot today, thank God.
  - FR: Il a beaucoup plu aujourd'hui, Dieu merci.
  - ES: Hoy ha llovido mucho, gracias a Dios.
  - IT: Oggi ha piovuto tanto, grazie a Dio.
  - notes: chta ta7t = it rained (in Morocco, 'chta' means both winter and rain)
- **gemini-3.6-flash** [gratitude, neutral]
  - EN: It rained a lot today, thank God.
  - FR: Il a beaucoup plu aujourd'hui, dieu soit loué.
  - ES: Ha llovido mucho hoy, gracias a Dios.
  - IT: Ha piovuto molto oggi, sia ringraziato Dio.
  - notes: l7amdulillah = An expression of gratitude and relief used frequently in daily life.
- **gemini-3.5-flash-lite** [care, gratitude]
  - EN: It rained a lot today, thank God.
  - FR: Il a beaucoup plu aujourd'hui, Dieu merci.
  - ES: Ha llovido mucho hoy, gracias a Dios.
  - IT: Ha piovuto molto oggi, grazie a Dio.
- **gemma-4-31b-it**: ❌ Error code: 500

### s08 — اللي بغا العسل يصبر لقريص النحل.

Gold meaning: _If you want the honey, you have to put up with the bee stings (no pain, no gain)._ · gold feeling: ['care']

- **deepseek/deepseek-v4.1-flash** [neutral]
  - EN: Whoever wants honey must endure the bees' stings.
  - FR: Celui qui veut le miel doit supporter les piqûres des abeilles.
  - ES: Quien quiera miel debe soportar las picaduras de las abejas.
  - IT: Chi vuole il miele deve sopportare le punture delle api.
  - notes: lli bgha l3sel ysber l9ris n7el = If you want something good, you must endure the difficulties and patience it requires.
- **qwen/qwen3.8-flash** [care, love]
  - EN: My dear, you can't have the honey without the bee stings.
  - FR: Mon cœur, qui veut le miel doit accepter les piqûres des abeilles.
  - ES: Hijo mío, quien quiere miel debe aguantar las picaduras de las abejas.
  - IT: Tesoro mio, chi vuole il miele deve sopportare le punture delle api.
  - notes: lli bgha l3sel ysber l9ris n7el = A proverb teaching that worthwhile rewards require patience through hardship — a grandmother's gentle way of saying 'no pain, no gain.'
- **z-ai/glm-5.3-flash** [pride, care]
  - EN: If you want the honey, you have to put up with the bee stings.
  - FR: Celui qui veut le miel doit supporter les piqûres d'abeilles.
  - ES: El que quiere la miel debe aguantar los picotazos de abeja.
  - IT: Chi vuole il miele deve sopportare le punture d'ape.
  - notes: lli bgha l3sel ysber l9ris n7el = Good things require patience and enduring hardship; a proverb encouraging perseverance.
- **minimax/minimax-m3.1-flash** [neutral]
  - EN: “Those who want honey must endure the bees’ stings.”
  - FR: « Qui veut le miel doit supporter les piqûres d’abeilles. »
  - ES: « Quien quiere miel debe aguantar las picaduras de abejas. »
  - IT: « Chi vuole il miele deve sopportare le punture delle api. »
  - notes: اللي بغا العسل يصبر لقريص النحل = A Moroccan proverb meaning that achieving something worthwhile requires tolerating hardship.
- **xiaomi/mimo-v2.6-flash** [care, blessing]
  - EN: If you want the honey, you have to bear the bee's sting, my dear. If you want something good, be patient — even if it stings a little along the way.
  - FR: Qui veut de la miel doit supporter la piqûre de l'abeille, ma chérie. Si tu désires quelque chose de beau, il faut avoir un peu de patience, même si ça pique en chemin.
  - ES: Quien quiere la miel debe aguantar la picadura de la abeja, mi vida. Si quieres algo bueno, ten paciencia, aunque por el camino a veces pique.
  - IT: Chi vuole il miele deve sopportare il pungiglione dell'ape, tesoro mio. Se desideri qualcosa di bello, abbi un po' di pazienza, anche se lungo la strada a volte punge.
  - notes: lli bgha l3sel ysber l9ris n7el = If you want something valuable, you must accept the hardship that comes with it.
- **z-ai/glm-4.7-flash-free** [care, pride]
  - EN: My love, patience is key. As the saying goes, whoever wants honey must wait for the hive.
  - FR: Mon petit, patience, patience... comme on dit, le miel se gagne avec patience.
  - ES: Mi vida, la paciencia es clave. Para tener miel, hay que esperar a la colmena.
  - IT: Tesoro, la pazienza è tutto. Per avere il miele bisogna aspettare l'alveare.
  - notes: lli bgha l3sel ysber l9ris n7el = Good things take time and patience; you have to work for what you want.
- **openai/gpt-6-luna** [neutral]
  - EN: If you want the honey, you have to put up with the bee stings.
  - FR: Qui veut le miel doit accepter les piqûres d’abeilles.
  - ES: Quien quiere miel tiene que soportar las picaduras de las abejas.
  - IT: Chi vuole il miele deve sopportare le punture delle api.
  - notes: lli bgha l3sel ysber l9ris n7el = Good things often require patience and a willingness to face difficulties.
- **anthropic/claude-haiku-5.5** [care]
  - EN: Whoever wants the honey must put up with the bee stings.
  - FR: Celui qui veut le miel doit supporter la piqûre des abeilles.
  - ES: Quien quiere la miel tiene que aguantar la picadura de las abejas.
  - IT: Chi vuole il miele deve sopportare la puntura delle api.
  - notes: lli bgha l3sel ysber l9ris n7el = Good things in life usually come with some effort or hardship. A proverb used to encourage someone to be patient through difficulties.
- **gemini-3.6-flash** [care]
  - EN: If you want the sweet honey, my child, you have to put up with a few bee stings. Good things take patience and effort!
  - FR: Qui veut du miel doit supporter la piqûre des abeilles, mon enfant. Tout ce qui est doux demande un peu de patience !
  - ES: Quien quiere miel, mi vida, tiene que aguantar las picaduras de abeja. ¡Las cosas buenas requieren esfuerzo!
  - IT: Chi vuole il miele, tesoro mio, deve sopportare le punture delle api. Le cose belle richiedono pazienza!
  - notes: Lli bgha l3sel ysber l9ris n7el = To achieve a sweet reward or success in life, you must be willing to endure hard work or difficulties.
- **gemini-3.5-flash-lite** [care, pride]
  - EN: Whoever wants honey must endure the bees' stings. Nothing worthwhile comes without patience and hard work, my little one.
  - FR: Celui qui veut du miel doit endurer les piqûres d'abeilles, mon enfant. Rien de grand ne s'obtient sans effort.
  - ES: El que quiere miel, que aguante las picaduras de las abejas. Todo lo bueno cuesta esfuerzo, mi vida.
  - IT: Chi vuole il miele deve sopportare le punture delle api. Nulla si ottiene senza sacrificio, tesoro.
  - notes: lli bgha l3sel ysber l9ris n7el = No pain, no gain; success requires patience and enduring hardships.
- **gemma-4-31b-it**: ❌ invalid JSON

### s09 — وليتي طويل بحال النخلة، ولكن مازال ما عرفتيش تطيب!

Gold meaning: _You've grown as tall as a palm tree, but you still don't know how to cook!_ · gold feeling: ['humor', 'love']

- **deepseek/deepseek-v4.1-flash** [humor, love]
  - EN: You've grown tall like a palm tree, but you still don't know how to cook!
  - FR: Tu es devenu grand comme un palmier, mais tu ne sais toujours pas cuisiner !
  - ES: Te has hecho alto como una palmera, pero todavía no sabes cocinar.
  - IT: Sei diventato alto come una palma, ma non sai ancora cucinare!
  - notes: wlliti twil b7al nkhla = an affectionate, teasing comment on how much the grandchild has grown
- **qwen/qwen3.8-flash** [pride, humor, love]
  - EN: You've grown tall like a palm tree, but you still don't know how to cook!
  - FR: Tu as grandi comme un palmier, mais tu ne sais toujours pas cuisiner !
  - ES: ¡Has crecido como una palmera, pero todavía no sabes cocinar!
  - IT: Sei cresciuto come una palma, ma non sai ancora cucinare!
  - notes: b7al nkhla = A very common Moroccan comparison for someone who has grown tall; palm trees are iconic in Morocco and used affectionately to describe stature
- **z-ai/glm-5.3-flash** [humor, love]
  - EN: You've grown tall as a palm tree, but you still don't know how to cook!
  - FR: Tu as grandi grand comme un palmier, mais tu ne sais toujours pas cuisiner !
  - ES: Has crecido alto como una palmera, ¡pero todavía no sabes cocinar!
  - IT: Sei cresciuto alto come una palma, ma ancora non sai cucinare!
  - notes: twil b7al nkhla, walakin mazal ma 3reftich ttiyeb = A playful teasing proverb said to grown-up young people: you're an adult now, but you still lack basic domestic skills.
- **minimax/minimax-m3.1-flash** [humor, love]
  - EN: You’ve become as tall as a palm tree, but you still haven’t learned how to cook!
  - FR: Tu es devenu aussi grand qu’un palmier, mais tu n’as toujours pas appris à cuisiner !
  - ES: Te has vuelto tan alto como una palmera, ¡pero todavía no has aprendido a cocinar!
  - IT: Sei diventato alto come una palma, ma non hai ancora imparato a cucinare!
  - notes: b7al nkhla = very tall; a playful way to describe someone’s height
- **xiaomi/mimo-v2.6-flash** [humor, love, pride]
  - EN: You've grown tall as a date palm, but you still don't know how to cook!
  - FR: Tu es devenue aussi haute qu'un palmier dattier, mais tu ne sais toujours pas cuisiner !
  - ES: Te has hecho alta como una palmera datilera, ¡pero todavía no sabes cocinar!
  - IT: Sei cresciuta alta come una palma da datteri, ma ancora non sai cucinare!
  - notes: twil b7al nkhla = a warm Moroccan way of saying a grandchild has grown up big and tall
- **z-ai/glm-4.7-flash-free** [care, humor, love]
  - EN: May you be tall like a palm tree, my darling, but you still don't know how to mature!
  - FR: Que tu sois grand comme un palmier, mon cœur, mais tu n'as pas encore mûri !
  - ES: Que seas alto como una palmera, mi amor, pero todavía no has madurado.
  - IT: Che tu sia alto come una palma, mio tesoro, ma ancora non sei maturo!
  - notes: b7al nkhla = Tall, strong, or enduring (often used to describe height).; ttiyeb = To mature, to become sensible or ready for adulthood.
- **openai/gpt-6-luna** [humor, love]
  - EN: You’ve grown as tall as a palm tree, but you still haven’t learned to cook!
  - FR: Tu es devenue grande comme un palmier, mais tu ne sais toujours pas cuisiner !
  - ES: Te has puesto alta como una palmera, ¡pero todavía no sabes cocinar!
  - IT: Sei diventata alta come una palma, ma ancora non sai cucinare!
- **anthropic/claude-haiku-5.5** [love, humor, pride]
  - EN: You've grown as tall as a palm tree, but you still don't know how to cook!
  - FR: Tu as grandi, tu es devenue grande comme un palmier, mais tu ne sais toujours pas cuisiner !
  - ES: Has crecido alta como una palmera, ¡pero todavía no sabes cocinar!
  - IT: Sei cresciuta alta come una palma, ma ancora non sai cucinare!
- **gemini-3.6-flash** [humor, love]
  - EN: Look at you, grown as tall as a palm tree, but you still haven't learned how to cook!
  - FR: Regarde-toi, grand comme un palmier, mais tu ne sais toujours pas cuisiner !
  - ES: ¡Te has puesto tan alto como una palmera, pero todavía no sabes cocinar!
  - IT: Sei diventato alto come una palma, ma ancora non sai cucinare!
  - notes: twil b7al nkhla = A affectionate Moroccan idiom used to tease someone who has grown very tall.
- **gemini-3.5-flash-lite** [humor, love]
  - EN: You've grown as tall as a palm tree, but you still don't know how to cook!
  - FR: Tu as grandi comme un palmier, mais tu ne sais toujours pas cuisiner !
  - ES: ¡Te has vuelto alto como una palmera, pero todavía no sabes cocinar!
  - IT: Sei diventato alto come una palma, ma non sai ancora cucinare!
  - notes: twil b7al nkhla = very tall
- **gemma-4-31b-it**: ❌ Error code: 500

### s10 — يا عينيا، نتا اللي عندي فهاد الدنيا.

Gold meaning: _My dear, you mean everything to me in this world._ · gold feeling: ['love']

- **deepseek/deepseek-v4.1-flash** [love, care]
  - EN: Oh, my darling, you are all I have in this world.
  - FR: Oh mon trésor, tu es tout ce que j’ai en ce monde.
  - ES: Ay, mi cielo, tú eres lo único que tengo en este mundo.
  - IT: Oh, luce dei miei occhi, sei tutto quello che ho al mondo.
  - notes: a 3iniya = A loving endearment like 'my darling' or 'my dear'.
- **qwen/qwen3.8-flash** [love, longing, care]
  - EN: My darling, you are all I have in this world.
  - FR: Ma prunelle, toi seul tu es tout ce que j'ai dans ce monde.
  - ES: Mis ojitos, tú eres lo único que tengo en este mundo.
  - IT: I miei occhi, tu sei tutto quello che ho al mondo.
  - notes: ya 3iniya = A common Moroccan endearment from grandparents, expressing that the person is as precious as one's own eyes.
- **z-ai/glm-5.3-flash** [love, longing]
  - EN: My darling, you are all I have in this world.
  - FR: Mon trésor, tu es tout ce que j'ai dans ce monde.
  - ES: Mi tesoro, eres todo lo que tengo en este mundo.
  - IT: Tesoro mio, sei tutto ciò che ho in questo mondo.
  - notes: a 3iniya = a tender endearment, like 'my darling' or 'my precious one'
- **minimax/minimax-m3.1-flash** [love]
  - EN: My dear, you are the one I treasure most in this world.
  - FR: Mon cher, tu es la personne la plus importante de ma vie.
  - ES: Mi querido, tú eres lo que más tengo en esta vida.
  - IT: Mio caro, sei tu la persona che ho al mondo.
  - notes: يا عينيا = An affectionate way of saying "my dear" or "my precious one."
- **xiaomi/mimo-v2.6-flash** [love]
  - EN: My darling, you are everything I have in this world.
  - FR: Mon cœur, tu es toute ma vie dans ce monde.
  - ES: Cariño mío, tú eres todo lo que tengo en este mundo.
  - IT: Tesoro mio, sei tutto ciò che ho in questo mondo.
  - notes: a 3iniya = term of endearment, 'my darling'
- **z-ai/glm-4.7-flash-free** [love, care]
  - EN: Oh my darling, you are my everything in this life.
  - FR: Ma chérie, tu es mon tout dans cette vie.
  - ES: Mi cielo, eres mi todo en esta vida.
  - IT: Tesoro mio, sei il mio tutto in questo mondo.
  - notes: يا عينيا = A term of endearment meaning 'Oh my dear' or 'Oh my darling'.
- **openai/gpt-6-luna** [love]
  - EN: My darling, you’re all I have in this world.
  - FR: Mon chéri, tu es tout ce que j’ai au monde.
  - ES: Cariño, eres todo lo que tengo en este mundo.
  - IT: Tesoro mio, sei tutto quello che ho al mondo.
  - notes: a 3iniya = a tender term of endearment, like “my darling”
- **anthropic/claude-haiku-5.5** [love, care]
  - EN: My darling, you are all I have in this world.
  - FR: Mon cœur, toi, tu es tout ce que j'ai en ce monde.
  - ES: Mi amor, tú eres lo único que tengo en este mundo.
  - IT: Amore mio, tu sei tutto ciò che ho in questo mondo.
  - notes: a 3iniya = my dear, my darling (a tender term of endearment)
- **gemini-3.6-flash** [love, care]
  - EN: Oh light of my eyes, you are all I have in this world.
  - FR: Oh la prunelle de mes yeux, tu es tout ce que j'ai au monde.
  - ES: Oh mis ojos, tú eres todo lo que tengo en este mundo.
  - IT: Pupilla dei miei occhi, sei tutto ciò che ho a questo mondo.
  - notes: a 3iniya = An endearment meaning 'light of my eyes' or 'my dearest one', used to show deep affection.
- **gemini-3.5-flash-lite**: ❌ Error code: 503
- **gemma-4-31b-it**: ❌ Error code: 500

### r01 — Mamie, tu me manques tellement. Je viens cet été, promis !

Gold meaning: _Grandma, I miss you so much. I'm coming this summer, I promise!_ · gold feeling: ['longing', 'love']

- **deepseek/deepseek-v4.1-flash** [longing, love]: آ جدّة، توحّشتك بزاف. غادي نجي هاد الصيف، وعد!  
  _a jdda, twa7echtek bzaf. ghadi nji had s-sif, wa3d!_
- **qwen/qwen3.8-flash** [longing, love]: أ جدة، وحشتيني بزاف. غادي نجي هاد الصيف، والله!  
  _A jdda, we7chtni bzzaf. Ghadi nji had sif, wallah!_
- **z-ai/glm-5.3-flash** [longing, love]: يا جدتي، كنحشك بزاف. غانجي هاد الصيف، وعد!  
  _a jddti, kanechouq lik bezzaf. ghanchi had ssif, w3dt!_
- **minimax/minimax-m3.1-flash** [longing, love]: أ جدة، كنشتاق ليك بزاف. غادي نجي هاد الصيف، ووعد!  
  _A jdda, knchtaq lik bzzaf. Ghadi nji had l-3tof, wa3d!_
- **xiaomi/mimo-v2.6-flash** [love, longing]: أ جدتي، تيحمرتي عليّا بزّاف. غادي نجي في هاد الصيف، بالله!  
  _A jddti, ti7merti 3lia bzzaf. Ghadi nji f seif hadi, bllah!_
- **z-ai/glm-4.7-flash-free**: ❌ Error code: 429 - You have reached the usage limit for the current free model. Please try again later, or use a different model. For details, see: https://zenmux.ai/pricing/pay-as-you-go (request_id: b662f93d459842cba14a650c12bd3410)
- **openai/gpt-6-luna** [longing, love]: آ جدّة، توحشتك بزاف. غادي نجي هاد الصيف، وعدتك!  
  _A jdda, twa7chtk bzzaf. Ghadi nji had sif, wa3dtk!_
- **anthropic/claude-haiku-5.5** [longing, love]: يا ماما الكبيرة، والله كنتي وحشتيني بزاف. غادي نجي هاد الصيف، وعد!  
  _Ya mama lkbira, wallah kont wa7acha bzaf. Ghadi nji had sseyf, wa3d!_
- **gemini-3.6-flash** [longing, love]: أ جّدة، توحشتك بزاف. غادي نجي عندك هاد الصيف، كنوعدك!  
  _A jdda, twa7achtek bzaf. Gadi nji 3andek had ṣ-ṣif, kanwa3dek!_
- **gemini-3.5-flash-lite** [longing, love]: أ جديتي، توحشتك بزاف بزاف. واعدك، غادي نجي هاد الصيف!  
  _A jdditi, twa7shtk bzaf bzaf. Wa3dk, ghadi nji had ssif!_
- **gemma-4-31b-it** [love, longing]: أ جدة، توحشتك بزاف. غادي نجي هاد الصيف، والله!  
  _A jdda, twahachtek bezaf. Ghadi nji had sif, wallah!_

### r02 — Abuela, te quiero mucho. ¿Cómo estás de salud? Tómate tus medicinas.

Gold meaning: _Grandma, I love you so much. How is your health? Take your medicine._ · gold feeling: ['love', 'care']

- **deepseek/deepseek-v4.1-flash** [love, care, worry]: يا جدّة، كنبغيك بزاف. كيفاش صحتك؟ خودي دواك.  
  _ya jdda, kanbghik bzaf. kifach si7tek? khodi dwak._
- **qwen/qwen3.8-flash** [love, care, worry]: أ جدة، نبغيك بزاف. كيفاش نتا؟ لابس عليك؟ خودي الدوا ديالك.  
  _a jdda, nbghik bezzaf. kifach nta? labas 3lik? khoudi dawa dyalek._
- **z-ai/glm-5.3-flash** [love, care]: أ جدة، كنبغيك بزاف. كيفاش راك فالصحة؟ كلي الدوا ديالك.  
  _a jdda, kanbghik bzaf. kifash raki f sa77a? kuli dwa dyalek._
- **minimax/minimax-m3.1-flash** [love, care, worry]: a jdda, ktar bzaf mni 3jebek. kif l-ṣa7ṭa dyalek? khod les liḥab dyalek, 3afak.  
  _a jdda, ktar bzaf mni 3jebek. kif l-sa7ta dyalek? khod les lihab dyalek, 3afak._
- **xiaomi/mimo-v2.6-flash** [love, care]: يا جدتي، كنبغيك بزاف. كيفاش كاينة فالصح؟ خدي دواياتك ديالك مزيان.  
  _Ya jddti, kanbghik bzzaf. Kifach kayna f l-s7a7? Khi dywwayatik dialik mzyan._
- **z-ai/glm-4.7-flash-free**: ❌ Error code: 429 - You have reached the usage limit for the current free model. Please try again later, or use a different model. For details, see: https://zenmux.ai/pricing/pay-as-you-go (request_id: bad9392ed60941008cc8ebdeb4470aca)
- **openai/gpt-6-luna** [love, care]: آ جدتي، كنبغيك بزاف. كيف دايرة مع صحتك؟ خدي دواك.  
  _A jddati, kanbghik بزaf. Kif dayra m3a se77tek? Khdi dwak._
- **anthropic/claude-haiku-5.5** [love, care]: يا جدتي، كنحبك بزاف. واش راك بخير فالصحة؟ خدي الدوا ديالك.  
  _Ya jdati, kanhebbek bzaf. Wash rak bikhir fsa7a? Khdi d-dwa dyalek._
- **gemini-3.6-flash** [love, care]: أ جّدة، كنبغيك بزاف. كيف دايرة صحتك؟ شربي الدوا ديالك.  
  _A jdda, kanbghik bzzaf. Kif dayra se7tek? Shorbi dwa dyalek._
- **gemini-3.5-flash-lite** [love, longing, care]: أ جدي، كنبغيك بزاف. كيف راكي مع الصحة؟ عافاك شربي الدوا ديالك.  
  _A jdda, kanbghik bzzaf. Kif raki m3a sseḥa? 3afak šrbi d-dwa dyalk._
- **gemma-4-31b-it** [love, care]: أ جدة، كنبغيك بزاف. كيدايرة مع صحتك؟ شربي دوا ديالك.  
  _A jdda, kanbghik bezzaf. Kidayra m3a sa7tek? Shrebi dwa dyalek._

### r03 — Nonna, ho passato l'esame! Grazie per tutte le tue preghiere.

Gold meaning: _Grandma, I passed the exam! Thank you for all your prayers._ · gold feeling: ['pride', 'gratitude']

- **deepseek/deepseek-v4.1-flash** [love, gratitude, blessing]: أ جدّة، نجحت ف الامتحان! شكرا على الدعوات ديالك كلها.  
  _A jdda, nja7t f l'imti7an! Chokran 3la do3awat dyalk kollha._
- **qwen/qwen3.8-flash** [pride, gratitude, love]: أ جدة، عديت الامتحان بنجاح! الله يخليك ليا على الدعوات ديالك.  
  _a jdda, 3dani l-examen b-naja7! Allah ykhellek liya 3la d-da3at dyalek._
- **z-ai/glm-5.3-flash** [gratitude, love, pride]: يا جدتي، نجحت في الامتحان! شكرا على جميع الدعوات ديالك.  
  _a jddti, nja7t f l'imtihan! shokran 3la ga3 d3awat dyalek._
- **minimax/minimax-m3.1-flash** [love, gratitude, pride]: A jdda, darijat l’exam! Tanmerni 3la kol chi r’2iya li kdubiyti.  
  _A jdda, darijat l’exam! Tanmerni 3la kol chi r’2iya li kdubiyti._
- **xiaomi/mimo-v2.6-flash** [gratitude, pride, love]: يا جدّتي، نجحت فالامتحان! شكراً على كل دعيواتك ليا.  
  _A jdda, n7t forte l-emtihan! Chokran 3la kol dou3awatek liya._
- **z-ai/glm-4.7-flash-free**: ❌ Error code: 429 - You have reached the usage limit for the current free model. Please try again later, or use a different model. For details, see: https://zenmux.ai/pricing/pay-as-you-go (request_id: f405598b38cc4b018bf99643b0258fd9)
- **openai/gpt-6-luna** [gratitude, pride]: آ جدتي، نجحت فالامتحان! شكراً على كاع الدعوات ديالك.  
  _A jddati, nje7t f l-imti7an! Shukran 3la ga3 d-de3wat dyalek._
- **anthropic/claude-haiku-5.5** [pride, gratitude, love]: يا جدتي، نجحت فالامتحان! شكرا بزاف على الدعوات ديالك.  
  _Ya jeddati, njit f l-imtiḥan! Shukran bzzaf 3la d-d3awat dyalek._
- **gemini-3.6-flash** [gratitude, love]: أ جدة، نجحت فالامتحان! شكرا بزاف على الدعوات ديالك كاملين.  
  _A jdda, nja7t f l-imti7an! Shukran bzzaf 3la d-da3awat dyalek kamlin._
- **gemini-3.5-flash-lite**: ❌ Error code: 429
- **gemma-4-31b-it**: ❌ Error code: 500

### r04 — Grandma, I got into university! I really miss your couscous.

Gold meaning: _Grandma, I got into university! I really miss your couscous._ · gold feeling: ['pride', 'longing']

- **deepseek/deepseek-v4.1-flash** [pride, love, longing]: أ جدّة، قبلوني ف الجامعة! توحشت كسكسوك بزاف.  
  _a jdda, qebloni f ljam3a! twa7acht ksksok bzaf._
- **qwen/qwen3.8-flash** [pride, longing, love]: أ جدّا، قبلوني ف الجامعة! شقيت للكسكس ديالك بزّاف  
  _a jdda, qblouni f l'université! shqit l couscous dyalek bzzaf_
- **z-ai/glm-5.3-flash** [pride, love, longing]: يا جدّتي، تقبّلت في الجامعة! والله كنشتاق لكسكس ديالك بزاف.  
  _a jddti, tqebbelt f l-jami3a! wallah kanchtaq l-kseksu dyalek bezzaf._
- **minimax/minimax-m3.1-flash** [pride, longing, love]: أ جدة، دخلت ديالي الجامعة! كتخورني بزاف على الكسكس ديالك. كنبا على راسك وكت清楚地 فرحانة بيا.  
  _A jdda, dkholt dyali l-jami3a! Katkhorni bzzaf 3la l-koskos dyalek. Ktebba 3la rsasek w kat7det frhana bia._
- **xiaomi/mimo-v2.6-flash** [pride, love, longing]: يا جدتي، دخلت الجامعة! بشوق كبير لكسكوس ديالك.  
  _Ya jiddti, dkhalt l-jam3a! B-chouou kbir lkskous dyalek._
- **z-ai/glm-4.7-flash-free**: ❌ Error code: 429 - You have reached the usage limit for the current free model. Please try again later, or use a different model. For details, see: https://zenmux.ai/pricing/pay-as-you-go (request_id: afa71d18d6f04afab9438693061298b8)
- **openai/gpt-6-luna** [pride, longing]: آ جْدّاتي، تقبلت فالجامعة! توحشت بزاف الكسكس ديالك.  
  _A jddati, t9belt f ljam3a! Twa7echt bzzaf lksksou dyalek._
- **anthropic/claude-haiku-5.5** [pride, longing, love]: جدتي، لقيت القبول فالجامعة! والله مشتاق ليك، وكنفكر فالكسكس ديالك بزاف.  
  _Jdati, lqit lqbol f jami3a! Wallah mchtaq lik, w kan fakker f lkskas dyalek bzaf._
- **gemini-3.6-flash**: ❌ Error code: 429
- **gemini-3.5-flash-lite**: ❌ Error code: 429
- **gemma-4-31b-it** [love, pride, longing]: أ حنينتي، راني تقبلت في الجامعة! توحشت بزاف الكسكسو ديالك.  
  _A hninati, rani tqbelt f l-jami3a! Twahacht bzaf l-ksksou dyalk._