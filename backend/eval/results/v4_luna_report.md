# Luna on the fresh held-out set (31 messages, 26 with expressions NOT in the prompt)

Judge: GPT-6.1 Terra (blind, English only). v4 = elder-Darija knowledge base + faithfulness contract.

| System | Meaning (avg 0–2) | Fully understood | Wrong/confusing | Added content | Natural (1–3) | Literal traps | Neutral kept neutral | Unseen fully understood | Median latency (s) | Cost / msg |
|---|---|---|---|---|---|---|---|---|---|---|
| **luna_plain** | 1.52 | 18/31 | 2 | 1 | 2.65 | 4/12 | — | 15/27 | 3.77 | $0.00011 |
| **luna_v4** | 1.65 | 21/31 | 1 | 2 | 2.77 | 2/12 | 3/3 | 17/27 | 5.19 | $0.00022 |
| **luna_v4_med** | 1.61 | 21/31 | 2 | 2 | 2.81 | 2/12 | 2/3 | 17/27 | 9.68 | $0.00029 |
| **luna_v4_high** | 1.77 | 25/31 | 1 | 2 | 2.87 | 2/12 | 3/3 | 21/27 | 9.64 | $0.00032 |

**Straitly cost of this run:** $0.0346

## Every message


### t01 [unseen] كل خنفوس عند مو غزال، وانتا عندي أحسن واحد.  
_kol khenfous 3nd mmou ghzal, w nta 3ndi a7sen wa7ed._ · gold: _Every child is beautiful to the one who loves them, and to me you're the best._

- **luna_plain** [1]: EN: Every beetle is a gazelle in its mother's eyes, and to me, you're the best.
- **luna_v4** [1]: EN: Every beetle is a gazelle in its mother’s eyes, and to me, you’re the best.  _(understood: Every mother sees her child as wonderful, and to me, you’re the best.)_
- **luna_v4_med** [1]: EN: Every beetle is a gazelle in its mother’s eyes, and to me, you’re the best.  _(understood: Every mother thinks her child is wonderful, and to me, you’re the best.)_
- **luna_v4_high** [2]: EN: Every mother thinks her child is wonderful, and to me, you’re number one.  _(understood: Every mother thinks her child is wonderful, and to me, you’re the best.)_

### t02 [unseen] اليد الوحدة ما كتصفقش، عاونو بعضياتكم.  
_lyedd lw7da ma katsaffe9ch, 3awnou b3diyatkom._ · gold: _You can't do it alone, help each other._

- **luna_plain** [1]: EN: One hand can’t clap; help one another.
- **luna_v4** [1]: EN: One hand alone can’t clap; help one another.  _(understood: You can’t do everything alone; support one another.)_
- **luna_v4_med** [1]: EN: You can’t clap with one hand; help one another.  _(understood: You can’t do everything alone; support one another.)_
- **luna_v4_high** [1]: EN: You can’t clap with one hand; help one another.  _(understood: You need each other, so help one another.)_

### t03 [unseen] قطران بلادي ولا عسل البلدان.  
_9tran bladi wla 3sel lbouldan._ · gold: _Nothing beats home; even the worst of home is better than the best abroad._

- **luna_plain** [1]: EN: The tar of my homeland is better than the honey of other lands.
- **luna_v4** [1]: EN: Better the tar of home than the honey of lands elsewhere.  _(understood: Even home’s hardships feel preferable to the sweetness of life elsewhere; there’s no place like home.)_
- **luna_v4_med** [1]: EN: The tar from my homeland is better than honey from elsewhere.  _(understood: Even something ordinary or unpleasant from home is better than the finest things elsewhere.)_
- **luna_v4_high** [1]: EN: Even the tar of my homeland is better than the honey of elsewhere.  _(understood: Even the worst of my homeland is better to me than the best of anywhere else.)_

### t04 [unseen] الجار قبل الدار، شوف شكون ساكن حداك.  
_jjar 9bel ddar, chouf chkoun saken 7dak._ · gold: _The neighbors matter more than the house, see who lives next to you._

- **luna_plain** [1]: EN: The neighbor comes before the house; see who lives next door.
- **luna_v4** [1]: EN: The neighbor comes before the house: see who lives next door.  _(understood: Choose your neighbors before choosing your home; find out who lives next door.)_
- **luna_v4_med** [1]: EN: The neighbors matter as much as the house: see who lives next door.  _(understood: Choose your neighbors before choosing your home; take a good look at who lives nearby.)_
- **luna_v4_high** [2]: EN: Choose your neighbors before your home; see who lives next door.  _(understood: Choose your neighbors before choosing your home; find out who will be living next door.)_

### t05 [unseen] باب النجار مخلوع، باك طبيب وهو ديما مريض.  
_bab nnjjar makhlou3, bak tbib w houwa dima mrid._ · gold: _The cobbler's children go barefoot: your dad is a doctor and he's always sick._

- **luna_plain** [1]: EN: The carpenter’s door is off its hinges; your father is a doctor, but he’s always sick.
- **luna_v4** [1]: EN: The carpenter’s door is off its hinges, and your father is a doctor but he’s always ill.  _(understood: The carpenter’s own door is broken, and your father is a doctor but is always ill—a teasing way of pointing out that people often neglect their own affairs or themselves.)_
- **luna_v4_med** [1]: EN: The carpenter’s door is off its hinges; your father is a doctor, and he’s always sick.  _(understood: The carpenter’s own door is broken, and your father is a doctor who is always sick—a teasing remark about how people may not manage their own affairs or health, despite their profession.)_
- **luna_v4_high** [1]: EN: The carpenter’s door is off its hinges, and your father is a doctor but he’s always sick.  _(understood: It’s ironic: even someone who knows how to fix things may neglect their own, and even a doctor can be sick all the time.)_

### t06 [unseen] الكلمة الزوينة كتخرج الحنش من غارو.  
_lkelma zwina katkhrrej l7nech mn gharou._ · gold: _A kind word can win over anyone._

- **luna_plain** [1]: EN: A kind word draws the snake out of its den.
- **luna_v4** [2]: EN: You catch more flies with honey than with vinegar.  _(understood: Kind words can persuade even someone difficult or hostile.)_
- **luna_v4_med** [1]: EN: A kind word can even coax a snake out of its den.  _(understood: Gentle words can calm or persuade even someone dangerous or hostile.)_
- **luna_v4_high** [2]: EN: You catch more flies with honey than with vinegar.  _(understood: Kind words can win over even someone difficult or wary.)_

### t07 [unseen] خوك ضربني وبكا، سبقني وشكا!  
_khouk drbni w bka, sb9ni w chka!_ · gold: _Your brother hit me and then cried, he complained before I could! (he plays the victim, playful)_

- **luna_plain** [2]: EN: Your brother hit me and then started crying; he beat me to it and complained first!
- **luna_v4** [2]: EN: Your brother hit me, then started crying and complained before I could!  _(understood: Your brother hit me, then cried and complained before I could—he made himself look like the victim first.)_
- **luna_v4_med** [2]: EN: Your brother hit me, then started crying; he beat me to it and complained first!  _(understood: Your brother hit me, then cried and rushed to complain before I could.)_
- **luna_v4_high** [2]: EN: Your brother hit me, then cried and complained before I could!  _(understood: Your brother hit me, then cried and complained before I could.)_

### t08 [unseen] طاحت الصمعة علقو الحجام.  
_ta7et ssem3a 3all9ou l7ejjam._ · gold: _They blamed the wrong person (a scapegoat)._

- **luna_plain** [0]: EN: The minaret collapsed, and they hanged the barber.
- **luna_v4** [2]: EN: The minaret fell, and they hanged the barber: they blamed the wrong person.  _(understood: They blamed the wrong person for what happened.)_
- **luna_v4_med** [0]: EN: The minaret fell, so they hanged the barber.  _(understood: When something goes wrong, they blame or punish someone who had nothing to do with it.)_
- **luna_v4_high** [2]: EN: When something goes wrong, they look for a scapegoat.  _(understood: When something goes wrong, they look for a scapegoat and blame someone who had nothing to do with it.)_

### t09 [unseen] ما تحزنش أوليدي، الدنيا دوارة.  
_ma t7zench a wlidi, ddenya dwwara._ · gold: _Don't be sad, my boy, life turns around (things will change)._

- **luna_plain** [2]: EN: Don’t be sad, my son; life has its ups and downs.
- **luna_v4** [2]: EN: Don't be sad, my boy. Life has its ups and downs.  _(understood: Don't be sad, my boy. Life has its ups and downs, and things can change.)_
- **luna_v4_med** [2]: EN: Don't be sad, my boy. Life has its ups and downs.  _(understood: Don't be sad, my boy. Life goes through ups and downs, and things can change.)_
- **luna_v4_high** [2]: EN: Don’t be sad, my boy; life has its ups and downs.  _(understood: Don’t be sad, my boy; life has its ups and downs.)_

### t10 [unseen] فين هاد الغيبة أبنتي؟ ما بقيتيش كتبان!  
_fin had lghiba a benti? ma b9itich katbani!_ · gold: _Where have you been, my girl? We never see you anymore! (affectionate reproach)_

- **luna_plain** [2]: EN: Where have you been, my daughter? You don't show up anymore!
- **luna_v4** [2]: EN: Where have you been, my daughter? We don’t see you around anymore!  _(understood: Where have you been, my daughter? We don’t see you around anymore!)_
- **luna_v4_med** [2]: EN: Where have you been, my girl? We don’t see you around anymore!  _(understood: Where have you been, my daughter? You don’t show up anymore; we don’t see you around.)_
- **luna_v4_high** [2]: EN: Where have you been, my daughter? We don’t see you around anymore!  _(understood: Where have you been, my daughter? We don’t see you around anymore!)_

### t11 [unseen] شحال هادي ما سمعت حسك.  
_ch7al hadi ma sme3t 7essek._ · gold: _It's been so long since I heard your voice._

- **luna_plain** [2]: EN: It’s been a long time since I heard your voice.
- **luna_v4** [2]: EN: It’s been so long since I heard your voice.  _(understood: It’s been so long since I heard your voice.)_
- **luna_v4_med** [2]: EN: It’s been so long since I heard your voice.  _(understood: It’s been a long time since I heard your voice.)_
- **luna_v4_high** [2]: EN: It’s been so long since I heard your voice.  _(understood: It’s been a long time since I heard your voice.)_

### t12 [unseen] كول أوليدي، راك ضعفتي بزاف.  
_koul a wlidi, rak d3efti bzaf._ · gold: _Eat, my boy, you've lost so much weight._

- **luna_plain** [2]: EN: Eat, my son, you’ve lost a lot of weight.
- **luna_v4** [2]: EN: Eat, son, you've lost a lot of weight.  _(understood: Eat, son, you've lost a lot of weight.)_
- **luna_v4_med** [2]: EN: Eat, my boy, you’ve gotten very thin.  _(understood: Eat, my boy, you’ve gotten very thin.)_
- **luna_v4_high** [2]: EN: Eat, my boy, you’ve gotten so thin.  _(understood: Eat, my boy, you’ve gotten very thin.)_

### t13 [unseen] واش نسيتي ميمتك؟ ما عيطتيش من العيد.  
_wach nsiti mimtek? ma 3eyyetti mn l3id._ · gold: _Have you forgotten your grandma (me)? You haven't called since Eid._

- **luna_plain** [0]: EN: Have you forgotten your mother? You haven’t called since Eid.
- **luna_v4** [0]: EN: Have you forgotten your mother? You haven’t called me since Eid.  _(understood: Have you forgotten your mother? You haven’t called me since Eid.)_
- **luna_v4_med** [0]: EN: Have you forgotten your mum? You haven't called since Eid.  _(understood: Have you forgotten your mother? You haven't called since Eid.)_
- **luna_v4_high** [0]: EN: Have you forgotten your mother? You haven’t called me since Eid.  _(understood: Have you forgotten your mother? You haven’t called me since Eid.)_

### t14 [unseen] أ المسخوط، فين كنتي؟ قلقتيني!  
_a lmeskhout, fin kenti? 9le9tini!_ · gold: _You little rascal, where were you? You had me worried! (affectionate)_

- **luna_plain** [2]: EN: You rascal, where were you? You had me worried!
- **luna_v4** [2]: EN: You rascal, where were you? You worried me!  _(understood: You rascal, where were you? You worried me!)_
- **luna_v4_med** [2]: EN: You little rascal, where were you? You had me worried!  _(understood: You little rascal, where were you? You had me worried!)_
- **luna_v4_high** [2]: EN: You rascal, where were you? You had me worried!  _(understood: You rascal, where were you? You had me worried!)_

### t15 [unseen] عواشرك مبروكة أوليدي، الله يعاودها عليك.  
_3wacherk mbrouka a wlidi, llah y3awedha 3lik._ · gold: _Happy Eid, my boy, may you celebrate many more._

- **luna_plain** [1]: EN: May your festive days be blessed, my son. May God let you celebrate them again.
- **luna_v4** [1]: EN: May your festivities be blessed, my son. May God let you celebrate them again.  _(understood: Eid Mubarak, my son. May God let you celebrate it again.)_
- **luna_v4_med** [1 +added]: EN: Eid Mubarak, my son. May God let you celebrate it again next year.  _(understood: Happy Eid, my son. May God let you celebrate it again next year.)_
- **luna_v4_high** [2]: EN: Happy Eid, my son. May God let you celebrate it again.  _(understood: Happy Eid, my son. May God let you celebrate it again.)_

### t16 [unseen] عمك أحمد مات البارح، البركة فراسكم.  
_3emmek a7med mat lbare7, lbaraka f raskom._ · gold: _Your uncle Ahmed passed away yesterday, my condolences to you all._

- **luna_plain** [2]: EN: Your uncle Ahmed passed away yesterday. My condolences to you and your family.
- **luna_v4** [1 +added]: EN: Your uncle Ahmed passed away yesterday. May his memory be a blessing to you all.  _(understood: Your uncle Ahmed passed away yesterday. May his memory be a blessing to you all.)_
- **luna_v4_med** [2]: EN: Your uncle Ahmed died yesterday. My condolences to you all.  _(understood: Your uncle Ahmed died yesterday. My condolences to you all.)_
- **luna_v4_high** [2]: EN: Your uncle Ahmed died yesterday. My condolences to you all.  _(understood: Your uncle Ahmed died yesterday. My condolences to you all.)_

### t17 [unseen] لا باس عليك؟ سمعت كنتي مريض.  
_la bas 3lik? sme3t kenti mrid._ · gold: _Are you okay? I heard you were sick._

- **luna_plain** [2]: EN: Are you okay? I heard you were sick.
- **luna_v4** [2]: EN: Are you okay? I heard you were sick.  _(understood: Are you okay? I heard you were sick.)_
- **luna_v4_med** [2]: EN: Are you okay? I heard you were sick.  _(understood: Are you okay? I heard you were sick.)_
- **luna_v4_high** [2]: EN: Are you feeling better? I heard you were sick.  _(understood: Are you feeling better? I heard you were sick.)_

### t18 [unseen] إمتى غادي نفرح بيك أوليدي؟  
_imta ghadi nfer7 bik a wlidi?_ · gold: _When will I see you get married, my boy?_

- **luna_plain** [1]: EN: When are you going to make me happy, my son?
- **luna_v4** [1]: EN: When will you make me happy, my son?  _(understood: When will you make me happy, my son?)_
- **luna_v4_med** [1]: EN: When will you give me that joy, my boy?  _(understood: When will you give me the joy of you, my boy?)_
- **luna_v4_high** [1]: EN: When will you make me happy, my boy?  _(understood: When will you make me happy, my boy?)_

### t19 [unseen] تغدينا مزيان عند مك، الله يعمرها دار.  
_tgheddina mzyan 3nd mmek, llah y3emmerha dar._ · gold: _We had a lovely lunch at your mom's, bless her home._

- **luna_plain** [2]: EN: We had a lovely lunch at your mother’s; may God bless her home.
- **luna_v4** [2 +added]: EN: We had a lovely lunch at your mother’s. May God keep her home full of life.  _(understood: We had a lovely lunch at your mother’s. May God keep her home full and thriving.)_
- **luna_v4_med** [2 +added]: EN: We had a lovely lunch at your mother’s. May her home always be full of life.  _(understood: We had a lovely lunch at your mother’s. May her home always be full and flourishing.)_
- **luna_v4_high** [2 +added]: EN: We had a lovely lunch at your mom’s. May God bless her home and keep it full.  _(understood: We had a lovely lunch at your mom’s. May God bless her home and keep it full.)_

### t20 [unseen] صافي، ما تبقاش تصيفط الفلوس، راه عندي اللي يكفيني.  
_safi, ma tb9ach tsifet lflous, rah 3ndi lli ykfini._ · gold: _That's enough, stop sending money, I have all I need._

- **luna_plain** [2]: EN: All right, don't send any more money; I have enough.
- **luna_v4** [2]: EN: That’s enough, don’t send me any more money; I have enough.  _(understood: Stop sending money; I have enough.)_
- **luna_v4_med** [2]: EN: That’s enough, please stop sending me money. I have enough.  _(understood: That’s enough, please stop sending money. I have enough.)_
- **luna_v4_high** [2]: EN: That's enough, don't keep sending me money; I have enough.  _(understood: That's enough, don't keep sending me money; I have enough.)_

### t21 [unseen] ياكما مريض؟ صوتك متبدل.  
_yakma mrid? soutek mtbeddel._ · gold: _You're not sick by any chance? Your voice sounds different._

- **luna_plain** [2]: EN: Are you sick? Your voice sounds different.
- **luna_v4** [2]: EN: Are you sick? Your voice sounds different.  _(understood: Are you sick? Your voice sounds different.)_
- **luna_v4_med** [2]: EN: Are you ill? Your voice sounds different.  _(understood: Are you ill? Your voice sounds different.)_
- **luna_v4_high** [2]: EN: Are you sick? Your voice sounds different.  _(understood: Are you sick? Your voice sounds different.)_

### t22 [unseen] زعما وليتي فرنسية؟ نسيتي الدارجة!  
_z3ma wlliti fransawiya? nsiti ddarija!_ · gold: _So you're French now, are you? You've forgotten Darija! (teasing)_

- **luna_plain** [2]: EN: So, have you become French? You forgot Darija!
- **luna_v4** [2]: EN: So, are you French now? You’ve forgotten Darija!  _(understood: So, are you French now? You’ve forgotten Darija!)_
- **luna_v4_med** [2]: EN: So, have you become French now? You’ve forgotten Darija!  _(understood: So, have you become French now? You’ve forgotten Darija!)_
- **luna_v4_high** [2]: EN: So, have you become French now? You’ve forgotten Darija!  _(understood: So, have you become French now? You’ve forgotten Darija!)_

### t23 [in prompt] تانتسناك تجي فالصيف.  
_tantsennak tji f sif._ · gold: _I'm waiting for you to come this summer._

- **luna_plain** [2]: EN: I’m waiting for you to come this summer.
- **luna_v4** [2]: EN: I’m waiting for you to come this summer.  _(understood: I’m waiting for you to come this summer.)_
- **luna_v4_med** [2]: EN: I’m waiting for you to come this summer.  _(understood: I’m waiting for you to come this summer.)_
- **luna_v4_high** [2]: EN: I’m waiting for you to come this summer.  _(understood: I'm waiting for you to come this summer.)_

### t24 [in prompt] نتيا أوليدي ديما فبالي.  
_ntiya a wlidi dima f bali._ · gold: _You're always on my mind, my boy._

- **luna_plain** [2]: EN: You, my son, are always on my mind.
- **luna_v4** [2]: EN: My son, you’re always on my mind.  _(understood: My son, you’re always on my mind.)_
- **luna_v4_med** [2]: EN: My boy, you're always in my thoughts.  _(understood: My boy, you're always in my thoughts.)_
- **luna_v4_high** [2]: EN: My son, you're always on my mind.  _(understood: My son, you're always on my mind.)_

### t25 [unseen] العام الجاي إن شاء الله نشوفك.  
_l3am jjay inchallah nchoufek._ · gold: _Hopefully I'll see you next year._

- **luna_plain** [2]: EN: Next year, God willing, I’ll see you.
- **luna_v4** [2]: EN: I hope to see you next year.  _(understood: Hopefully, I’ll see you next year.)_
- **luna_v4_med** [2]: EN: Hopefully, I’ll see you next year.  _(understood: Hopefully, I’ll see you next year.)_
- **luna_v4_high** [2]: EN: Hopefully, I’ll see you next year.  _(understood: Hopefully, I’ll see you next year.)_

### t26 [unseen] خلي عليك التيليفون وسير قرا.  
_khelli 3lik ttilifoun w sir 9ra._ · gold: _Put the phone down and go study._

- **luna_plain** [2]: EN: Put down your phone and go study.
- **luna_v4** [2]: EN: Put your phone away and go study.  _(understood: Put your phone away and go study.)_
- **luna_v4_med** [2]: EN: Put your phone down and go study.  _(understood: Put your phone down and go study.)_
- **luna_v4_high** [2]: EN: Put your phone aside and go study.  _(understood: Put your phone aside and go study.)_

### t27 [in prompt] كبدي عليك، الخدمة كتعيي بزاف؟  
_kebdi 3lik, lkhedma kat3ayyi bzaf?_ · gold: _My heart goes out to you, is work very tiring?_

- **luna_plain** [2]: EN: Aw, poor you, does work tire you out a lot?
- **luna_v4** [2]: EN: I worry about you. Is work very tiring for you?  _(understood: I worry about you. Is work very tiring for you?)_
- **luna_v4_med** [2]: EN: My heart aches for you. Does work tire you out a lot?  _(understood: My heart aches for you. Does work tire you a lot?)_
- **luna_v4_high** [2]: EN: My heart aches for you. Does work tire you out a lot?  _(understood: My heart aches for you. Does work tire you a lot?)_

### t28 [in prompt] الله يهديك، علاش ما لبستيش الكبوط؟ البرد!  
_llah yhdik, 3lach ma lbstich lkebbout? lberd!_ · gold: _Oh come on, why didn't you wear your coat? It's cold!_

- **luna_plain** [1 +added]: EN: May God guide you, why didn’t you put on your coat? It’s cold!
- **luna_v4** [2]: EN: Oh, come on, why didn’t you put on your coat? It’s cold!  _(understood: Oh, come on, why didn’t you put on your coat? It’s cold!)_
- **luna_v4_med** [2]: EN: Oh, come on, why didn’t you put your coat on? It’s cold!  _(understood: Oh, come on, why didn’t you put your coat on? It’s cold!)_
- **luna_v4_high** [2]: EN: Oh, come on, why didn’t you wear your coat? It’s cold!  _(understood: Oh, come on, why didn’t you wear your coat? It’s cold!)_

### t29 [unseen] الزيت البلدية صيفطتها مع خالك.  
_zzit lbeldiya sifetha m3a khalek._ · gold: _I sent the homemade olive oil with your uncle._

- **luna_plain** [1]: EN: I sent the local oil with your uncle.
- **luna_v4** [2]: EN: I sent the homemade olive oil with your uncle.  _(understood: I sent the homemade olive oil with your uncle.)_
- **luna_v4_med** [2]: EN: I sent the homemade olive oil with your uncle.  _(understood: I sent the homemade olive oil with your uncle.)_
- **luna_v4_high** [2 +added]: EN: I sent you some homemade olive oil with your maternal uncle.  _(understood: I sent you some homemade olive oil with your maternal uncle.)_

### t30 [unseen] الكار ديال الصباح مشا، غادي نشد ديال العشية.  
_lkar dyal sbah mcha, ghadi nched dyal l3chiya._ · gold: _I missed the morning bus, I'll take the afternoon one._

- **luna_plain** [1]: EN: The morning bus has left; I'll take the evening one.
- **luna_v4** [1]: EN: The morning bus has left, so I’ll take the evening one.  _(understood: The morning bus has left, so I’ll take the evening one.)_
- **luna_v4_med** [2]: EN: The morning bus has left, so I’ll take the afternoon one.  _(understood: The morning bus has left, so I’ll take the afternoon one.)_
- **luna_v4_high** [1]: EN: The morning bus has left, so I’ll take the evening one.  _(understood: The morning bus has left, so I’ll take the evening one.)_

### t31 [unseen] جدك دار التحاليل، كلشي مزيان.  
_jeddek dar tta7alil, kolchi mzyan._ · gold: _Your grandpa had his tests done, everything is fine._

- **luna_plain** [2]: EN: Your grandfather had the tests done; everything is fine.
- **luna_v4** [2]: EN: Your grandfather had some tests done; everything is fine.  _(understood: Your grandfather had some tests done, and everything is fine.)_
- **luna_v4_med** [2]: EN: Your grandfather had the tests done, and everything is fine.  _(understood: Your grandfather had the tests done, and everything is fine.)_
- **luna_v4_high** [2]: EN: Your grandfather had the tests done; everything is fine.  _(understood: Your grandfather had the tests done, and everything is fine.)_