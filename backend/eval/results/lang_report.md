# Per-language test on a fresh held-out set

20 new grandparent messages (17 with a tricky expression, 3 neutral), written after the prompt was frozen and leak-checked against the prompt and every earlier set (`eval/fresh_lang_leakcheck.py`). Same model for both systems (GPT-6 Luna, low effort). Judge: GPT-6.1 Terra, blind (A/B shuffled), in each language, against the gold meaning. Darija spellings and gold meanings were written with an AI assistant.

## Darija → each language

| Language | System | Fully understood | Wrong / confusing | Literal traps (of keyed) | Added content | Natural (1–3) | Voice: words heard back |
|---|---|---|---|---|---|---|---|
| English | Baseline (plain prompt) | 11/20 | 0 | 7/17 | 1 | 2.50 | — |
| English | **Kebdti** | 16/20 | 0 | 2/17 | 0 | 2.80 | 99% (20 notes) |
| French | Baseline (plain prompt) | 12/20 | 0 | 6/17 | 2 | 2.45 | — |
| French | **Kebdti** | 15/20 | 0 | 1/17 | 2 | 2.85 | 99% (20 notes) |
| Spanish | Baseline (plain prompt) | 13/20 | 1 | 5/17 | 1 | 2.65 | — |
| Spanish | **Kebdti** | 19/20 | 0 | 0/17 | 2 | 3.00 | 99% (20 notes) |
| Italian | Baseline (plain prompt) | 12/20 | 1 | 6/17 | 1 | 2.60 | — |
| Italian | **Kebdti** | 17/20 | 1 | 2/17 | 1 | 2.80 | 99% (20 notes) |

## Into Darija (grandchild → grandparent)

| Language | Messages | Pure Moroccan Darija (no Standard/Middle-Eastern words) | Repaired automatically |
|---|---|---|---|
| English | 5 | 5/5 | 0 |
| French | 5 | 5/5 | 0 |
| Spanish | 5 | 5/5 | 0 |
| Italian | 5 | 5/5 | 0 |

## Every message

### f01 · care · أ قلبي، راه البرد هاد العام قاسح، لبس مزيان وما تخرجش بشعرك فازگ.
gold: _My heart, it's very cold this year. Dress warmly and don't go out with wet hair._ · tricky: **شعرك فازگ**
- en baseline [2]: Oh, sweetheart, it’s really cold this year. Bundle up and don’t go out with your hair wet.
- en **kebdti** [1]: My darling, it’s very cold this year. Dress warmly, and don’t go outside with your head uncovered.
- fr baseline [2]: Oh mon cœur, le froid est rude cette année. Couvre-toi bien et ne sors pas avec les cheveux mouillés.
- fr **kebdti** [2]: Mon cœur, il fait très froid cette année. Habille-toi bien et ne sors pas les cheveux mouillés.
- es baseline [2]: Ay, cariño, este año hace mucho frío. Abrígate bien y no salgas con el pelo mojado.
- es **kebdti** [2]: Cariño, este año hace un frío tremendo. Abrígate bien y no salgas con el pelo mojado.
- it baseline [2]: Oh, tesoro, quest’anno fa molto freddo. Copriti bene e non uscire con i capelli bagnati.
- it **kebdti** [2]: Amore mio, quest’anno fa davvero freddo. Vestiti bene e non uscire con i capelli bagnati.

### f02 · affection · الحلوة اللي صيفطتي ليا أ بنتي، والله حتى لحستها بصبعي.
gold: _The cake you sent me, my girl, was so good I licked my fingers clean._ · tricky: **حتى لحستها بصبعي**
- en baseline [1 literal]: The sweet you sent me, my daughter—I swear I licked it with my finger.
- en **kebdti** [1 literal]: The sweet you sent me, my girl—I swear, I even licked it with my finger!
- fr baseline [1 literal]: La pâtisserie que tu m’as envoyée, ma fille, je te jure que je l’ai léchée avec mon doigt.
- fr **kebdti** [1]: La douceur que tu m’as envoyée, ma fille, je l’ai vraiment dégustée jusqu’à la dernière miette, même avec le doigt.
- es baseline [1 literal]: El dulce que me enviaste, hija, te juro que lo lamí con el dedo.
- es **kebdti** [2]: El dulce que me mandaste, hija mía, te juro que hasta lo rebañé con el dedo.
- it baseline [1 literal]: Il dolce che mi hai mandato, figlia mia, ti giuro che l’ho leccato con il dito.
- it **kebdti** [1 literal]: Il dolce che mi hai mandato, figlia mia, giuro che l’ho leccato persino con il dito.

### f03 · faith · ما تبقاش تقلق راسك على الامتحان، اللي كتب الله هو اللي غادي يكون.
gold: _Stop worrying about the exam. Whatever God has written is what will happen._ · tricky: **اللي كتب الله**
- en baseline [1 literal]: Don’t worry about the exam anymore; what God has written will happen.
- en **kebdti** [2]: Don't keep stressing about the exam. Whatever God has decreed will happen.
- fr baseline [2]: Ne te tracasse plus pour l’examen, ce que Dieu a écrit arrivera.
- fr **kebdti** [1]: Ne te fais pas de souci pour l’examen, ce qui doit arriver arrivera.
- es baseline [2]: No te preocupes más por el examen; pasará lo que Dios haya dispuesto.
- es **kebdti** [2]: No sigas preocupándote por el examen; lo que Dios ha dispuesto es lo que sucederá.
- it baseline [2]: Non preoccuparti più dell’esame; succederà ciò che Dio ha stabilito.
- it **kebdti** [2]: Non continuare a preoccuparti per l’esame: sarà quel che Dio ha stabilito.

### f04 · blessing · سير أ ولدي الله يسهل عليك ويحل ليك الباب.
gold: _Go, my son. May God make it easy for you and open the way for you._ · tricky: **يحل ليك الباب**
- en baseline [2]: Go on, my son. May God make things easy for you and open doors for you.
- en **kebdti** [1]: Go on, my boy. I hope things go smoothly for you and doors open for you.
- fr baseline [2]: Vas-y, mon fils. Que Dieu te facilite les choses et t’ouvre les portes.
- fr **kebdti** [1]: Va, mon grand. Que tout se passe bien pour toi et que les portes s’ouvrent à toi.
- es baseline [2]: Anda, hijo mío. Que Dios te facilite las cosas y te abra las puertas.
- es **kebdti** [2]: Ve, hijo mío. Que todo te salga bien y se te abran las puertas.
- it baseline [2]: Vai, figlio mio. Che Dio ti faciliti le cose e ti apra le porte.
- it **kebdti** [2]: Vai, figlio mio. Che tutto ti vada per il meglio e che ti si aprano tutte le porte.

### f05 · longing · ما بقيتيش كتعيط، حتى ولينا كنسولو عليك الجيران.
gold: _You don't call anymore; we've started asking the neighbours about you (a gentle reproach)._ · tricky: **كنسولو عليك الجيران**
- en baseline [1]: You don't call anymore; even the neighbors have started asking about you.
- en **kebdti** [2]: You’ve stopped calling, and we’ve even started asking the neighbors about you.
- fr baseline [1]: Tu n'appelles plus, au point que même les voisins se sont mis à demander de tes nouvelles.
- fr **kebdti** [2]: Tu n’appelles plus, au point qu’on a fini par demander de tes nouvelles aux voisins.
- es baseline [0]: Ya no llamas, hasta el punto de que incluso los vecinos han empezado a preguntar por ti.
- es **kebdti** [2]: Ya no llamas, y hemos acabado preguntando por ti a los vecinos.
- it baseline [1]: Non chiami più, tanto che persino i vicini hanno cominciato a chiedere di te.
- it **kebdti** [2]: Non ci chiami più; siamo arrivati persino a chiedere tue notizie ai vicini.

### f06 · longing · دارنا كتسناك، والزيتون ديال هاد العام كيشهي.
gold: _Our home is waiting for you, and this year's olives are delicious._ · tricky: **كيشهي**
- en baseline [2]: Our home is waiting for you, and this year’s olives look delicious.
- en **kebdti** [2]: We’re waiting for you at home, and this year’s olives look delicious.
- fr baseline [2]: Notre maison t’attend, et les olives de cette année sont alléchantes.
- fr **kebdti** [2]: Notre maison t’attend, et les olives de cette année donnent envie.
- es baseline [2]: Nuestra casa te espera, y las aceitunas de este año tienen una pinta deliciosa.
- es **kebdti** [2]: Te esperamos en casa; las aceitunas de este año tienen una pinta deliciosa.
- it baseline [2]: La nostra casa ti aspetta, e le olive di quest’anno sono invitanti.
- it **kebdti** [2]: Casa nostra ti aspetta, e le olive di quest’anno fanno venire l’acquolina in bocca.

### f07 · longing · عينيا ما شبعوش منك فالصيف، رجع بكري هاد المرة.
gold: _I didn't get to see enough of you this summer. Come back sooner this time._ · tricky: **عينيا ما شبعوش منك**
- en baseline [1 literal]: My eyes didn’t get enough of you this summer; come back early this time.
- en **kebdti** [2]: I didn’t get enough time with you this summer. Come back early this time.
- fr baseline [1 literal]: Mes yeux n’ont pas eu leur content de toi cet été, reviens tôt cette fois.
- fr **kebdti** [2]: Mon cœur, je n’ai pas eu assez de toi cet été. Reviens tôt cette fois-ci.
- es baseline [1 literal]: Mis ojos no tuvieron suficiente de ti este verano; vuelve pronto esta vez.
- es **kebdti** [2]: Cariño, este verano no tuve suficiente tiempo contigo; vuelve pronto esta vez.
- it baseline [1 literal]: I miei occhi non ne hanno avuto abbastanza di te quest’estate; torna presto questa volta.
- it **kebdti** [2]: Quest’estate non mi è bastato averti qui; torna presto, stavolta.

### f08 · blessing · كبر وصار راجل، الله يحضيه من العين.
gold: _He's grown into a man. May God protect him from the evil eye._ · tricky: **الله يحضيه من العين**
- en baseline [2]: He has grown up and become a man; may God protect him from the evil eye.
- en **kebdti** [2]: He’s grown up and become a man. May God protect him from the evil eye.
- fr baseline [2]: Il a grandi et est devenu un homme ; que Dieu le protège du mauvais œil.
- fr **kebdti** [2]: Il a grandi et il est devenu un homme. Que Dieu le protège du mauvais œil.
- es baseline [2]: Ha crecido y se ha convertido en un hombre; que Dios lo proteja del mal de ojo.
- es **kebdti** [2]: Ha crecido y se ha convertido en todo un hombre. Que Dios lo proteja del mal de ojo.
- it baseline [2]: È cresciuto ed è diventato un uomo; che Dio lo protegga dal malocchio.
- it **kebdti** [2]: È cresciuto ed è diventato un uomo. Che Dio lo protegga dal malocchio.

### f09 · care · خالتك مريضة شوية، عيط ليها وفرحها بحسك.
gold: _Your aunt is a little sick. Call her and cheer her up by letting her hear your voice._ · tricky: **فرحها بحسك**
- en baseline [1]: Your aunt is a little unwell; call her and cheer her up with your presence.
- en **kebdti** [2]: Your aunt is a little unwell. Give her a call and cheer her up.
- fr baseline [1]: Ta tante est un peu malade, appelle-la et réconforte-la par ta présence.
- fr **kebdti** [2]: Ta tante est un peu malade. Appelle-la, ça lui fera plaisir de t’entendre.
- es baseline [1]: Tu tía está un poco enferma; llámala y anímala con tu presencia.
- es **kebdti** [2]: Tu tía está un poco enferma. Llámala; oír tu voz la alegrará.
- it baseline [1]: Tua zia è un po’ malata; chiamala e tirale su il morale con la tua presenza.
- it **kebdti** [2]: Tua zia non si sente tanto bene. Chiamala, le farà piacere sentirti.

### f10 · proverb · دير الخير وكبو فالبحر، ما تسناش شي حاجة من حد.
gold: _Do good and forget about it. Don't expect anything back from anyone._ · tricky: **دير الخير وكبو فالبحر**
- en baseline [1 literal]: Do good and cast it into the sea; don’t expect anything from anyone.
- en **kebdti** [2]: Do good and expect nothing in return.
- fr baseline [1 literal]: Fais le bien et jette-le à la mer ; n’attends rien de personne.
- fr **kebdti** [2]: Fais le bien sans rien attendre en retour.
- es baseline [1 literal]: Haz el bien y échalo al mar; no esperes nada de nadie.
- es **kebdti** [2]: Haz el bien sin esperar nada a cambio.
- it baseline [1 literal]: Fai del bene e gettalo in mare; non aspettarti nulla da nessuno.
- it **kebdti** [2]: Fai del bene senza aspettarti nulla in cambio.

### f11 · humour · ديما كنقول ليهم: هاد الدري راسو قاصح بحال جدو.
gold: _I always tell them: this boy is stubborn, just like his grandfather._ · tricky: **راسو قاصح**
- en baseline [2]: I always tell them: this boy is as stubborn as his grandfather.
- en **kebdti** [2]: I always tell them, “This boy is as stubborn as his grandpa.”
- fr baseline [2]: Je leur dis toujours : ce garçon est aussi têtu que son grand-père.
- fr **kebdti** [2]: Je leur dis toujours : ce garçon est têtu comme son grand-père.
- es baseline [2]: Siempre les digo: este chico es tan terco como su abuelo.
- es **kebdti** [2]: Siempre les digo: este chico es tan terco como su abuelo.
- it baseline [2]: Dico sempre loro: questo ragazzo è testardo come suo nonno.
- it **kebdti** [2]: Dico sempre loro: questo ragazzo è testardo come suo nonno.

### f12 · neutral · الدنيا هانية هنا، غير الشتا ما بغاتش تطيح.
gold: _Everything is fine here, it just won't rain._
- en baseline [2]: Things are peaceful here; it’s just that the rain won’t fall.
- en **kebdti** [2]: Everything is quiet here; it just hasn’t rained.
- fr baseline [2]: Tout est tranquille ici, c’est juste que la pluie ne veut pas tomber.
- fr **kebdti** [2]: Ici, tout va bien, c’est juste qu’il n’a pas plu.
- es baseline [2]: Aquí todo está tranquilo, solo que no quiere llover.
- es **kebdti** [2]: Aquí todo está tranquilo, solo que no ha querido llover.
- it baseline [2]: Qui è tutto tranquillo, è solo che non vuole piovere.
- it **kebdti** [2]: Qui va tutto tranquillo, solo che non piove.

### f13 · neutral · صيفط ليا التصاور ديال العرس، بغيت نشوف شكون جا.
gold: _Send me the wedding photos, I want to see who came._
- en baseline [2]: Send me the wedding photos; I want to see who came.
- en **kebdti** [2]: Send me the wedding photos. I want to see who came.
- fr baseline [2]: Envoie-moi les photos du mariage, je veux voir qui est venu.
- fr **kebdti** [2]: Envoie-moi les photos du mariage, je veux voir qui est venu.
- es baseline [2]: Mándame las fotos de la boda, quiero ver quién vino.
- es **kebdti** [2]: Envíame las fotos de la boda. Quiero ver quién fue.
- it baseline [2]: Mandami le foto del matrimonio, voglio vedere chi è venuto.
- it **kebdti** [2]: Mandami le foto del matrimonio, voglio vedere chi è venuto.

### f14 · neutral · قول لماماك تجيب معاها الدوا ديالي من الفرمسيان.
gold: _Tell your mom to bring my medicine from the pharmacy._
- en baseline [2]: Tell your mom to bring my medicine from the pharmacy.
- en **kebdti** [2]: Tell your mother to pick up my medicine from the pharmacy and bring it with her.
- fr baseline [2]: Dis à ta mère de m’apporter mes médicaments en passant à la pharmacie.
- fr **kebdti** [2]: Dis à ta maman de rapporter mon médicament de la pharmacie.
- es baseline [2]: Dile a tu madre que me traiga mis medicamentos de la farmacia.
- es **kebdti** [2]: Dile a tu mamá que traiga mi medicina de la farmacia.
- it baseline [2]: Di’ a tua madre di portarmi i miei medicinali dalla farmacia.
- it **kebdti** [2]: Di' a tua madre di portare con sé la mia medicina dalla farmacia.

### f15 · blessing · الله يوصلك لداك الشي اللي فبالك أ وليدي، ونشوف ولادك قبل ما نموت.
gold: _May all your wishes come true, my boy, and may I see your children before I die._ · tricky: **يوصلك لداك الشي اللي فبالك**
- en baseline [2]: May God help you achieve what you wish for, my son, and may I see your children before I die.
- en **kebdti** [2]: I hope you achieve what you're hoping for, my son, and that I live to see your children before I die.
- fr baseline [2]: Que Dieu te permette d’accomplir ce que tu souhaites, mon fils, et que je puisse voir tes enfants avant de mourir.
- fr **kebdti** [2]: Que Dieu te permette d’accomplir tout ce que tu souhaites, mon grand, et que je puisse voir tes enfants avant de mourir.
- es baseline [2]: Que Dios te permita alcanzar lo que deseas, hijo mío, y que pueda ver a tus hijos antes de morir.
- es **kebdti** [2]: Que Dios te conceda eso que tienes en mente, hijo mío, y que pueda ver a tus hijos antes de morir.
- it baseline [2]: Che Dio ti permetta di realizzare ciò che desideri, figlio mio, e che io possa vedere i tuoi figli prima di morire.
- it **kebdti** [2]: Che Dio ti conceda ciò che desideri, figlio mio, e che io possa vedere i tuoi figli prima di morire.

### f16 · worry · واش باقي كتاكل غير الماكلة ديال الزنقة؟ وجهك ولا صفر فالتصويرة.
gold: _Are you still only eating street food? You look pale in the photo._ · tricky: **وجهك ولا صفر**
- en baseline [1 literal]: Are you still eating only street food? Your face looks all yellow in the photo.
- en **kebdti** [2]: Are you still eating nothing but street food? You look pale in the picture.
- fr baseline [1 literal]: Tu manges toujours uniquement de la nourriture de rue ? Sur la photo, tu as le visage tout jaune.
- fr **kebdti** [1 literal]: Tu manges toujours uniquement de la nourriture de la rue ? Sur la photo, tu as le visage tout jaune.
- es baseline [1 literal]: ¿Sigues comiendo solo comida callejera? En la foto tienes la cara amarilla.
- es **kebdti** [2]: ¿Sigues comiendo solo comida de la calle? En la foto tienes la cara muy pálida.
- it baseline [1 literal]: Mangi ancora solo cibo di strada? Nella foto hai la faccia tutta gialla.
- it **kebdti** [1 literal]: Mangi ancora solo cibo da strada? Nella foto hai il viso tutto giallo.

### f17 · proverb · حتى زين ما خطاتو لولا، وانتي زوينة وعاقلة.
gold: _Nobody is perfect, and you are beautiful and sensible._ · tricky: **حتى زين ما خطاتو لولا**
- en baseline [1 literal]: Even beauty didn’t escape the first one, and you’re beautiful and sensible.
- en **kebdti** [1 literal]: Even beauty wasn’t spared by the first one… and you’re beautiful and sensible.
- fr baseline [1 literal]: Même la beauté n’a pas échappé à la première, et toi, tu es belle et raisonnable.
- fr **kebdti** [1]: La beauté ne t’a pas oubliée : tu es belle et pleine de bon sens.
- es baseline [1 literal]: Ni siquiera la belleza se libró de la primera, y tú eres guapa y sensata.
- es **kebdti** [1]: Eres guapa y sensata; no hay nadie más bella que tú.
- it baseline [0 literal]: Nemmeno la bellezza è sfuggita alla prima, e tu sei bella e giudiziosa.
- it **kebdti** [0]: La bellezza non si è dimenticata di te, Lola: sei bella e giudiziosa.

### f18 · longing · ضربني الحنين ليك البارح، بقيت كنشوف فالتيليفون حتى نعست.
gold: _I missed you so much last night. I kept looking at my phone until I fell asleep._ · tricky: **ضربني الحنين**
- en baseline [2]: I missed you yesterday; I kept looking at my phone until I fell asleep.
- en **kebdti** [2]: I missed you yesterday and kept looking at my phone until I fell asleep.
- fr baseline [2]: Tu m’as manqué hier soir ; je n’ai pas arrêté de regarder mon téléphone jusqu’à ce que je m’endorme.
- fr **kebdti** [2]: Tu m’as tellement manqué hier… Je n’ai pas cessé de regarder le téléphone jusqu’à ce que je m’endorme.
- es baseline [2]: Ayer por la noche te eché de menos; no paré de mirar el móvil hasta que me dormí.
- es **kebdti** [2]: Ayer te extrañé muchísimo; me quedé mirando el teléfono hasta que me dormí.
- it baseline [2]: Ieri sera mi sei mancato/a; ho continuato a guardare il telefono finché non mi sono addormentato/a.
- it **kebdti** [2]: Ieri mi mancavi tanto. Ho continuato a guardare il telefono finché non mi sono addormentato/a.

### f19 · proverb · نتا وخوك بحال الظفر واللحم، ما تخليو حتى حاجة تفرقكم.
gold: _You and your brother are inseparable. Don't let anything come between you._ · tricky: **بحال الظفر واللحم**
- en baseline [1 literal]: You and your brother are like nail and flesh; don’t let anything come between you.
- en **kebdti** [2]: You and your brother are so close—don’t let anything come between you.
- fr baseline [1 literal]: Ton frère et toi, vous êtes comme l’ongle et la chair ; ne laissez rien vous séparer.
- fr **kebdti** [2]: Ton frère et toi, vous êtes inséparables. Ne laissez rien vous diviser.
- es baseline [2]: Tu hermano y tú sois como la uña y la carne; no dejéis que nada os separe.
- es **kebdti** [2]: Tú y tu hermano sois inseparables. No dejéis que nada se interponga entre vosotros.
- it baseline [1 literal]: Tu e tuo fratello siete come l’unghia e la carne; non lasciate che nulla vi separi.
- it **kebdti** [2]: Tu e tuo fratello siete inseparabili: non permettete a niente di mettervi l'uno contro l'altro.

### f20 · care · ما تبقاش تجري ورا الدنيا، الصحة هي الكنز أ بنتي.
gold: _Don't keep chasing after the world. Your health is the real treasure, my girl._ · tricky: **الصحة هي الكنز**
- en baseline [2]: Don’t chase after worldly things, my daughter; health is a treasure.
- en **kebdti** [2]: Don't keep chasing after worldly things; health is the real treasure, my daughter.
- fr baseline [2]: Ne cours pas après les biens de ce monde, ma fille : la santé est un trésor.
- fr **kebdti** [2]: Ne cours pas sans cesse après les choses de la vie ; la santé, c’est le vrai trésor, ma fille.
- es baseline [2]: No persigas las cosas materiales, hija mía: la salud es un tesoro.
- es **kebdti** [2]: No sigas corriendo detrás de las cosas de este mundo; la salud es el mayor tesoro, hija mía.
- it baseline [2]: Non rincorrere le cose materiali, figlia mia: la salute è un tesoro.
- it **kebdti** [2]: Non continuare a correre dietro alle cose del mondo: la salute è il vero tesoro, figlia mia.

## Into Darija, every message (for the Darija speaker to check)

- en1 (en) Grandma, I got my first job! I start on Monday. → **أ جدة، لقيت أول خدمة ليا! غادي نبدا نهار الحد.**
- en2 (en) I'm sorry I didn't call last week, exams were crazy. → **أ جدة، سمحي ليا ما عيطتش ليك السيمانة اللي فاتت، الامتحانات كانو قاصحين بزاف.**
- en3 (en) Can you send me your recipe for harira? Mine never tastes like yours. → **أ جدة، واش تقدري تصيفطي ليا الوصفة ديالك ديال الحريرة؟ ديالي عمرها ما كتجي بنينة بحال ديالك.**
- en4 (en) I dreamt about your house last night, the smell of mint tea. → **أ جدة، حلمت البارح بدارك وريحة أتاي بالنعناع.**
- en5 (en) Don't worry about me, I'm eating well and sleeping enough. → **أ جدة، ما تقلقيش عليا، راني كناكل مزيان وكنعس كفايتي.**
- es1 (es) Abuela, ¡aprobé todos los exámenes! → **أ جدة، نجحت فگاع الامتحانات!**
- es2 (es) Te echo muchísimo de menos, ¿cómo estás? → **أ جدة، توحشتك بزاف بزاف، كيف دايرة؟**
- es3 (es) Este verano voy a ir a verte, te lo prometo. → **أ جدة، هاد الصيف غادي نمشي نشوفك، كنواعدك.**
- es4 (es) Me he comprado una chilaba para la boda de mi prima. → **أ جدة، شريت جلابة لراسي للعرس ديال بنت عمي.**
- es5 (es) No te preocupes, el trabajo va bien. → **أ جدة، ما تقلقيش، الخدمة غادية مزيان.**
- fr1 (fr) Mamie, j'ai eu mon permis du premier coup ! → **أ جدة، خديت البيرمي من أول مرة!**
- fr2 (fr) Je pense fort à toi, prends soin de toi. → **أ جدة، كنفكر فيك بزاف، تهلاي فراسك.**
- fr3 (fr) On arrive le 3 juillet, prépare-nous des msemen ! → **أ جدة، غادي نوصلو نهار ثلاثة ديال يوليوز، وجدي لينا المسمن!**
- fr4 (fr) Désolée de ne pas avoir appelé, j'étais malade. → **أ جدة، سمحي ليا حيت ما عيطتش، كنت مريض.**
- fr5 (fr) Papa dit que tu as encore oublié tes médicaments… → **أ جدة، بابا قال ليا بلي عاوتاني نسيتي دواك…**
- it1 (it) Nonna, ho trovato un appartamento vicino all'università! → **أ جدة، لقيت شقة قريبة للافاك!**
- it2 (it) Mi manchi tanto, ti penso ogni giorno. → **أ جدة، توحشتك بزاف، وكنفكر فيك كل نهار.**
- it3 (it) Ho cucinato il tuo cuscus, ma non è buono come il tuo. → **أ جدة، طيبت الكسكسو ديالك، ولكن ما جاش بنين بحال ديالك.**
- it4 (it) Domani ho un colloquio, prega per me. → **أ جدة، غدا عندي انترفيو، دعيو معايا.**
- it5 (it) Scusa se non ti ho chiamata, ero stanchissimo. → **سمحي ليا أ جدة، ما عيطتش ليك، كنت عيان بزاف.**

API cost of baseline + judge calls reported by the gateway: $0.0396 (Kebdti calls go through the app's own provider order).