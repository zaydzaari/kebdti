# Round 3 — warm Moroccan Darija (v3 style guide + few-shot)

## Into Darija: automatic checks

| Model | JSON ok | Non-Moroccan words | Neutral kept neutral (y04, y11) | Median latency (s) | Cost / message (USD) |
|---|---|---|---|---|---|
| `openai/gpt-6-luna` | 18/18 | 1 | 2/2 | 3.68 | 0.00024 |

## Darija → FR/ES/IT/EN (v3 + glossary): automatic checks

| Model | JSON ok | Literal traps hit | Added feeling on neutral msgs (e08–e10) | Median latency (s) | Cost / message (USD) |
|---|---|---|---|---|---|
| `openai/gpt-6-luna` | 20/20 | 0 | 0/3 | 4.73 | 0.00019 |

**Total ZenMux cost for this run:** $0.0081

## Into Darija: all outputs (team: rate these)


### x01 (fr, unknown → grandmother) — Mamie, j'ai eu mon bac avec mention ! Tu es fière de moi ?

- **openai/gpt-6-luna**: أ لالة، خديت الباك بميزة! واش فرحانة بيا؟  _(a lalla, khdit lbac b mijza! wash fer7ana biya?)_ · ['pride']

### x02 (es, unknown → grandmother) — Abuela, mañana es mi cumpleaños. ¿Me vas a llamar?

- **openai/gpt-6-luna**: أ مي، غدا عيد ميلادي. واش غادي تعيطي ليا؟  _(a mi, ghdda 3id miladi. wach ghadi t3ayti lia?)_ · ['neutral']

### x03 (it, unknown → grandmother) — Nonna, ho la febbre ma sto bene, non preoccuparti.

- **openai/gpt-6-luna**: أ مي، عندي السخانة ولكن راني بخير، ما تقلقيش.  _(a mi, 3ndi skhana walakin rani bikhir, ma tqelqich.)_ · ['worry', 'care']

### x04 (en, unknown → grandmother) — Grandma, I'm learning to cook your tagine. It's not as good as yours!

- **openai/gpt-6-luna**: أ مي، راني كنتعلم نطيب الطاجين ديالك. ما كيجيش بنين بحال ديالك!  _(a mi, rani kant3ellem nṭib ṭṭajin dyalek. ma kayjich bnin b7al dyalek!)_ · ['humor']

### x05 (fr, unknown → grandmother) — Je t'aime fort, mamie. Prends soin de toi.

- **openai/gpt-6-luna**: كنبغيك بزاف، أ لالة. تهلاي فراسك.  _(Kanbghik bzaf, a lalla. Thallay frask.)_ · ['love', 'care']

### x06 (en, unknown → grandfather) — Grandpa, I'm coming to Morocco for Eid with mom and dad.

- **openai/gpt-6-luna**: أ جدي، غادي نجي للمغرب فالعيد مع ماما وبابا.  _(a jeddi, ghadi nji l lmghrib fl3id m3a mama w baba.)_ · ['neutral']

### y01 (fr, girl → grandmother) — Mamie, j'ai eu mon permis du premier coup ! Je suis trop contente.

- **openai/gpt-6-luna**: أ مي، خديت البيرمي من أول مرة! راني فرحانة بزاف.  _(a mi, khdit lbirimi men awal merra! rani fer7ana bzaf.)_ · ['pride']

### y02 (en, boy → grandmother) — Grandma, I miss your bread so much. Nothing here tastes like home.

- **openai/gpt-6-luna**: أ حنيني، توحشت الخبز ديالك بزاف. حتى حاجة هنا ما كتجي بنينة بحال ديال الدار.  _(a 7nini, twe7chte lkhobz dyalek bzaf. 7tta 7aja hna ma katji bnina b7al dyal ddar.)_ · ['longing']

### y03 (es, girl → grandfather) — Abuelo, ¿cómo está tu rodilla? ¿Fuiste al médico?

- **openai/gpt-6-luna**: أ جدي، كيف دايرة ركبتك؟ واش مشيتي للطبيب؟  _(a jeddi, kif dayra rkebtek? wach mchiti ttbib?)_ · ['care', 'worry']

### y04 (it, boy → grandmother) — Nonna, arrivo sabato alle 15. Papà viene a prenderti.

- **openai/gpt-6-luna**: أ مي، غادي نوصل نهار السبت مع الثلاثة ديال العشية. بابا غادي يجي ياخدك.  _(a mi, ghadi nwsel nhar ssebt m3a tlet dyal l3chiya. baba ghadi yji yakhdek.)_ · ['neutral']

### y05 (fr, boy → grandfather) — Papy, j'ai prié pour toi à la mosquée vendredi.

- **openai/gpt-6-luna**: أ جدي، دعيت معاك فالجامع نهار الجمعة.  _(a jeddi, d3it m3ak f ljame3 nhar jjem3a.)_ · ['blessing']

### y06 (en, girl → grandmother) — Grandma, I got engaged! He's a good man, you'll love him.

- **openai/gpt-6-luna**: أ جدتي، راني مخطوبة! راه راجل مزيان، وغادي يعجبك.  _(a jedti, rani mkhtouba! rah rajel mzyan, w ghadi y3jebek.)_ · ['pride']

### y07 (es, boy → grandmother) — Abuela, perdón por no llamarte esta semana, tuve muchos exámenes.

- **openai/gpt-6-luna**: أ حنيني، سمحي ليا ما عيطتش ليك هاد السيمانة، كانو عندي بزاف ديال الامتحانات.  _(a 7nini, sme7i lia ma 3eyyeTch lik had simana, kano 3ndi bzaf dyal limti7anat.)_ · ['care']

### y08 (fr, girl → grandmother) — Le colis est arrivé, merci. Il y avait les gâteaux et l'huile d'olive.

- **openai/gpt-6-luna**: أ مي، الكولي وصل، شكراً. كانو فيه الحلوى وزيت العود.  _(a mi, lkoli wsel, choukran. kano fih l7lwa w zit l3oud.)_ · ['gratitude']

### y09 (en, boy → grandfather) — Grandpa, tell me again the story of when you came to France in 1972.

- **openai/gpt-6-luna**: أ جدي، عاود ليا الحكاية ديال ملي جيتي لفرنسا فالعام ديال اثنين وسبعين.  _(a jeddi, 3awed lia l7kaya dyal mlli jiti lfransa f l3am dyal juj w sb3in.)_ · ['neutral']

### y10 (it, girl → grandmother) — Nonna, ti voglio bene. Sei la persona più forte che conosco.

- **openai/gpt-6-luna**: أ مي، كنبغيك. نتي أقوى وحدة كنعرفها.  _(a mi, kanbghik. nti aqwa wa7da kan3refha.)_ · ['love']

### y11 (fr, boy → grandmother) — Mamie, mon téléphone était cassé, c'est pour ça que je ne répondais pas.

- **openai/gpt-6-luna**: أ حنيني، التيليفون ديالي كان مخلوع، على هاد الشي ما كنتش كنجاوب.  _(a 7nini, ttilifun dyali kan mekhlu3, 3la had chi ma kentch kanjawb.)_ · ['neutral']

### y12 (en, girl → grandmother) — Happy Eid grandma! I wish I was there with you.

- **openai/gpt-6-luna**: عيد مبارك أ مي! كون غير كنت معاك.  _(3id mabrouk a mi! kon ghir kنت m3ak.)_ · ['longing', 'love']

## Darija → EN / FR (v3 + glossary)


### e01 — تبارك الله عليك أوليدي، وليتي راجل!  
_tbarkallah 3lik a wlidi, wlliti rajel!_ · gold: _Look at you, my boy, you've become a man! (proud)_

- **openai/gpt-6-luna**: EN: Well done, my son—you’ve become a man! | FR: Bravo, mon fils, tu es devenu un homme ! · ['pride', 'love']

### e02 — الله يرحم والديك، جبتي ليا الدوا.  
_lah yr7em walidik, jbti liya dwa._ · gold: _Thank you so much for bringing me my medicine._

- **openai/gpt-6-luna**: EN: Thank you so much for bringing me the medicine. | FR: Merci infiniment, tu m’as apporté mes médicaments. · ['gratitude']

### e03 — على سلامتك أبنتي، الحمد لله وصلتي بخير.  
_3la slamtek a benti, l7amdulillah wselti bkhir._ · gold: _Welcome back safe and sound, my girl, thank God you arrived safely._

- **openai/gpt-6-luna**: EN: I’m glad you arrived safely, my daughter. Thank God you got there safe and sound. | FR: Contente que tu sois arrivée saine et sauve, ma fille. Dieu merci, tu es bien arrivée. · ['care']

### e04 — سير الله يعاونك، وما تنساش تعيط لمك.  
_sir lah y3awnek, w ma tnsach t3iyet l mmok._ · gold: _Go on, good luck, and don't forget to call your mom._

- **openai/gpt-6-luna**: EN: Go on, may God help you, and don’t forget to call your mother. | FR: Vas-y, que Dieu t’aide, et n’oublie pas d’appeler ta mère. · ['blessing', 'care']

### e05 — يا كبدتي، شحال كبرتي! الله يحفظك.  
_a kebdti, ch7al kberti! lah y7fdek._ · gold: _My darling, how much you've grown! God protect you._

- **openai/gpt-6-luna**: EN: My darling, look how much you’ve grown! May God protect you. | FR: Ma chérie, comme tu as grandi ! Que Dieu te protège. · ['love', 'blessing']

### e06 — الله يسهل عليك فالخدمة الجديدة أ عينيا.  
_lah ysehhel 3lik f lkhedma jdida a 3iniya._ · gold: _Good luck with your new job, my dear._

- **openai/gpt-6-luna**: EN: Good luck in your new job, my dear. | FR: Bonne chance dans ton nouveau travail, mon cœur. · ['blessing', 'love']

### e07 — الله يعطيك ما تمنيتي فهاد العام.  
_lah y3tik ma tmennity f had l3am._ · gold: _May you get everything you wish for this year._

- **openai/gpt-6-luna**: EN: May God grant you everything you wish for this year. | FR: Que Dieu t’accorde tout ce que tu souhaites pour cette année. · ['blessing']

### e08 — الماكلة واجدة، جيو تاكلو.  
_lmakla wajda, jiw taklo._ · gold: _Food's ready, come and eat._

- **openai/gpt-6-luna**: EN: The food is ready, come eat. | FR: Le repas est prêt, venez manger. · ['neutral']

### e09 — الضو قطع البارح ورجع هاد الصباح.  
_ddaw qta3 lbare7 w rje3 had sbah._ · gold: _The power went out yesterday and came back this morning._

- **openai/gpt-6-luna**: EN: The power went out yesterday and came back this morning. | FR: Le courant a été coupé hier et il est revenu ce matin. · ['neutral']

### e10 — شريت حولي العيد، كبير ومزيان.  
_chrit 7awli l3id, kbir w mzyan._ · gold: _I bought the sheep for Eid, it's big and nice._

- **openai/gpt-6-luna**: EN: I bought a ram for Eid; it’s big and handsome. | FR: J’ai acheté un bélier pour l’Aïd, il est grand et beau. · ['neutral']

### e11 — راسي كيضرني شوية ولكن لاباس، ما تخلعش.  
_rasi kaydorni chwiya walakin labas, ma tkhla3ch._ · gold: _I have a bit of a headache but I'm fine, don't worry._

- **openai/gpt-6-luna**: EN: My head hurts a little, but I’m okay. Don’t worry. | FR: J’ai un peu mal à la tête, mais ça va. Ne t’inquiète pas. · ['worry']

### e12 — نتا ضو عينيا.  
_nta daw 3iniya._ · gold: _You're the light of my eyes (you mean everything to me)._

- **openai/gpt-6-luna**: EN: You’re the light of my eyes. | FR: Tu es la prunelle de mes yeux. · ['love']

### e13 — قلبي معاك فالامتحان، ربي يكون معاك.  
_qelbi m3ak f limti7an, rebbi ykoun m3ak._ · gold: _I'm with you with all my heart for your exam, may God be with you._

- **openai/gpt-6-luna**: EN: My heart is with you for your exam. May God be with you. | FR: Je pense à toi pour ton examen. Que Dieu t’accompagne. · ['care', 'blessing']

### e14 — اللي فات مات.  
_lli fat mat._ · gold: _What's past is past, let it go._

- **openai/gpt-6-luna**: EN: What’s done is done. | FR: Ce qui est passé est passé. · ['neutral']

### e15 — الصبر مفتاح الفرج.  
_sber mefta7 lfaraj._ · gold: _Patience is the key to relief (things will get better)._

- **openai/gpt-6-luna**: EN: Patience is the key to finding relief. | FR: La patience est la clé de la délivrance. · ['neutral']

### e16 — كبرتي ومازال كتعاندي بحال باباك ملي كان صغير!  
_kberti w mazal kat3andi b7al babak mli kan sghir!_ · gold: _You've grown up but you're still as stubborn as your dad was when he was little!_

- **openai/gpt-6-luna**: EN: You’ve grown up, but you’re still as stubborn as your dad was when he was little! | FR: Tu as grandi, mais tu es toujours aussi têtue que ton père quand il était petit ! · ['humor']

### e17 — بلا بيك العيد ما عندو بنة.  
_bla bik l3id ma 3ndo benna._ · gold: _Without you, Eid just isn't the same._

- **openai/gpt-6-luna**: EN: Without you, Eid just doesn’t feel the same. | FR: Sans toi, l’Aïd n’a pas la même saveur. · ['love', 'longing']

### e18 — الله يرضي عليك ويجعل البركة فيك.  
_lah yrdi 3lik w yj3el lbaraka fik._ · gold: _God bless you and fill your life with blessings._

- **openai/gpt-6-luna**: EN: May God bless you and fill your life with blessings. | FR: Que Dieu te bénisse et remplisse ta vie de bénédictions. · ['blessing']

### e19 — بسلامة أوليدي، الله يوصلك على خير.  
_bslama a wlidi, lah ywesslek 3la khir._ · gold: _Goodbye my boy, have a safe trip._

- **openai/gpt-6-luna**: EN: Goodbye, my boy. May God get you there safely. | FR: Au revoir, mon fils. Que Dieu te fasse arriver à bon port. · ['love', 'blessing']

### e20 — واش باقي كتشرب أتاي بزاف؟ رد بالك من السكر.  
_wach ba9i katchrb atay bzaf? rdd balek mn ssokkar._ · gold: _Are you still drinking lots of tea? Watch out for the sugar._

- **openai/gpt-6-luna**: EN: Are you still drinking a lot of tea? Watch your sugar. | FR: Tu bois toujours beaucoup de thé ? Fais attention au sucre. · ['care']