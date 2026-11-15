# Round 5: Luna + prompt v4.2 on a fresh held-out set

32 Darija messages (none of the key expressions are in the prompt; 3 contain speech-recognition-style noise; 4 neutral). No Latin transcription given (like the real app). Judge: GPT-6.1 Terra, blind, English only.

| System | Meaning (avg 0–2) | Fully understood | Wrong/confusing | Added content | Natural (1–3) | Literal traps | Neutral kept neutral | Noisy speech understood | Median latency (s) | Cost / msg |
|---|---|---|---|---|---|---|---|---|---|---|
| **luna_plain_high** | 1.45 | 17/31 | 3 | 5 | 2.45 | 0/15 | — | 3/3 | 7.96 | $0.00007 |
| **luna_v42_low** | 1.65 | 21/31 | 1 | 4 | 2.87 | 1/15 | 4/4 | 3/3 | 8.7 | $0.00035 |
| **luna_v42_high** | 1.52 | 18/31 | 2 | 5 | 2.61 | 1/15 | 4/4 | 3/3 | 13.71 | $0.00043 |

Into Darija (10 messages, high): non-Moroccan words found: 0.  
**Straitly cost of this round:** $0.0454

## Every message


### r01 اللي ما عندو كبير يشريه، سمع لكلام جدك.  
_lli ma 3ndo kbir ychrih, sme3 lkalam jeddek._ · gold: _Listen to your elders' advice, listen to your grandpa._ · profile: boy

- **luna_plain_high** [1]: EN: If you don’t have an elder, find one; listen to your grandfather’s words. | FR: Celui qui n’a pas d’aîné devrait s’en trouver un ; écoute les paroles de ton grand-père.
- **luna_v42_low** [1]: EN: Anyone who doesn’t have an elder should buy one. Listen to your grandfather’s advice. | FR: Celui qui n’a pas d’ancien devrait s’en acheter un. Écoute les conseils de ton grand-père.
- **luna_v42_high** [1]: EN: Someone who has no elder should buy one. Listen to your grandfather’s advice. | FR: Qui n’a pas d’aîné devrait s’en acheter un. Écoute les conseils de ton grand-père.

### r02 الكذوب ما عندو رجلين، قول ديما الحق.  
_lkdoub ma 3ndo rjlin, goul dima l7e9._ · gold: _Lies don't get far, always tell the truth._ · profile: None

- **luna_plain_high** [1]: EN: Lies have no legs; always tell the truth. | FR: Le mensonge n’a pas de jambes, dis toujours la vérité.
- **luna_v42_low** [2]: EN: Lies get you nowhere—always tell the truth. | FR: Le mensonge ne mène nulle part, dis toujours la vérité.
- **luna_v42_high** [2]: EN: Lies don't get you far—always tell the truth. | FR: Les mensonges ne vont pas loin ; dis toujours la vérité.

### r03 اللي بغا يربح العام طويل، ما تزربيش أبنتي.  
_lli bgha yrbe7 l3am twil, ma tzerbich a benti._ · gold: _There's plenty of time to succeed, don't rush, my girl._ · profile: girl

- **luna_plain_high** [2]: EN: Whoever wants to succeed has the whole year ahead; don’t rush, my daughter. | FR: Celui qui veut réussir a toute l’année devant lui ; ne te précipite pas, ma fille.
- **luna_v42_low** [2]: EN: You have all year to succeed. Don’t rush, my daughter. | FR: Pour réussir, on a toute l’année devant soi. Ne te presse pas, ma fille.
- **luna_v42_high** [1]: EN: My daughter, the year is long, so don’t rush. | FR: Ma fille, l’année est longue, alors ne te précipite pas.

### r04 زيد الما زيد الدقيق، ما تبقاش تخلط الأمور.  
_zid lma zid dd9i9, ma tb9ach tkhelleT lomour._ · gold: _Trying to patch it just makes it bigger; stop making things more complicated._ · profile: None

- **luna_plain_high** [1]: EN: Add water, add flour; stop mixing things up. | FR: Ajoute de l’eau, ajoute de la farine, n’embrouille pas les choses.
- **luna_v42_low** [1]: EN: Add the water and the flour, and stop mixing things up. | FR: Ajoute l’eau et la farine, et arrête de tout mélanger.
- **luna_v42_high** [1]: EN: Add the water, add the flour, but stop mixing things up. | FR: Ajoute l’eau, ajoute la farine, mais arrête d’embrouiller les choses.

### r05 حتى مش ما كيهرب من دار العرس.  
_7tta mech ma kayhreb mn dar l3ers._ · gold: _Nobody turns down a good thing (said with a smile when someone shows up for the food/fun)._ · profile: None

- **luna_plain_high** [1]: EN: Even a cat doesn’t run away from the house where the wedding is being held. | FR: Même un chat ne s’enfuit pas de la maison où se déroule le mariage.
- **luna_v42_low** [1]: EN: Even a cat wouldn’t leave a house where there’s a wedding! | FR: Même un chat ne quitte pas une maison où il y a un mariage !
- **luna_v42_high** [2]: EN: Even a cat won’t leave a house where there’s a wedding—nobody turns down a feast like that. | FR: Même un chat ne quitte pas une maison où l’on célèbre un mariage : personne ne refuse une fête pareille.

### r06 مول الفز كيقفز.  
_moul lfezz kay9fez._ · gold: _The guilty one gives himself away._ · profile: None

- **luna_plain_high** [0]: EN: He who can jump, jumps. | FR: Celui qui sait sauter saute.
- **luna_v42_low** [0 +added]: EN: Old habits die hard. | FR: Chassez le naturel, il revient au galop.
- **luna_v42_high** [0 +added]: EN: Who dares, wins. | FR: Qui ose gagne.

### r07 العكر على الخنونة، داكشي اللي دار.  
_l3ker 3la lkhnouna, dakchi lli dar._ · gold: _He just made it look nice on the surface (a superficial fix)._ · profile: None

- **luna_plain_high** [0]: EN: Makeup on snot—that’s what he did. | FR: Du maquillage sur de la morve, voilà ce qu’il a fait.
- **luna_v42_low** [1]: EN: What he did was just putting lipstick on something ugly. | FR: Ce qu’il a fait, c’est juste mettre du rouge à lèvres sur quelque chose de laid.
- **luna_v42_high** [0]: EN: What he did was just putting makeup on snot. | FR: Ce qu’il a fait, c’est du maquillage sur de la morve.

### r08 دخل سوق راسك أوليدي، ما تدخلش بين الناس.  
_dkhol sou9 rask a wlidi, ma tdkhelch bin nnas._ · gold: _Mind your own business, my boy, don't get involved in other people's affairs._ · profile: boy

- **luna_plain_high** [2]: EN: Mind your own business, my boy; don't get involved in other people's affairs. | FR: Mêle-toi de tes affaires, mon garçon, ne te mêle pas des affaires des autres.
- **luna_v42_low** [2]: EN: Mind your own business, my boy. Don’t get involved in other people’s affairs. | FR: Mêle-toi de tes affaires, mon fils, ne te mêle pas des histoires des autres.
- **luna_v42_high** [2]: EN: Mind your own business, my boy, and don't meddle in other people's affairs. | FR: Occupe-toi de tes affaires, mon grand, et ne te mêle pas des histoires des autres.

### r09 قلبي مقبوض هاد اليامات، عيط ليا.  
_9elbi m9boud had lyamat, 3eyyet liya._ · gold: _I've been feeling anxious and down these days, call me._ · profile: None

- **luna_plain_high** [2]: EN: My heart feels heavy these days, call me. | FR: J’ai le cœur serré ces jours-ci, appelle-moi.
- **luna_v42_low** [1]: EN: I've been feeling anxious these days. Call me. | FR: J’ai le cœur serré ces jours-ci, appelle-moi.
- **luna_v42_high** [1]: EN: My heart’s been tight these days. Call me. | FR: J’ai le cœur serré ces jours-ci, appelle-moi.

### r10 ما تكسريش ليا خاطري، جي فالعيد.  
_ma tkessrich liya khatri, ji f l3id._ · gold: _Don't let me down / don't say no to me, come for Eid._ · profile: girl

- **luna_plain_high** [1 +added]: EN: Don’t break my heart; come for Eid. | FR: Ne me brise pas le cœur, viens pour l’Aïd.
- **luna_v42_low** [2]: EN: Please don’t disappoint me—come for Eid. | FR: Ne me déçois pas, viens pour l’Aïd.
- **luna_v42_high** [1 +added]: EN: Don’t break my heart—come for Eid. | FR: Ne me brise pas le cœur, viens pour l’Aïd.

### r11 الله يجيب ليك شي بنت الحلال.  
_llah yjib lik chi bent l7lal._ · gold: _I hope you find a good wife._ · profile: boy

- **luna_plain_high** [1]: EN: May God bless you with a good woman. | FR: Que Dieu te fasse rencontrer une femme bien.
- **luna_v42_low** [2]: EN: May God bring you a good wife. | FR: Que Dieu te fasse rencontrer une bonne épouse.
- **luna_v42_high** [1]: EN: May God bring a good woman into your life. | FR: Que Dieu te fasse rencontrer une fille bien.

### r12 باز! شحال غالية هاد الحاجة!  
_baz! ch7al ghalya had l7aja!_ · gold: _Wow! That's so expensive!_ · profile: None

- **luna_plain_high** [2]: EN: Wow! This thing is so expensive! | FR: Waouh ! Comme c'est cher, ce truc !
- **luna_v42_low** [2]: EN: Wow! This thing is so expensive! | FR: Waouh ! Qu’est-ce que c’est cher, ce truc !
- **luna_v42_high** [2]: EN: Wow! This thing is so expensive! | FR: Waouh ! Qu'est-ce que c'est cher, ce truc !

### r13 عندك الوجه، كتطلب الفلوس وما كتعيطش!  
_3ndek lwejh, kateTleb lflous w ma kat3eyyetch!_ · gold: _You've got some nerve, asking for money and never calling! (teasing)_ · profile: boy

- **luna_plain_high** [2]: EN: You’ve got some nerve, asking for money and not even calling! | FR: T’as vraiment du culot : tu demandes de l’argent et tu n’appelles même pas !
- **luna_v42_low** [2]: EN: You've got some nerve—asking for money and not calling! | FR: Tu ne manques pas de culot : tu demandes de l'argent et tu n'appelles pas !
- **luna_v42_high** [2]: EN: You've got some nerve—asking for money without even calling! | FR: Tu as du culot : tu demandes de l'argent et tu n'appelles même pas !

### r14 دير النية وكلشي غادي يدوز مزيان.  
_dir nniya w kolchi ghadi ydouz mzyan._ · gold: _Just have faith, everything will be fine._ · profile: None

- **luna_plain_high** [1 +added]: EN: Have good intentions and everything will go well. | FR: Aie de bonnes intentions et tout se passera bien.
- **luna_v42_low** [1 +added]: EN: Keep good intentions, and everything will work out. | FR: Garde de bonnes intentions, et tout se passera bien.
- **luna_v42_high** [2 +added]: EN: Keep faith and approach it with good intentions; everything will go smoothly. | FR: Pars avec de bonnes intentions, et tout se passera bien.

### r15 الله يحسن العوان أبنتي، الخدمة والدراري.  
_llah y7sen l3wan a benti, lkhedma w ddrari._ · gold: _Hang in there, my girl, with work and the kids (God give you strength)._ · profile: girl

- **luna_plain_high** [2]: EN: May God give you strength, my daughter, with work and the children. | FR: Que Dieu te donne du courage, ma fille, avec le travail et les enfants.
- **luna_v42_low** [2]: EN: God help you, my daughter, with work and the children. | FR: Que Dieu t’aide, ma fille, avec le travail et les enfants.
- **luna_v42_high** [2]: EN: May God make things easier for you, my girl, with work and the children. | FR: Que Dieu te facilite les choses, ma fille, avec le travail et les enfants.

### r16 يا حسرة على أيام زمان، كنا كنتجمعو كاملين.  
_ya 7esra 3la iyyam zman, konna kanntjem3ou kamlin._ · gold: _Oh, those were the days, we all used to get together._ · profile: None

- **luna_plain_high** [2]: EN: Ah, how I long for the old days; we all used to gather together. | FR: Ah, quelle nostalgie des jours d’antan, nous nous réunissions tous.
- **luna_v42_low** [2]: EN: Ah, the old days… We all used to get together. | FR: Ah, les jours d’autrefois… On se réunissait tous ensemble.
- **luna_v42_high** [2]: EN: Oh, the old days… We all used to get together. | FR: Ah, les jours d’autrefois… On se réunissait tous.

### r17 الحمد لله، الخير والبركة، ما خاصنا والو.  
_l7amdoulillah, lkhir w lbaraka, ma khassna walou._ · gold: _Thank God, we have all we need, we're not missing anything._ · profile: None

- **luna_plain_high** [2 +added]: EN: Thank God, we have goodness and blessings; we lack nothing. | FR: Grâce à Dieu, nous avons le bien et la bénédiction, nous ne manquons de rien.
- **luna_v42_low** [2]: EN: Thank God, everything is fine; we don't need anything. | FR: Grâce à Dieu, tout va bien, on ne manque de rien.
- **luna_v42_high** [2]: EN: Thank God, everything is fine; we have everything we need. | FR: Dieu merci, tout va bien, on ne manque de rien.

### r18 كيداير مع القراية؟ واش نقيتي مزيان؟  
_kidayer m3a l9raya? wach n9iti mzyan?_ · gold: _How's school going? Did you get good grades?_ · profile: boy

- **luna_plain_high** [1 +added]: EN: How are you doing with your studies? Did you study well? | FR: Comment ça va avec les études ? Tu as bien étudié ?
- **luna_v42_low** [1 +added]: EN: How are your studies going? Have you been studying properly? | FR: Comment ça se passe avec les études ? Tu as bien travaillé ?
- **luna_v42_high** [1 +added]: EN: How are your studies going? Have you studied well? | FR: Comment ça se passe avec les études ? Tu as bien étudié ?

### r19 حشومة عليك، نسيتي عيد ميلاد ختك!  
_7chouma 3lik, nsiti 3id milad khtek!_ · gold: _Shame on you, you forgot your sister's birthday! (gentle)_ · profile: girl

- **luna_plain_high** [?]: EN: Shame on you, you forgot your sister’s birthday! | FR: C’est honteux de ta part, tu as oublié l’anniversaire de ta sœur !
- **luna_v42_low** [?]: EN: Shame on you, you forgot your sister’s birthday! | FR: C’est pas bien, tu as oublié l’anniversaire de ta sœur !
- **luna_v42_high** [?]: EN: Oh, shame on you—you forgot your sister’s birthday! | FR: Oh, la honte, tu as oublié l’anniversaire de ta sœur !

### r20 راسي كيدور شوية، ولكن الطبيب قال لاباس.  
_rasi kaydour chwiya, walakin ttbib gal labas._ · gold: _I feel a bit dizzy, but the doctor said it's nothing serious._ · profile: None

- **luna_plain_high** [2]: EN: I'm a little dizzy, but the doctor said everything was fine. | FR: J'ai un peu la tête qui tourne, mais le médecin a dit que tout allait bien.
- **luna_v42_low** [2]: EN: I’m feeling a little dizzy, but the doctor said it’s nothing serious. | FR: J’ai un peu la tête qui tourne, mais le médecin a dit que ce n’était rien de grave.
- **luna_v42_high** [2]: EN: My head is spinning a little, but the doctor said it’s nothing serious. | FR: J’ai un peu la tête qui tourne, mais le médecin a dit que ce n’était rien.

### r21 الله يطول عمرك ويخليك للوالدين ديالك.  
_llah ytowwel 3omrek w ykhellik lwalidin dyalek._ · gold: _May you live a long life and always be there for your parents._ · profile: boy

- **luna_plain_high** [1]: EN: May God grant you a long life and keep you for your parents. | FR: Que Dieu te donne une longue vie et te garde auprès de tes parents.
- **luna_v42_low** [1]: EN: May God grant you a long life and keep you with your parents for many years. | FR: Que Dieu te prête longue vie et te garde auprès de tes parents.
- **luna_v42_high** [1]: EN: May God grant you a long life and keep you with your parents for many years. | FR: Que Dieu t’accorde une longue vie et te garde auprès de tes parents.

### r22 واش كتظن راسك فالمريكان؟ حيد هاد الصبرديلة!  
_wach katdenn rask f lmirikan? 7iyyed had sberdila!_ · gold: _Who do you think you are, an American? Take off those sneakers! (teasing)_ · profile: boy

- **luna_plain_high** [1]: EN: Do you think you're in America? Take off that shoe! | FR: Tu te crois en Amérique ? Enlève cette chaussure !
- **luna_v42_low** [1]: EN: Do you think you're in America or what? Take off those slippers! | FR: Tu te crois en Amérique ou quoi ? Enlève ces pantoufles !
- **luna_v42_high** [1]: EN: Do you think you're in America or something? Take off that shoe! | FR: Tu te crois en Amérique ou quoi ? Enlève cette chaussure !

### r23 الدار خاوية بلا بيكم، حتى الما ما بقاش عندو الذوق.  
_ddar khawya bla bikom, 7tta lma ma b9ach 3ndo ddou9._ · gold: _The house feels empty without you all; nothing tastes the same._ · profile: None

- **luna_plain_high** [2]: EN: The house is empty without you, even water doesn’t taste the same anymore. | FR: La maison est vide sans vous, même l’eau n’a plus de goût.
- **luna_v42_low** [2]: EN: The house feels empty without you; even the water doesn’t taste the same anymore. | FR: La maison est vide sans vous ; même l’eau n’a plus le même goût.
- **luna_v42_high** [2]: EN: The house feels empty without you; even water doesn’t taste the same anymore. | FR: La maison est vide sans vous ; même l’eau n’a plus le même goût.

### r24 رد بالك من صحابات السوء أبنتي.  
_rdd balek mn s7abat ssou2 a benti._ · gold: _Watch out for bad friends, my girl._ · profile: girl

- **luna_plain_high** [2]: EN: Beware of bad company, my daughter. | FR: Méfie-toi des mauvaises fréquentations, ma fille.
- **luna_v42_low** [2]: EN: Be careful of bad company, my girl. | FR: Méfie-toi des mauvaises fréquentations, ma fille.
- **luna_v42_high** [2]: EN: Be careful around bad friends, my girl. | FR: Méfie-toi des mauvaises fréquentations, ma fille.

### r25 رفعتي لينا راسنا أوليدي، الله يكمل عليك.  
_rfe3ti lina rasna a wlidi, llah ykemmel 3lik._ · gold: _You made us so proud, my boy; I hope you keep succeeding._ · profile: boy

- **luna_plain_high** [0]: EN: ❌ Error code: 402 - Spend cap reached ($0.03 of $1.00 this day). Raise it at https://straitly.ai/app/keys or wait for the day to roll over. | FR: None
- **luna_v42_low** [2]: EN: You’ve made us so proud, my boy. I hope everything continues to go well for you. | FR: Tu nous as tellement rendus fiers, mon grand. J’espère que tout continuera à bien se passer pour toi.
- **luna_v42_high** [1]: EN: You've made us proud, my boy. I hope everything goes well for you to the end. | FR: Tu nous as rendus fiers, mon grand. Que tout aille bien pour toi jusqu’au bout.

### r26 [noisy speech] توحشتك بزاف بزاف أوليدي امتا غاتجي تجي تشوفنا  
_twe7chtek bzaf bzaf a wlidi imta ghatji tji tchoufna_ · gold: _I miss you so, so much, my boy. When are you coming to see us?_ · profile: boy

- **luna_plain_high** [2]: EN: I miss you so, so much, my son. When are you coming to visit us? | FR: Tu me manques énormément, mon fils. Quand est-ce que tu viendras nous voir ?
- **luna_v42_low** [2]: EN: I miss you so, so much, my boy. When are you coming to visit us? | FR: Tu me manques énormément, mon fils. Quand est-ce que tu viens nous voir ?
- **luna_v42_high** [2]: EN: I miss you so, so much, my boy. When are you coming to see us? | FR: Tu me manques tellement, mon grand. Quand est-ce que tu viendras nous voir ?

### r27 [noisy speech] شريت ليك الجلابة الصيف لي جاي نعطيهالك  
_chrit lik jjellaba sif lli jay n3tihalek_ · gold: _I bought you a djellaba, I'll give it to you next summer._ · profile: None

- **luna_plain_high** [2 +added]: EN: I bought you a summer djellaba; I’ll give it to you next summer. | FR: Je t’ai acheté la djellaba d’été ; je te la donnerai l’été prochain.
- **luna_v42_low** [2 +added]: EN: I bought you a summer jellaba; I’ll give it to you next summer. | FR: Je t’ai acheté une djellaba d’été ; je te la donnerai l’été prochain.
- **luna_v42_high** [2 +added]: EN: I bought you a summer djellaba; I’ll give it to you next summer. | FR: Je t’ai acheté une djellaba d’été ; je te la donnerai l’été prochain.

### r28 [noisy speech] الله يرضي عليك ابنتي الله يرضي عليك الله يوفقك فالامتحان  
_llah yrdi 3lik a benti llah yrdi 3lik llah ywaf9ek f limti7an_ · gold: _God bless you, my girl, good luck in your exam._ · profile: girl

- **luna_plain_high** [2]: EN: May God bless you, my daughter, and grant you success in the exam. | FR: Que Dieu te bénisse, ma fille, et t’accorde la réussite à l’examen.
- **luna_v42_low** [2]: EN: God bless you, my daughter. God bless you. I hope you do very well on your exam. | FR: Que Dieu te bénisse, ma fille. Que Dieu te bénisse. Je te souhaite beaucoup de réussite à ton examen.
- **luna_v42_high** [2]: EN: God bless you, my daughter. God bless you, and good luck on your exam. | FR: Que Dieu te bénisse, ma fille. Que Dieu te bénisse, et bonne chance pour ton examen.

### r29 الدوا سالا، غادي نشري آخر غدا.  
_ddwa sala, ghadi nchri akhor ghedda._ · gold: _The medicine ran out, I'll buy more tomorrow._ · profile: None

- **luna_plain_high** [1]: EN: The medicine has run out; I’ll buy another one tomorrow. | FR: Le médicament est fini, j’en achèterai un autre demain.
- **luna_v42_low** [2]: EN: The medicine has run out; I’ll buy more tomorrow. | FR: Les médicaments sont finis, j’irai en acheter d’autres demain.
- **luna_v42_high** [1]: EN: The medicine has run out. I’ll buy another one tomorrow. | FR: Le médicament est fini, j’en achèterai un autre demain.

### r30 جات فاتورة الضو، خلصتها.  
_jat faktourat ddaw, khlesstha._ · gold: _The electricity bill came, I paid it._ · profile: None

- **luna_plain_high** [2]: EN: The electricity bill arrived, and I paid it. | FR: La facture d’électricité est arrivée, je l’ai payée.
- **luna_v42_low** [2]: EN: The electricity bill came, and I paid it. | FR: La facture d’électricité est arrivée, je l’ai payée.
- **luna_v42_high** [2]: EN: The electricity bill came; I paid it. | FR: La facture d’électricité est arrivée, je l’ai payée.

### r31 الشتا طاحت بزاف هاد السيمانة.  
_chta ta7et bzaf had simana._ · gold: _It rained a lot this week._ · profile: None

- **luna_plain_high** [2]: EN: It rained a lot this week. | FR: Il a beaucoup plu cette semaine.
- **luna_v42_low** [2]: EN: It rained a lot this week. | FR: Il a beaucoup plu cette semaine.
- **luna_v42_high** [2]: EN: It rained a lot this week. | FR: Il a beaucoup plu cette semaine.

### r32 خالتك جات تسلم عليا وجابت معاها الدراري.  
_khaltek jat tsellem 3liya w jabt m3aha ddrari._ · gold: _Your aunt came to visit me and brought the kids._ · profile: None

- **luna_plain_high** [2]: EN: Your aunt came to say hello to me and brought the children with her. | FR: Ta tante est venue me saluer et elle a amené les enfants avec elle.
- **luna_v42_low** [2]: EN: Your aunt came to visit me and brought the children with her. | FR: Ta tante est venue me voir et elle a amené les enfants avec elle.
- **luna_v42_high** [2]: EN: Your aunt came to see me and brought the kids along. | FR: Ta tante est venue me voir et elle a amené les enfants avec elle.

## Into Darija (team: rate these)

- **z01** (fr, girl → grandmother, family word: أ حنا) Mamie, j'ai été acceptée en médecine à Lyon !
  → أ حنا، تقبلت فالطب فليون! · ['pride']
- **z02** (en, boy → grandfather, family word: None) Grandpa, I fixed my bike by myself, like you showed me.
  → أ جدي، صلحت البيكالا بوحدي، بحال ما وريتي ليا. · ['neutral']
- **z03** (es, girl → grandmother, family word: أ لالة) Abuela, ¿cómo se hace tu harira? Quiero cocinarla para mis amigas.
  → أ لالة، كيفاش كتديري الحريرة ديالك؟ بغيت نطيبها لصاحباتي. · ['neutral']
- **z04** (it, boy → grandmother, family word: None) Nonna, il treno è in ritardo, arrivo alle 20 invece delle 18.
  → أ لالة، الطران تأخر، غادي نوصل مع التمنية بلاصة الستة ديال العشية. · ['neutral']
- **z05** (fr, boy → grandmother, family word: أ مي) Mamie, maman te passe le bonjour. Elle t'appelle dimanche.
  → أ مي، ماما كتسلم عليك. غادي تعيط ليك نهار الحد. · ['neutral']
- **z06** (en, girl → grandmother, family word: None) Grandma, I'm sorry I was angry on the phone. I love you.
  → أ جدتي، سمحي ليا حيث كنت معصبة فالتليفون. كنبغيك. · ['love']
- **z07** (es, boy → grandfather, family word: أ سيدي) Abuelo, rezo para que te mejores pronto.
  → أ سيدي، كندعي معاك باش تبرى قريب. · ['care', 'blessing']
- **z08** (it, girl → grandmother, family word: None) Nonna, oggi mi hanno chiesto da dove vengo e ho detto: dal Marocco, come la mia nonna!
  → أ جدتي، اليوم سولوني منين أنا وقلت ليهم: من المغرب، بحال جدتي! · ['pride', 'love']
- **z09** (fr, girl → grandfather, family word: None) Papy, j'ai mal au ventre depuis hier mais ça va mieux.
  → أ جدي، كرشي كتوجعني من البارح ولكن دابا راني مزيانة. · ['care']
- **z10** (en, boy → grandmother, family word: أ حنا) Grandma, my little brother Yanis says hi. He's learning Darija!
  → أ حنا، خويا الصغير يانيس كيسلم عليك. راه كيتعلم الدارجة! · ['love']