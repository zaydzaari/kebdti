# Round 2 — top models × 3 systems

Literal-trap items: 9 (in glossary: 5, not in glossary: 4). Neutral items: 3.

| Model | System | JSON ok | Literal traps hit (glossary / unseen) | Feeling match | Added feeling on neutral msgs | Median latency (s) | Cost (USD) |
|---|---|---|---|---|---|---|---|
| `openai/gpt-6-luna` | plain | 20/20 | 3 / 0 | — | — | 3.46 | 0.0019 |
| `openai/gpt-6-luna` | kebdti | 20/20 | 2 / 0 | 19/20 | 0/3 | 4.16 | 0.0031 |
| `openai/gpt-6-luna` | kebdti_gloss | 20/20 | 0 / 0 | 18/20 | 0/3 | 4.38 | 0.0036 |
| `deepseek/deepseek-v4.1-flash` | plain | 20/20 | 3 / 1 | — | — | 4.69 | 0.0043 |
| `deepseek/deepseek-v4.1-flash` | kebdti | 20/20 | 2 / 0 | 18/20 | 1/3 | 5.8 | 0.0077 |
| `deepseek/deepseek-v4.1-flash` | kebdti_gloss | 20/20 | 2 / 0 | 19/20 | 0/3 | 6.18 | 0.0069 |
| `google/gemini-3.8-flash` | plain | 20/20 | 2 / 0 | — | — | 9.33 | 0.0718 |
| `google/gemini-3.8-flash` | kebdti | 20/20 | 1 / 0 | 19/20 | 2/3 | 4.03 | 0.0420 |
| `google/gemini-3.8-flash` | kebdti_gloss | 20/20 | 1 / 0 | 19/20 | 2/3 | 5.85 | 0.0472 |
| `gemini-3.6-flash` | plain | 2/20 | 0 / 0 | — | — | 3.95 | 0.0000 |
| `gemini-3.6-flash` | kebdti | 4/20 | 0 / 0 | 4/4 | 0/3 | 3.31 | 0.0000 |
| `gemini-3.6-flash` | kebdti_gloss | 2/20 | 0 / 0 | 2/2 | 0/3 | 3.79 | 0.0000 |

**Total ZenMux cost:** $0.1965

## Side by side (EN / FR), plain vs kebdti_gloss


### e01 [glossary] — تبارك الله عليك أوليدي، وليتي راجل!  
_tbarkallah 3lik a wlidi, wlliti rajel!_ · gold: _Look at you, my boy, you've become a man! (proud)_ · gender: m

- **openai/gpt-6-luna** · plain: EN: God bless you, my son, you've become a man! | FR: Bravo à toi, mon fils, tu es devenu un homme !
- **openai/gpt-6-luna** · kebdti_gloss: EN: Well done, my boy—you've become a man! | FR: Bravo, mon fils, tu es devenu un homme !
- **deepseek/deepseek-v4.1-flash** · plain: EN: May God bless you, my son, you've become a man! | FR: Que Dieu te bénisse, mon fils, tu es devenu un homme !
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: Well done my boy, you've become a man! | FR: Bravo mon garçon, tu es devenu un homme !
- **google/gemini-3.8-flash** · plain: EN: God bless you my son, you've become a man! | FR: Que Dieu te bénisse mon fils, tu es devenu un homme !
- **google/gemini-3.8-flash** · kebdti_gloss: EN: God bless you my boy, look at you, you’ve become such a fine young man! | FR: Que Dieu te préserve mon garçon, regarde quel grand homme tu es devenu !
- **gemini-3.6-flash** · plain: EN: God bless you my son, you've become a man! | FR: Bravo mon fils, tu es devenu un homme !
- **gemini-3.6-flash** · kebdti_gloss: EN: God bless you my boy, look at you, you've grown into a real man! | FR: Que Dieu te bénisse mon garçon, tu es devenu un vrai grand homme !

### e02 [glossary] — الله يرحم والديك، جبتي ليا الدوا.  
_lah yr7em walidik, jbti liya dwa._ · gold: _Thank you so much for bringing me my medicine._ · gender: ?

- **openai/gpt-6-luna** · plain: EN: May God have mercy on your parents; you brought me the medicine. | FR: Que Dieu ait tes parents en Sa miséricorde, tu m’as apporté le médicament.
- **openai/gpt-6-luna** · kebdti_gloss: EN: Thank you so much for bringing me the medicine. | FR: Merci infiniment, tu m’as apporté les médicaments.
- **deepseek/deepseek-v4.1-flash** · plain: EN: May God have mercy on your parents, you brought me the medicine. | FR: Que Dieu fasse miséricorde à tes parents, tu m'as apporté le médicament.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: Thank you so much, you brought me the medicine. | FR: Merci beaucoup, tu m'as apporté le médicament.
- **google/gemini-3.8-flash** · plain: EN: May God bless your parents, did you bring me the medicine? | FR: Que Dieu bénisse tes parents, m'as-tu apporté le médicament ?
- **google/gemini-3.8-flash** · kebdti_gloss: EN: Thank you so much, you brought me my medicine. | FR: Merci infiniment, tu m'as apporté mes médicaments.
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e03 [unseen] — على سلامتك أبنتي، الحمد لله وصلتي بخير.  
_3la slamtek a benti, l7amdulillah wselti bkhir._ · gold: _Welcome back safe and sound, my girl, thank God you arrived safely._ · gender: f

- **openai/gpt-6-luna** · plain: EN: I’m glad you arrived safely, my daughter. Thank God. | FR: Contente que tu sois arrivée saine et sauve, ma fille. Dieu merci.
- **openai/gpt-6-luna** · kebdti_gloss: EN: I’m glad you made it safely, my daughter. Thank God, you arrived safe and sound. | FR: Contente que tu sois bien arrivée, ma fille. Dieu merci, tu es arrivée sans encombre.
- **deepseek/deepseek-v4.1-flash** · plain: EN: Welcome back, my daughter; thank God you arrived safely. | FR: Bon retour, ma fille, Dieu merci tu es arrivée saine et sauve.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: Welcome back, my girl — thank God you arrived safely. | FR: Bienvenue ma fille, Dieu merci tu es bien arrivée.
- **google/gemini-3.8-flash** · plain: EN: Praise God for your safe arrival, my daughter. Thank God you arrived safely. | FR: Dieu merci pour ton heureuse arrivée, ma fille. Dieu soit loué, tu es bien arrivée.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: Welcome back safe and sound, my dear girl. Thank God you arrived well. | FR: Bienvenue ma fille, Dieu merci tu es bien arrivée saine et sauve.
- **gemini-3.6-flash** · plain: EN: Welcome back, my daughter! Thank God you arrived safely. | FR: Dieu soit loué pour ton retour ma fille, Dieu merci tu es bien arrivée.
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e04 [unseen] — سير الله يعاونك، وما تنساش تعيط لمك.  
_sir lah y3awnek, w ma tnsach t3iyet l mmok._ · gold: _Go on, good luck, and don't forget to call your mom._ · gender: m

- **openai/gpt-6-luna** · plain: EN: Go on, may God help you, and don’t forget to call your mother. | FR: Vas-y, que Dieu t’aide, et n’oublie pas d’appeler ta mère.
- **openai/gpt-6-luna** · kebdti_gloss: EN: Go on, may God help you, and don't forget to call your mother. | FR: Vas-y, que Dieu t'aide, et n'oublie pas d'appeler ta mère.
- **deepseek/deepseek-v4.1-flash** · plain: EN: Go, may God help you, and don't forget to call your mother. | FR: Va, que Dieu t'aide, et n'oublie pas d'appeler ta mère.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: Go, may God help you, and don't forget to call your mother. | FR: Vas-y, que Dieu t'aide, et n'oublie pas d'appeler ta mère.
- **google/gemini-3.8-flash** · plain: EN: Go, may God help you, and don't forget to call your mother. | FR: Vas-y, que Dieu t'aide, et n'oublie pas d'appeler ta mère.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: Go on, may God help you, and don't forget to call your mother. | FR: Vas-y, que Dieu t'aide, et n'oublie pas d'appeler ta mère.
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e05 [glossary] — يا كبدتي، شحال كبرتي! الله يحفظك.  
_a kebdti, ch7al kberti! lah y7fdek._ · gold: _My darling, how much you've grown! God protect you._ · gender: ?

- **openai/gpt-6-luna** · plain: EN: Oh, my darling, how you've grown! May God protect you. | FR: Ma chérie, comme tu as grandi ! Que Dieu te protège.
- **openai/gpt-6-luna** · kebdti_gloss: EN: My darling, you’ve grown so much! May God protect you. | FR: Ma chérie, comme tu as grandi ! Que Dieu te protège.
- **deepseek/deepseek-v4.1-flash** · plain: EN: Oh my dear, how you've grown! May God protect you. | FR: Ô mon cœur, comme tu as grandi ! Que Dieu te protège.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: Oh my darling, how you've grown! May God protect you. | FR: Oh ma chérie, comme tu as grandi ! Que Dieu te protège.
- **google/gemini-3.8-flash** · plain: EN: My darling, you have grown so much! May God protect you. | FR: Mon trésor, comme tu as grandi ! Que Dieu te protège.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: My sweetheart, look how much you've grown! God protect you. | FR: Mon cœur, comme tu as grandi ! Que Dieu te protège.
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e06 [glossary] — الله يسهل عليك فالخدمة الجديدة أ عينيا.  
_lah ysehhel 3lik f lkhedma jdida a 3iniya._ · gold: _Good luck with your new job, my dear._ · gender: ?

- **openai/gpt-6-luna** · plain: EN: May God make things easy for you in your new job, sweetheart. | FR: Que Dieu te facilite les choses dans ton nouveau travail, ma chérie.
- **openai/gpt-6-luna** · kebdti_gloss: EN: Good luck in your new job, my dear. | FR: Bonne chance dans ton nouveau travail, mon cœur.
- **deepseek/deepseek-v4.1-flash** · plain: EN: May God make it easy for you in the new job, my eyes. | FR: Que Dieu te facilite dans ton nouveau travail, mes yeux.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: May God make things easy for you in your new job, my dear. | FR: Que Dieu te facilite les choses dans ton nouveau travail, mon trésor.
- **google/gemini-3.8-flash** · plain: EN: May God make things easy for you in your new job, my love. | FR: Que Dieu te facilite la tâche dans ton nouveau travail, mon cœur.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: May God grant you success in your new job, my darling. | FR: Que Dieu te facilite les choses dans ton nouveau travail, ma prunelle.
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e07 [unseen] — الله يعطيك ما تمنيتي فهاد العام.  
_lah y3tik ma tmennity f had l3am._ · gold: _May you get everything you wish for this year._ · gender: ?

- **openai/gpt-6-luna** · plain: EN: May God grant you everything you wished for this year. | FR: Que Dieu t’accorde tout ce que tu as souhaité cette année.
- **openai/gpt-6-luna** · kebdti_gloss: EN: May God grant you everything you wish for this year. | FR: Que Dieu t’accorde tout ce que tu souhaites cette année.
- **deepseek/deepseek-v4.1-flash** · plain: EN: May God give you what you wished for this year. | FR: Qu'Allah te donne ce que tu as souhaité cette année.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: May God give you what you wished for this year. | FR: Que Dieu t’accorde ce que tu as souhaité cette année.
- **google/gemini-3.8-flash** · plain: EN: May God grant you everything you wish for this year. | FR: Que Dieu t'accorde tout ce que tu souhaites en cette année.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: May God grant you everything your heart wishes for this year. | FR: Que Dieu t'accorde tout ce que ton cœur désire en cette nouvelle année.
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e08 [unseen] — الماكلة واجدة، جيو تاكلو.  
_lmakla wajda, jiw taklo._ · gold: _Food's ready, come and eat._ · gender: pl

- **openai/gpt-6-luna** · plain: EN: The food is ready, come eat. | FR: Le repas est prêt, venez manger.
- **openai/gpt-6-luna** · kebdti_gloss: EN: The food is ready, come eat. | FR: Le repas est prêt, venez manger.
- **deepseek/deepseek-v4.1-flash** · plain: EN: The food is ready, come eat. | FR: La nourriture est prête, venez manger.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: The food is ready, come and eat. | FR: Le repas est prêt, venez manger.
- **google/gemini-3.8-flash** · plain: EN: The food is ready, come eat. | FR: La nourriture est prête, venez manger.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: Food's ready, come and eat! | FR: Le repas est prêt, venez manger !
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e09 [unseen] — الضو قطع البارح ورجع هاد الصباح.  
_ddaw qta3 lbare7 w rje3 had sbah._ · gold: _The power went out yesterday and came back this morning._ · gender: ?

- **openai/gpt-6-luna** · plain: EN: The power went out yesterday and came back this morning. | FR: L’électricité a été coupée hier et est revenue ce matin.
- **openai/gpt-6-luna** · kebdti_gloss: EN: The power went out yesterday and came back this morning. | FR: Le courant a été coupé hier et est revenu ce matin.
- **deepseek/deepseek-v4.1-flash** · plain: EN: The power went out yesterday and came back this morning. | FR: L'électricité a été coupée hier et est revenue ce matin.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: The electricity went out yesterday and came back this morning. | FR: L'électricité a été coupée hier et est revenue ce matin.
- **google/gemini-3.8-flash** · plain: EN: The power went out yesterday and came back this morning. | FR: L'électricité s'est coupée hier et est revenue ce matin.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: The power went out yesterday and came back this morning. | FR: Le courant s'est coupé hier soir et est revenu ce matin.
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e10 [unseen] — شريت حولي العيد، كبير ومزيان.  
_chrit 7awli l3id, kbir w mzyan._ · gold: _I bought the sheep for Eid, it's big and nice._ · gender: ?

- **openai/gpt-6-luna** · plain: EN: I bought a big, handsome sheep for Eid. | FR: J’ai acheté un mouton pour l’Aïd, grand et beau.
- **openai/gpt-6-luna** · kebdti_gloss: EN: I bought the Eid ram. It’s big and handsome. | FR: J’ai acheté le mouton pour l’Aïd, il est grand et beau.
- **deepseek/deepseek-v4.1-flash** · plain: EN: I bought a yearling for Eid, big and nice. | FR: J'ai acheté un agneau d'un an pour l'Aïd, grand et beau.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: I bought the Eid ram, big and good. | FR: J'ai acheté le mouton de l'Aïd, grand et beau.
- **google/gemini-3.8-flash** · plain: EN: I bought the Eid sheep, big and nice. | FR: J'ai acheté le mouton de l'Aïd, grand et beau.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: I bought the ram for Eid, it's big and beautiful. | FR: J'ai acheté le mouton pour l'Aïd, il est grand et magnifique.
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: EN: I bought the sheep for Eid, it's big and great. | FR: J'ai acheté le mouton pour l'Aïd, il est grand et très beau.

### e11 [unseen] — راسي كيضرني شوية ولكن لاباس، ما تخلعش.  
_rasi kaydorni chwiya walakin labas, ma tkhla3ch._ · gold: _I have a bit of a headache but I'm fine, don't worry._ · gender: m

- **openai/gpt-6-luna** · plain: EN: My head hurts a little, but I'm okay. Don't worry. | FR: J'ai un peu mal à la tête, mais ça va. Ne t'inquiète pas.
- **openai/gpt-6-luna** · kebdti_gloss: EN: I have a bit of a headache, but I’m okay. Don’t worry. | FR: J’ai un peu mal à la tête, mais ça va. Ne t’inquiète pas.
- **deepseek/deepseek-v4.1-flash** · plain: EN: My head hurts a little but it's okay, don't worry. | FR: J'ai un peu mal à la tête mais ça va, ne t'inquiète pas.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: My head hurts a little, but I'm okay, don't worry. | FR: J'ai un peu mal à la tête, mais ça va, ne t'inquiète pas.
- **google/gemini-3.8-flash** · plain: EN: I have a bit of a headache, but I'm fine, don't worry. | FR: J'ai un peu mal à la tête mais ça va, ne t'inquiète pas.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: My head hurts a little bit, but I'm alright, don't worry. | FR: J'ai un peu mal à la tête mais ça va, ne t'inquiète pas.
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e12 [unseen] — نتا ضو عينيا.  
_nta daw 3iniya._ · gold: _You're the light of my eyes (you mean everything to me)._ · gender: m

- **openai/gpt-6-luna** · plain: EN: You are the light of my eyes. | FR: Tu es la lumière de mes yeux.
- **openai/gpt-6-luna** · kebdti_gloss: EN: You’re the light of my eyes. | FR: Tu es la prunelle de mes yeux.
- **deepseek/deepseek-v4.1-flash** · plain: EN: You are the light of my eyes. | FR: Tu es la lumière de mes yeux.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: You are the light of my eyes. | FR: Tu es la lumière de mes yeux.
- **google/gemini-3.8-flash** · plain: EN: You are the light of my eyes. | FR: Tu es la lumière de mes yeux.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: You are the apple of my eye, my boy. | FR: Tu es la lumière de mes yeux, mon chéri.
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e13 [unseen] — قلبي معاك فالامتحان، ربي يكون معاك.  
_qelbi m3ak f limti7an, rebbi ykoun m3ak._ · gold: _I'm with you with all my heart for your exam, may God be with you._ · gender: m

- **openai/gpt-6-luna** · plain: EN: My heart is with you during the exam. May God be with you. | FR: Je suis de tout cœur avec toi pour l’examen. Que Dieu soit avec toi.
- **openai/gpt-6-luna** · kebdti_gloss: EN: My heart is with you for your exam. May God be with you. | FR: Je suis de tout cœur avec toi pour ton examen. Que Dieu soit avec toi.
- **deepseek/deepseek-v4.1-flash** · plain: EN: My heart is with you during the exam, may God be with you. | FR: Mon cœur est avec toi pour l’examen, que Dieu soit avec toi.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: My heart is with you in the exam, may God be with you. | FR: Mon cœur est avec toi pour l’examen, que Dieu soit avec toi.
- **google/gemini-3.8-flash** · plain: EN: My heart is with you for the exam, may God be with you. | FR: Mon cœur est avec toi pour l'examen, que Dieu soit avec toi.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: My heart is with you for your exam, may God be with you. | FR: Tout mon cœur est avec toi pour ton examen, que Dieu soit avec toi.
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e14 [unseen] — اللي فات مات.  
_lli fat mat._ · gold: _What's past is past, let it go._ · gender: ?

- **openai/gpt-6-luna** · plain: EN: Let bygones be bygones. | FR: Le passé, c’est du passé.
- **openai/gpt-6-luna** · kebdti_gloss: EN: What's done is done. | FR: Ce qui est passé est passé.
- **deepseek/deepseek-v4.1-flash** · plain: EN: What's past is dead. | FR: Ce qui est passé est mort.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: What's past is past. | FR: Ce qui est passé est passé.
- **google/gemini-3.8-flash** · plain: EN: The past is in the past. | FR: Le passé est le passé.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: What's in the past is in the past, let it go. | FR: Ce qui est passé est passé, n'y pense plus.
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e15 [unseen] — الصبر مفتاح الفرج.  
_sber mefta7 lfaraj._ · gold: _Patience is the key to relief (things will get better)._ · gender: ?

- **openai/gpt-6-luna** · plain: EN: Patience is the key to relief. | FR: La patience est la clé du soulagement.
- **openai/gpt-6-luna** · kebdti_gloss: EN: Patience is the key to better days. | FR: La patience est la clé des jours meilleurs.
- **deepseek/deepseek-v4.1-flash** · plain: EN: Patience is the key to relief. | FR: La patience est la clé du soulagement.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: Patience is the key to relief. | FR: La patience est la clé du soulagement.
- **google/gemini-3.8-flash** · plain: EN: Patience is the key to relief. | FR: La patience est la clé de la délivrance.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: Patience is the key to relief. | FR: La patience est la clé de tout soulagement.
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e16 [unseen] — كبرتي ومازال كتعاندي بحال باباك ملي كان صغير!  
_kberti w mazal kat3andi b7al babak mli kan sghir!_ · gold: _You've grown up but you're still as stubborn as your dad was when he was little!_ · gender: f

- **openai/gpt-6-luna** · plain: EN: You’ve grown up and you’re still as stubborn as your dad was when he was little! | FR: Tu as grandi et tu t’entêtes toujours comme ton père quand il était petit !
- **openai/gpt-6-luna** · kebdti_gloss: EN: You've grown up, but you're still as stubborn as your dad was when he was little! | FR: Tu as grandi, mais tu es toujours aussi têtue que ton père quand il était petit !
- **deepseek/deepseek-v4.1-flash** · plain: EN: You've grown up and you're still stubborn like your father when he was young! | FR: Tu as grandi et tu es encore têtue comme ton père quand il était jeune !
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: You've grown up and you're still as stubborn as your father was when he was little! | FR: Tu as grandi et tu es toujours aussi têtue que ton père quand il était petit !
- **google/gemini-3.8-flash** · plain: EN: You've grown up and you're still as stubborn as your dad when he was little! | FR: Tu as grandi et tu es toujours aussi têtue que ton père quand il était petit !
- **google/gemini-3.8-flash** · kebdti_gloss: EN: You've grown up and you're still just as stubborn as your dad was when he was little! | FR: Tu as grandi et tu es toujours aussi têtue, tout comme ton père quand il était petit !
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e17 [unseen] — بلا بيك العيد ما عندو بنة.  
_bla bik l3id ma 3ndo benna._ · gold: _Without you, Eid just isn't the same._ · gender: ?

- **openai/gpt-6-luna** · plain: EN: Without you, Eid just isn’t the same. | FR: Sans toi, l’Aïd n’a pas la même saveur.
- **openai/gpt-6-luna** · kebdti_gloss: EN: Eid just doesn’t feel the same without you. | FR: Sans toi, l’Aïd n’a pas la même saveur.
- **deepseek/deepseek-v4.1-flash** · plain: EN: Without you, Eid has no taste. | FR: Sans toi, l'Aïd n'a pas de goût.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: Without you, Eid has no taste. | FR: Sans toi, l'Aïd n'a pas de goût.
- **google/gemini-3.8-flash** · plain: EN: Without you, Eid has no flavor. | FR: Sans toi, l'Aïd n'a aucune saveur.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: Without you, the holiday just doesn't feel the same. | FR: Sans toi, la fête n'a aucune saveur.
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e18 [glossary] — الله يرضي عليك ويجعل البركة فيك.  
_lah yrdi 3lik w yj3el lbaraka fik._ · gold: _God bless you and fill your life with blessings._ · gender: ?

- **openai/gpt-6-luna** · plain: EN: May God reward you and bless you. | FR: Que Dieu te récompense et mette sa bénédiction en toi.
- **openai/gpt-6-luna** · kebdti_gloss: EN: May God bless you and fill you with blessings. | FR: Que Dieu te bénisse et mette Sa baraka en toi.
- **deepseek/deepseek-v4.1-flash** · plain: EN: May God be pleased with you and put blessing in you. | FR: Que Dieu soit satisfait de toi et mette la bénédiction en toi.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: May God be pleased with you and place blessing in you. | FR: Que Dieu soit satisfait de toi et mette la bénédiction en toi.
- **google/gemini-3.8-flash** · plain: EN: May God be pleased with you and put His blessing in you. | FR: Que Dieu soit satisfait de toi et mette Sa bénédiction en toi.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: May God bless you and bring abundance and grace into your life. | FR: Que Dieu te bénisse et comble ta vie de bienfaits.
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e19 [unseen] — بسلامة أوليدي، الله يوصلك على خير.  
_bslama a wlidi, lah ywesslek 3la khir._ · gold: _Goodbye my boy, have a safe trip._ · gender: m

- **openai/gpt-6-luna** · plain: EN: Safe travels, my son. May God get you there safely. | FR: Bon voyage, mon fils. Que Dieu te fasse arriver à bon port.
- **openai/gpt-6-luna** · kebdti_gloss: EN: Goodbye, my son. May God see you safely to your destination. | FR: Au revoir, mon fils. Que Dieu te fasse arriver à bon port.
- **deepseek/deepseek-v4.1-flash** · plain: EN: Goodbye my son, may God bring you safely. | FR: Au revoir mon fils, que Dieu te conduise sain et sauf.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: Goodbye, my boy, may God bring you safely there. | FR: Au revoir mon garçon, que Dieu te fasse arriver sain et sauf.
- **google/gemini-3.8-flash** · plain: EN: Goodbye, my son, may God bring you there safely. | FR: Au revoir mon fils, que Dieu te fasse arriver sain et sauf.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: Goodbye my dear boy, may God grant you safe travels. | FR: Au revoir mon garçon, que Dieu te fasse arriver sain et sauf.
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

### e20 [unseen] — واش باقي كتشرب أتاي بزاف؟ رد بالك من السكر.  
_wach ba9i katchrb atay bzaf? rdd balek mn ssokkar._ · gold: _Are you still drinking lots of tea? Watch out for the sugar._ · gender: m

- **openai/gpt-6-luna** · plain: EN: Are you still drinking a lot of tea? Watch out for the sugar. | FR: Tu bois toujours beaucoup de thé ? Fais attention au sucre.
- **openai/gpt-6-luna** · kebdti_gloss: EN: Do you still drink a lot of tea? Be careful with the sugar. | FR: Tu bois toujours beaucoup de thé ? Fais attention au sucre.
- **deepseek/deepseek-v4.1-flash** · plain: EN: Are you still drinking a lot of tea? Watch out for the sugar. | FR: Est-ce que tu bois encore beaucoup de thé ? Fais attention au sucre.
- **deepseek/deepseek-v4.1-flash** · kebdti_gloss: EN: Do you still drink a lot of tea? Be careful with the sugar. | FR: Tu bois toujours beaucoup de thé ? Fais attention au sucre.
- **google/gemini-3.8-flash** · plain: EN: Do you still drink a lot of tea? Watch out for the sugar. | FR: Est-ce que tu bois toujours beaucoup de thé ? Fais attention au sucre.
- **google/gemini-3.8-flash** · kebdti_gloss: EN: Are you still drinking so much tea? Be careful with the sugar. | FR: Est-ce que tu bois toujours autant de thé ? Fais attention au sucre.
- **gemini-3.6-flash** · plain: ❌ Error code: 429
- **gemini-3.6-flash** · kebdti_gloss: ❌ Error code: 429

## FR/ES/IT/EN → Darija


### x01 (fr → grandmother) — Mamie, j'ai eu mon bac avec mention ! Tu es fière de moi ?

- **openai/gpt-6-luna**: آ جدّتي، نجحت فالباك بميزة! واش نتي فخورة بيا؟  _(A jddati, nje7t f lbac b mention! Wach nti fakhoura بيا?)_
- **deepseek/deepseek-v4.1-flash**: أ مي، جبت الباك بميزة! واش نتي فخورة بيا؟  _(a mi, jbt lbac b miza! wash nti fakhra biya?)_
- **google/gemini-3.8-flash**: أ حنيني، راني نجحت فالباك وبنقطة زوينة! فرحانة بيا ياك؟  _(A 7nini, rani nje7t f lbac u b noqta zwina! Fer7ana biya yak?)_
- **gemini-3.6-flash**: ❌ Error code: 429

### x02 (es → grandmother) — Abuela, mañana es mi cumpleaños. ¿Me vas a llamar?

- **openai/gpt-6-luna**: آ الجدة، غدا عيد ميلادي. واش غادي تعيطي ليا؟  _(A jdda, ghdda 3id الميلاد dyali. Wash ghadi t3ayti liya?)_
- **deepseek/deepseek-v4.1-flash**: يا مي، غدا عيد ميلادي. واش غادي تعيطي ليا؟  _(A mi, ghedda 3id miladi. Wash ghadi t3ayti lia?)_
- **google/gemini-3.8-flash**: أ مّي، غدّا عيد ميلادي. واش غادي تعيّطي لي؟  _(A mmi, ghedda 3id miladi. Wash ghadi t3eyyti li?)_
- **gemini-3.6-flash**: ❌ Error code: 429

### x03 (it → grandmother) — Nonna, ho la febbre ma sto bene, non preoccuparti.

- **openai/gpt-6-luna**: آ جدّتي، عندي السخانة ولكن لاباس عليا، ما تقلقيش.  _(A jddti, 3ndi sskhana walakin labas 3liya, ma t9el9ich.)_
- **deepseek/deepseek-v4.1-flash**: أ مي، عندي سخانة ولكن راني بخير، ما تقلقِيش.  _(A mi, 3andi sakhana walakin rani bikhir, ma tqelqish.)_
- **google/gemini-3.8-flash**: أ حنيني، فيّا شوية د السخانة ولكن راني بيخير، ما تشطنيش بالك.  _(A 7nini, fiyya chwiya d skhana walakin rani bikhir, ma tchtnich balek.)_
- **gemini-3.6-flash**: ❌ Error code: 429

### x04 (en → grandmother) — Grandma, I'm learning to cook your tagine. It's not as good as yours!

- **openai/gpt-6-luna**: آ جدتي، راني كنتعلم نطيب الطاجين ديالك. ما كيجينيش زوين بحال ديالك!  _(A jddati, rani kant3ellem ntib ṭṭajin dyalek. Ma kayjiniš zwin bḥal dyalek!)_
- **deepseek/deepseek-v4.1-flash**: أ مي، راني كنتعلم نطيب طاجين ديالك. ولكن مازال ما كيوصلش لديالك!  _(A mi, rani knt3llm nṭiyyeb ṭajin dyalek. Walakin mazal ma kaywṣelch l dyalek!)_
- **google/gemini-3.8-flash**: أ لالة مي، راني كنتعلم نطيب الطاجين ديالك، ولكن ما جاش بنين بحال ديالك!  _(A lalla mi, rani kant3ellem ntiyeb tajin dyalek, walakin ma jash bnin b7al dyalek!)_
- **gemini-3.6-flash**: ❌ Error code: 429

### x05 (fr → grandmother) — Je t'aime fort, mamie. Prends soin de toi.

- **openai/gpt-6-luna**: كنبغيك بزاف آ جدّتي. ردي بالك على راسك.  _(Kanbghik بزaf a jddati. Rddi balk 3la rask.)_
- **deepseek/deepseek-v4.1-flash**: أ مي، كنبغيك بزاف. عافاك ديري على راسك.  _(a mi, kanbghik bzaf. 3afak diri 3la rasek.)_
- **google/gemini-3.8-flash**: كنبغيك بزاف أ جْدة، تْهَلّايْ فْرَاسْك.  _(Kanbghik bzzaf a jdda, thllay f rassek.)_
- **gemini-3.6-flash**: ❌ Error code: 429

### x06 (en → grandfather) — Grandpa, I'm coming to Morocco for Eid with mom and dad.

- **openai/gpt-6-luna**: آ جدي، غادي نجي للمغرب فالعيد مع ماما وبابا.  _(A jddi, ghadi nji l-lmaghrib f l3id m3a mama w baba.)_
- **deepseek/deepseek-v4.1-flash**: آ جدي، غادي نجي للمغرب فالعيد مع مّي وبابا.  _(A jddi, ghadi nji l-Maghrib f l-3id m3a mmi w baba.)_
- **google/gemini-3.8-flash**: أ جدي، راه غادي نجي للمغرب فالعيد أنا وماما وبابا.  _(A jddi, rah ghadi nji l-Meghrib f l-3id ana w mama w baba.)_
- **gemini-3.6-flash**: ❌ Error code: 429