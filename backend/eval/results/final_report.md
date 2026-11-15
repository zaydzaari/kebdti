# Final held-out test: 41 real Moroccan expressions and proverbs

41 messages (16 proverbs/idioms from the web, 22 everyday grandparent expressions, 3 neutral). None are in the glossary or the examples. Judge: `openai/gpt-6.1-terra`, blind (outputs shuffled as A/B/C), English only.

| System | Real meaning (judge, 0–2 avg) | Fully understood (score 2) | Confusing / wrong (score 0) | Added content (judge) | Literal traps hit (any language) | Added feeling on neutral | Median latency (s) | Cost / message |
|---|---|---|---|---|---|---|---|---|
| **luna_plain** | 1.56 | 23/41 | 0/41 | 4/41 | 4/17 | — | 3.88 | $0.00009 |
| **luna_v31** | 1.73 | 30/41 | 0/41 | 4/41 | 1/17 | 0/3 | 4.55 | $0.00021 |
| **gemini_v31** | 1.80 | 34/41 | 1/41 | 7/41 | 1/17 | 0/3 | 4.68 | $0.00268 |

**ZenMux cost:** generation $0.1224 + judge $0.0292 = **$0.1516**

## Every message (EN, with judge score)


### h01 [web] اللي بغا العسل يصبر لقريص النحل أوليدي.  
_lli bgha l3sel ysber l9ris n7el a wlidi._ · gold: _If you want something sweet, you have to put up with the hard parts, my boy (keep going)._

- **luna_plain** [1]: EN: He who wants honey must endure the bee stings, my son. | FR: Qui veut du miel doit supporter les piqûres d’abeilles, mon fils.
- **luna_v31** [1]: EN: My son, if you want the honey, you have to put up with the bee stings. | FR: Mon fils, si tu veux le miel, il faut accepter les piqûres d’abeilles.
- **gemini_v31** [0]: EN: ❌ None | FR: None

### h02 [web] اللسان ما فيه عظم، رد بالك آش كتقول لختك.  
_llsan ma fih 3dem, rdd balek ach katgoul l khtek._ · gold: _Words come out easily but they can hurt, so be careful what you say to your sister._

- **luna_plain** [1]: EN: The tongue has no bones, so be careful what you say to your sister. | FR: La langue n’a pas d’os, fais attention à ce que tu dis à ta sœur.
- **luna_v31** [2]: EN: Words can hurt. Be careful what you say to your sister. | FR: Les paroles peuvent faire mal. Fais attention à ce que tu dis à ta sœur.
- **gemini_v31** [2]: EN: Words can easily slip and hurt, watch what you say to your sister. | FR: La langue n'a pas d'os, fais attention à ce que tu dis à ta sœur.

### h03 [web] اللي زربو ماتو، سوق بشوية أوليدي.  
_lli zerbo matou, sou9 bchwiya a wlidi._ · gold: _No need to rush, drive slowly, my boy._

- **luna_plain** [2]: EN: Those who rushed are dead; drive slowly, my son. | FR: Ceux qui se sont pressés sont morts ; roule doucement, mon fils.
- **luna_v31** [2]: EN: Those who rush end up dying. Drive slowly, my boy. | FR: Ceux qui se dépêchent finissent par mourir. Conduis doucement, mon garçon.
- **gemini_v31** [2]: EN: Haste makes waste, drive slowly my boy. | FR: Rien ne sert de courir, conduis doucement mon garçon.

### h04 [web] درتي ليا الطيارة فراسي بهاد الهضرة!  
_derti liya tiyara f rasi b had lhedra!_ · gold: _You're making my head spin with all this talking! (playful)_

- **luna_plain** [2]: EN: You've got my head spinning with all this talk! | FR: Tu m'as fait tourner la tête avec tout ce discours !
- **luna_v31** [2]: EN: You’ve got my head spinning with all that talk! | FR: Tu m’as fait tourner la tête avec tout ce que tu racontes !
- **gemini_v31** [2]: EN: You're making my head spin with all this talk! | FR: Tu me fais tourner la tête avec toutes ces histoires !

### h05 [web] كون كان الخوخ يداوي كون داوى راسو.  
_koun kan lkhoukh ydawi koun dawa rasou._ · gold: _Someone who can't follow their own advice shouldn't give it._

- **luna_plain** [1]: EN: If peaches could cure, they would cure themselves. | FR: Si les pêches guérissaient, elles se guériraient elles-mêmes.
- **luna_v31** [1]: EN: If peaches could cure, they’d have cured themselves. | FR: Si les pêches guérissaient, elles se seraient guéries elles-mêmes.
- **gemini_v31** [1]: EN: If peaches could cure, they would have cured themselves first! | FR: Si les pêches pouvaient guérir, elles commenceraient par se soigner elles-mêmes !

### h06 [web] الخاوة حدها الدنيا، بغيو بعضياتكم.  
_lkhawa 7edha ddenya, bghiw b3diyatkom._ · gold: _Brothers and sisters only have this life together, so love each other._

- **luna_plain** [1]: EN: Brothers, life is short: love one another. | FR: Les frères, la vie est courte : aimez-vous les uns les autres.
- **luna_v31** [1 +added]: EN: Your brothers and sisters are among the most precious things in this world. Love one another. | FR: La famille, et surtout les frères et sœurs, c’est ce qu’il y a de plus précieux au monde. Aimez-vous les uns les autres.
- **gemini_v31** [2]: EN: Siblinghood only lasts as long as this life, love one another. | FR: La fraternité ne dure que le temps de cette vie, aimez-vous les uns les autres.

### h07 [web] وريه وريه، وإلا عمى سير وخليه.  
_wrih wrih, w ila 3ma sir w khellih._ · gold: _Show him the way, and if he won't see it, leave him be._

- **luna_plain** [2]: EN: Show him, show him; and if he pretends not to see, walk away and leave him alone. | FR: Montre-lui, montre-lui ; s’il fait semblant de ne pas voir, pars et laisse-le.
- **luna_v31** [2]: EN: Show him, show him; and if he turns a blind eye, just leave him be. | FR: Montre-lui, montre-lui ; et s’il fait semblant de ne rien voir, laisse tomber et laisse-le tranquille.
- **gemini_v31** [2]: EN: Guide someone and show them the way, but if they choose to stay blind, just leave them be. | FR: Conseille-le, guide-le, mais s'il refuse de voir, laisse-le tranquille.

### h08 [web] اللي عضو الحنش كيخاف من الحبل.  
_lli 3eddo l7nech kaykhaf mn l7bel._ · gold: _Once bitten, twice shy._

- **luna_plain** [2]: EN: Once bitten, twice shy. | FR: Qui a été mordu par un serpent craint la corde.
- **luna_v31** [2]: EN: Once bitten, twice shy. | FR: Chat échaudé craint l’eau froide.
- **gemini_v31** [2]: EN: Once bitten, twice shy. | FR: Chat échaudé craint l'eau froide.

### h09 [web] جا يكحلها عماها.  
_ja ykehhelha 3maha._ · gold: _He tried to help and made it worse._

- **luna_plain** [2]: EN: He tried to help, but only made things worse. | FR: Il a voulu bien faire, mais il a tout empiré.
- **luna_v31** [2]: EN: They tried to fix things, but only made them worse. | FR: Il a voulu arranger les choses, mais il a tout gâché.
- **gemini_v31** [2]: EN: He tried to fix things and only made them worse. | FR: Il a voulu arranger les choses et il a tout gâché.

### h10 [web] ما يحك ليك ظهرك غير ظفرك.  
_ma y7ekk lik dhrek ghir dfrek._ · gold: _Only you can really solve your own problems; count on yourself._

- **luna_plain** [1]: EN: Only your own fingernail can scratch your back. | FR: Il n’y a que ton propre ongle qui puisse te gratter le dos.
- **luna_v31** [2]: EN: No one can help you better than you can help yourself. | FR: On n’est jamais mieux servi que par soi-même.
- **gemini_v31** [2]: EN: If you want something done right, you have to rely on yourself. | FR: On n'est jamais mieux servi que par soi-même.

### h11 [web] مية تخميمة وتخميمة ولا ضربة بالمقص.  
_miyat tkhmima w tkhmima wla derba bl9ess._ · gold: _Think it over a hundred times before a decision you can't undo._

- **luna_plain** [1]: EN: Think a hundred times before making a cut with the scissors. | FR: Mieux vaut réfléchir cent fois que donner un coup de ciseaux.
- **luna_v31** [1]: EN: Better to think it over a hundred times than make one cut with the scissors. | FR: Mieux vaut y réfléchir cent fois que de donner un coup de ciseaux.
- **gemini_v31** [2]: EN: Think it over a hundred times before making a cut you can't undo. | FR: Mieux vaut réfléchir cent fois avant de donner un coup de ciseaux irréversible.

### h12 [web] إلا كان صاحبك عسل ما تلحسوش كامل.  
_ila kan sa7bek 3sel ma tl7souch kamel._ · gold: _If your friend is kind, don't take advantage of them._

- **luna_plain** [1]: EN: If your friend is honey, don’t lick him all up. | FR: Si ton ami est du miel, ne le lèche pas jusqu’à la dernière goutte.
- **luna_v31** [2]: EN: Even if your friend is as sweet as honey, don’t take advantage of them. | FR: Même si ton ami est doux comme le miel, n’en profite pas trop.
- **gemini_v31** [2]: EN: Even if your friend is as sweet as honey, don't take total advantage of their kindness. | FR: Même si ton ami est doux comme le miel, n'en abuse pas.

### h13 [web] الجمل ما كيشوفش حدبتو.  
_ljmel ma kaychoufch 7debtou._ · gold: _People see others' faults but not their own._

- **luna_plain** [1]: EN: The camel doesn’t see its own hump. | FR: Le chameau ne voit pas sa propre bosse.
- **luna_v31** [1]: EN: The camel doesn’t see its own hump. | FR: Le chameau ne voit pas sa propre bosse.
- **gemini_v31** [1]: EN: A camel never sees its own hump. | FR: Le chameau ne voit jamais sa propre bosse.

### h14 [web] ما تقلقش أوليدي، كلشي ديال الله.  
_ma t9le9ch a wlidi, kolchi dyal llah._ · gold: _Don't worry, my boy, it's all in God's hands._

- **luna_plain** [2]: EN: Don’t worry, my son, everything is in God’s hands. | FR: Ne t’inquiète pas, mon fils, tout est entre les mains de Dieu.
- **luna_v31** [2]: EN: Don’t worry, my son. It’s all in God’s hands. | FR: Ne t’inquiète pas, mon fils, tout est entre les mains de Dieu.
- **gemini_v31** [2]: EN: Don't worry, my boy, everything is in God's hands. | FR: Ne t'inquiète pas, mon garçon, tout est entre les mains de Dieu.

### h15 [web] هادشي مكتاب أبنتي.  
_hadchi mektab a benti._ · gold: _It was meant to be, my girl._

- **luna_plain** [1]: EN: It’s written, my daughter. | FR: C’est écrit, ma fille.
- **luna_v31** [2]: EN: It was meant to be, my daughter. | FR: C’est le destin, ma fille.
- **gemini_v31** [2]: EN: It was meant to be, my girl. | FR: C'était écrit, ma fille.

### h16 [web] الكرش إلا شبعات كتقول للراس غني.  
_lkerch ila chb3at katgoul lras ghenni._ · gold: _Once you've eaten well, you're in a good mood._

- **luna_plain** [1]: EN: When the belly is full, it tells the head to sing. | FR: Quand le ventre est rassasié, il dit à la tête de chanter.
- **luna_v31** [2]: EN: When your belly is full, your head feels like singing. | FR: Quand le ventre est plein, la tête a envie de chanter.
- **gemini_v31** [2]: EN: When the belly is full, the spirit rejoices. | FR: Quand le ventre est plein, le cœur est à la fête.

### h17 [common] الله يكون معاك أوليدي فالسفر.  
_llah ykoun m3ak a wlidi f ssafar._ · gold: _May God be with you on your trip, my boy (safe travels)._

- **luna_plain** [2]: EN: May God be with you on your journey, my son. | FR: Que Dieu t’accompagne dans ton voyage, mon fils.
- **luna_v31** [2]: EN: May God be with you on your journey, my son. | FR: Que Dieu t’accompagne pendant ton voyage, mon fils.
- **gemini_v31** [2]: EN: May God be with you on your journey, my boy. | FR: Que Dieu soit avec toi pour ton voyage, mon fils.

### h18 [common] بصحتك الكسوة الجديدة، جات عليك زوينة.  
_bse77tek lkeswa jdida, jat 3lik zwina._ · gold: _Enjoy your new outfit, it looks lovely on you._

- **luna_plain** [2]: EN: Enjoy your new outfit—it looks great on you. | FR: Félicitations pour ta nouvelle tenue, elle te va très bien.
- **luna_v31** [1]: EN: Your new outfit looks lovely on you. | FR: Ta nouvelle tenue te va très bien.
- **gemini_v31** [2]: EN: Wear your new outfit in good health, it looks wonderful on you. | FR: Profite bien de ta nouvelle tenue, elle te va à merveille.

### h19 [common] الله يعطيك الصحة على هاد الكسكسو، بنين بزاف.  
_llah y3tik sse77a 3la had lkeskso, bnin bzaf._ · gold: _Thank you so much for this couscous, it's delicious._

- **luna_plain** [2 +added]: EN: May God bless you for this couscous; it’s absolutely delicious. | FR: Que Dieu te garde en bonne santé pour ce couscous, il est vraiment délicieux.
- **luna_v31** [2]: EN: Thank you for this couscous, it was really delicious. | FR: Merci pour ce couscous, il était vraiment délicieux.
- **gemini_v31** [2 +added]: EN: Bless your hands for this couscous, it's so delicious. | FR: Que Dieu te donne la santé pour ce couscous, il est vraiment délicieux.

### h20 [common] الله يهديك أبنتي، نعسي بكري.  
_llah yhdik a benti, n3esi bekri._ · gold: _Oh come on, my girl, go to bed early (gentle nudge)._

- **luna_plain** [1 +added]: EN: May God guide you, my daughter. Go to bed early. | FR: Que Dieu te guide, ma fille, couche-toi tôt.
- **luna_v31** [1 +added]: EN: May God guide you, my daughter. Go to bed early. | FR: Que Dieu te guide, ma fille, couche-toi tôt.
- **gemini_v31** [2]: EN: Listen to me, my dear, go to sleep early. | FR: Sois raisonnable ma fille, va te coucher tôt.

### h21 [common] الله يجيب اللي فيه الخير.  
_llah yjib lli fih lkhir._ · gold: _Let's hope for the best._

- **luna_plain** [2]: EN: May God bring about what is best. | FR: Que Dieu fasse advenir ce qu’il y a de mieux.
- **luna_v31** [2]: EN: May everything turn out for the best. | FR: Que les choses se passent pour le mieux.
- **gemini_v31** [2]: EN: May God bring whatever is best. | FR: Que Dieu fasse que tout se passe pour le mieux.

### h22 [common] الله يكمل بالخير على العرس ديالك.  
_llah ykemmel bl khir 3la l3ers dyalek._ · gold: _I hope your wedding goes beautifully all the way._

- **luna_plain** [2]: EN: May God make your wedding go smoothly and happily. | FR: Que Dieu fasse que ton mariage se déroule pour le mieux.
- **luna_v31** [2]: EN: May everything go beautifully with your wedding. | FR: Que tout se passe pour le mieux pour ton mariage.
- **gemini_v31** [2 +added]: EN: May God bless your wedding and bring you all the best. | FR: Que Dieu bénisse ton mariage et fasse que tout se passe au mieux.

### h23 [common] الله يستر، سمعت بلي كاين الثلج عندكم.  
_llah yster, sme3t belli kayn ttelj 3ndkom._ · gold: _Oh dear, I hope everything's okay, I heard there's snow where you are._

- **luna_plain** [2]: EN: God protect you, I heard it’s snowing where you are. | FR: Que Dieu vous protège, j’ai entendu dire qu’il neige chez vous.
- **luna_v31** [2]: EN: May God protect you. I heard there’s snow where you are. | FR: Que Dieu vous protège, j’ai entendu dire qu’il neige chez vous.
- **gemini_v31** [2]: EN: May God keep you safe, I heard there is snow over there where you are. | FR: Que Dieu vous protège, j'ai entendu dire qu'il neige chez vous.

### h24 [common] عندك الزهر، ربحتي فالقرعة!  
_3ndek zzher, rbe7ti f l9or3a!_ · gold: _You're so lucky, you won the draw!_

- **luna_plain** [2]: EN: Lucky you, you won the draw! | FR: Tu as de la chance, tu as gagné au tirage au sort !
- **luna_v31** [2 +added]: EN: You’re so lucky—you won the raffle! | FR: Tu as de la chance, tu as gagné au tirage au sort !
- **gemini_v31** [2 +added]: EN: You're so lucky, you won the lottery drawing! | FR: Tu as de la chance, tu as gagné au tirage au sort !

### h25 [common] الله يسامحك، نسيتيني هاد السيمانة!  
_llah ysam7ek, nsitini had simana!_ · gold: _Oh you! You forgot about me this week! (affectionate teasing)_

- **luna_plain** [1]: EN: May God forgive you, you forgot about me this week! | FR: Que Dieu te pardonne, tu m’as oublié cette semaine !
- **luna_v31** [1]: EN: May God forgive you—you forgot about me this week! | FR: Que Dieu te pardonne, tu as oublié de penser à moi cette semaine !
- **gemini_v31** [1]: EN: May God forgive you, you forgot all about me this week! | FR: Que Dieu te pardonne, tu m'as oublié cette semaine !

### h26 [common] الوقت صعيبة، ولكن الله كريم.  
_lwe9t s3iba, walakin llah krim._ · gold: _Times are hard, but things will work out._

- **luna_plain** [1 +added]: EN: Times are hard, but God is generous. | FR: Les temps sont durs, mais Dieu est généreux.
- **luna_v31** [1 +added]: EN: Times are hard, but God is generous. | FR: Les temps sont difficiles, mais Dieu est généreux.
- **gemini_v31** [2 +added]: EN: Times are tough, but God will provide. | FR: Les temps sont durs, mais Dieu est généreux.

### h27 [common] ما تبقاش تفكر بزاف، خليها على الله.  
_ma tb9ach tfekker bzaf, khelliha 3la llah._ · gold: _Stop overthinking, leave it in God's hands._

- **luna_plain** [2]: EN: Don't overthink it; leave it to God. | FR: Ne réfléchis pas trop, remets-t'en à Dieu.
- **luna_v31** [2]: EN: Don’t overthink it; leave it in God’s hands. | FR: Ne te fais pas trop de souci, laisse ça entre les mains de Dieu.
- **gemini_v31** [2 +added]: EN: Don't overthink it and worry so much, leave it in God's hands. | FR: Ne te prends pas trop la tête, remets tout entre les mains de Dieu.

### h28 [common] بالشفا أوليدي، شرب الما بزاف.  
_bchfa a wlidi, chreb lma bzaf._ · gold: _Get well soon, my boy, drink lots of water._

- **luna_plain** [2]: EN: Get well soon, my son. Drink plenty of water. | FR: Remets-toi vite, mon fils, bois beaucoup d’eau.
- **luna_v31** [2]: EN: Get well soon, my son. Drink plenty of water. | FR: Remets-toi vite, mon fils. Bois beaucoup d’eau.
- **gemini_v31** [2]: EN: Get well soon, my boy, drink plenty of water. | FR: Bon rétablissement mon garçon, bois beaucoup d'eau.

### h29 [common] جيب صاحبك معاك، ما تحشمش، الدار دارك.  
_jib sa7bek m3ak, ma t7chemch, ddar darek._ · gold: _Bring your friend along, don't be shy, make yourself at home._

- **luna_plain** [2]: EN: Bring your friend with you, don’t be shy, make yourself at home. | FR: Amène ton ami avec toi, ne sois pas gêné, fais comme chez toi.
- **luna_v31** [2]: EN: Bring your friend with you, don’t be shy—make yourself at home. | FR: Amène ton ami avec toi, ne sois pas gêné, ici c’est chez toi.
- **gemini_v31** [2]: EN: Bring your friend with you, don't be shy, make yourself at home. | FR: Amène ton ami avec toi, ne sois pas timide, fais comme chez toi.

### h30 [common] راك ولد الناس، الله يحفظك ليا.  
_rak weld nnas, llah y7fdek liya._ · gold: _You're such a good, well-raised boy; God keep you safe for me._

- **luna_plain** [1 +added]: EN: You’re a good person; may God keep you by my side. | FR: Tu es quelqu’un de bien, que Dieu te garde auprès de moi.
- **luna_v31** [2]: EN: You’re a fine young man. May God keep you safe for me. | FR: Tu es quelqu’un de bien. Que Dieu te protège pour moi.
- **gemini_v31** [2]: EN: You are truly such a good, well-raised boy, may God protect you and keep you safe for me. | FR: Tu es vraiment un garçon bien élevé et respectable, que Dieu te protège et te garde pour moi.

### h31 [common] الله يرزقك بنت الناس.  
_llah yerz9ek bent nnas._ · gold: _May you find a good wife from a good family._

- **luna_plain** [1]: EN: May God bless you with a good woman. | FR: Que Dieu te donne une femme bien.
- **luna_v31** [1]: EN: May God bless you with a good woman. | FR: Que Dieu t’accorde une femme bien.
- **gemini_v31** [1]: EN: May God bless you with a good, respectable woman. | FR: Que Dieu t'accorde une femme bien et de bonne famille.

### h32 [common] العين حق، ما تبقاش تورّي التصاور ديالك للناس.  
_l3in 7e99, ma tb9ach twerri tsawer dyalek l nnas._ · gold: _The evil eye is real, don't show your photos to everyone._

- **luna_plain** [2]: EN: The evil eye is real; stop showing your photos to people. | FR: Le mauvais œil existe, arrête de montrer tes photos aux gens.
- **luna_v31** [2]: EN: The evil eye is real, so don’t keep showing your photos to people. | FR: Le mauvais œil existe, alors ne montre plus tes photos aux gens.
- **gemini_v31** [2]: EN: The evil eye is real, stop showing your photos to people. | FR: Le mauvais œil existe vraiment, ne montre plus tes photos aux gens.

### h33 [common] نعل الشيطان وتصالح مع ختك.  
_n3el chitan w tsale7 m3a khtek._ · gold: _Let it go and make peace with your sister._

- **luna_plain** [1]: EN: Damn the devil, and make up with your sister. | FR: Au diable le diable, et réconcilie-toi avec ta sœur.
- **luna_v31** [2]: EN: Forget all that and make up with your sister. | FR: Au diable tout ça, réconcilie-toi avec ta sœur.
- **gemini_v31** [2 +added]: EN: Let it go, don't let anger win, and make peace with your sister. | FR: Mets ta rancœur de côté et réconcilie-toi avec ta sœur.

### h34 [common] ناري! شحال كبرتي أبنتي!  
_nari! ch7al kberti a benti!_ · gold: _Oh my goodness! How much you've grown, my girl!_

- **luna_plain** [2]: EN: Wow! How you’ve grown, my daughter! | FR: Oh là là ! Comme tu as grandi, ma fille !
- **luna_v31** [2]: EN: Wow! You've grown so much, my daughter! | FR: Oh là là ! Comme tu as grandi, ma fille !
- **gemini_v31** [2 +added]: EN: My goodness, look how much you've grown, my sweet girl! | FR: Mon Dieu, comme tu as grandi, ma fille !

### h35 [common] الله يخلف عليك على الفلوس اللي صيفطتي.  
_llah ykhlef 3lik 3la lflous lli sifti._ · gold: _Thank you for the money you sent, may God repay you._

- **luna_plain** [2]: EN: May God reward you for the money you sent. | FR: Que Dieu te récompense pour l’argent que tu as envoyé.
- **luna_v31** [2]: EN: May God reward you for the money you sent. | FR: Que Dieu te récompense pour l’argent que tu as envoyé.
- **gemini_v31** [2]: EN: May God reward you and replenish what you spent for the money you sent. | FR: Que Dieu te récompense pour l'argent que tu as envoyé.

### h36 [common] كبدي عليك أوليدي، بوحدك فالغربة.  
_kebdi 3lik a wlidi, bou7dek f lghorba._ · gold: _My heart aches for you, my boy, all alone so far from home._

- **luna_plain** [2]: EN: My heart aches for you, my son, all alone in a foreign land. | FR: J’ai mal au cœur pour toi, mon fils, tout seul à l’étranger.
- **luna_v31** [1]: EN: My darling boy, you’re all alone so far from home. | FR: Mon chéri, mon fils, tu es tout seul loin de chez toi.
- **gemini_v31** [2]: EN: My heart aches for you, my dear boy, all alone so far from home. | FR: Mon cœur saigne pour toi, mon garçon, tout seul si loin de nous.

### h37 [common] الضيف ضيف الله، دير ليه أتاي.  
_ddif dif llah, dir lih atay._ · gold: _A guest is a blessing, make him some tea._

- **luna_plain** [1]: EN: A guest is God’s guest; make him some tea. | FR: L’invité est l’invité de Dieu, prépare-lui du thé.
- **luna_v31** [2]: EN: A guest is sent by God—make them some tea. | FR: Un invité est un envoyé de Dieu : prépare-lui du thé.
- **gemini_v31** [1]: EN: A guest is a guest of God, make them some tea. | FR: Un invité est l'invité de Dieu, prépare-lui du thé.

### h38 [common] دير الخير وانساه.  
_dir lkhir w nsah._ · gold: _Do good and don't expect anything back._

- **luna_plain** [1]: EN: Do good and forget about it. | FR: Fais le bien et oublie-le.
- **luna_v31** [2]: EN: Do good without expecting anything in return. | FR: Fais le bien sans rien attendre en retour.
- **gemini_v31** [1]: EN: Do good and forget about it. | FR: Fais le bien et oublie-le.

### h39 [neutral] عيطت للطبيب، الموعد نهار الخميس مع العشرة.  
_3eyyet ltbib, lmaw3id nhar lkhmis m3a l3achra._ · gold: _I called the doctor, the appointment is Thursday at ten._

- **luna_plain** [2]: EN: I called the doctor; the appointment is on Thursday at ten. | FR: J’ai appelé le médecin, le rendez-vous est jeudi à dix heures.
- **luna_v31** [2]: EN: I called the doctor; the appointment is Thursday at ten. | FR: J’ai appelé le médecin, le rendez-vous est jeudi à dix heures.
- **gemini_v31** [2]: EN: I called the doctor, the appointment is on Thursday at ten o'clock. | FR: J'ai appelé le médecin, le rendez-vous est jeudi à dix heures.

### h40 [neutral] الما مقطوع، غادي نعيط ليك من بعد.  
_lma m9tou3, ghadi n3eyyet lik mn b3d._ · gold: _The water is cut off, I'll call you later._

- **luna_plain** [2]: EN: The water is off; I’ll call you later. | FR: L’eau est coupée, je t’appellerai plus tard.
- **luna_v31** [2]: EN: The water’s been cut off. I’ll call you later. | FR: L’eau est coupée, je t’appellerai plus tard.
- **gemini_v31** [2]: EN: The water is cut off, I'll call you later. | FR: L'eau est coupée, je t'appelle plus tard.

### h41 [neutral] خالك جا البارح وجاب معاه الخضرة.  
_khalek ja lbare7 w jab m3ah lkhodra._ · gold: _Your uncle came yesterday and brought the vegetables._

- **luna_plain** [2]: EN: Your uncle came yesterday and brought vegetables with him. | FR: Ton oncle est venu hier et a apporté des légumes avec lui.
- **luna_v31** [2]: EN: Your uncle came yesterday and brought some vegetables. | FR: Ton oncle est venu hier et a apporté des légumes.
- **gemini_v31** [2]: EN: Your uncle came by yesterday and brought some vegetables. | FR: Ton oncle est passé hier et il a apporté des légumes.