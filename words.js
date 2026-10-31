// Kategórie a slová. Každé slovo má za dvojbodkou nápovedu pre impostora:
// súvisí so slovom, ale neprezradí ho. Formát: "slovo:nápoveda".
// Novú kategóriu pridáš ako ďalší objekt (id bez diakritiky).
const KATEGORIE = [
  {
    id: "zvierata", name: "Zvieratá",
    words: ["pes:verný", "mačka:fúzy", "kôň:podkova", "krava:pasienok", "ovca:vlna", "koza:rohy", "prasa:blato",
      "zajac:skok", "líška:prefíkaná", "vlk:svorka", "medveď:brloh", "jeleň:parohy", "srna:les", "ježko:pichliače",
      "veverička:oriešky", "sova:noc", "orol:výška", "kačica:rybník", "sliepka:dvor", "labuť:biela", "žaba:mláka",
      "had:šupiny", "korytnačka:pomalá", "slon:chobot", "žirafa:savana", "lev:hriva", "tiger:pruhy", "opica:banán",
      "delfín:more", "žralok:zuby", "tučniak:ľad", "klokan:Austrália", "krokodíl:rieka", "papagáj:farby",
      "motýľ:kvet", "včela:med", "mravec:pracovitý", "pavúk:sieť", "netopier:jaskyňa", "kamzík:Tatry"]
  },
  {
    id: "jedlo", name: "Jedlo",
    words: ["pizza:Taliansko", "hamburger:rýchle občerstvenie", "halušky:bryndza", "palacinky:džem", "guláš:kotlík",
      "rezeň:strúhanka", "hranolky:soľ", "špagety:vidlička", "polievka:lyžica", "chlieb:pekáreň", "rožok:raňajky",
      "syr:diery", "šunka:sendvič", "vajíčko:sliepka", "jablko:strom", "banán:žltý", "jahoda:leto", "čerešňa:kôstka",
      "melón:šťavnatý", "zmrzlina:kornútok", "čokoláda:sladké", "torta:narodeniny", "koláč:babka", "popcorn:kino",
      "kečup:paradajky", "med:včely", "mlieko:krava", "jogurt:kelímok", "ryža:Ázia", "cesnak:vôňa", "lokše:zemiaky",
      "pirohy:cesto", "kapustnica:Vianoce", "sushi:Japonsko", "kebab:mäso", "cereálie:miska", "párky:horčica",
      "oriešky:škrupina", "zemiaky:pole", "mrkva:oranžová"]
  },
  {
    id: "sport", name: "Šport",
    words: ["futbal:gól", "hokej:korčule", "basketbal:kôš", "volejbal:sieť", "tenis:raketa", "stolný tenis:loptička",
      "bedminton:hala", "plávanie:bazén", "lyžovanie:svah", "snowboard:doska", "korčuľovanie:ľad", "cyklistika:prilba",
      "beh:tenisky", "box:rukavice", "judo:kimono", "karate:pás", "šach:ťah", "golf:jamka", "bowling:kolky",
      "šípky:terč", "lezenie:lano", "kanoistika:pádlo", "gymnastika:kladina", "atletika:štadión", "hádzaná:brankár",
      "florbal:hokejka", "skateboard:rampa", "posilňovňa:činky", "jazda na koni:sedlo", "rybárčenie:udica",
      "surfovanie:vlny", "biatlon:puška", "formula 1:okruh", "rugby:vajce", "baseball:pálka", "šerm:meč",
      "potápanie:kyslík", "kalistenika:hrazda", "parkour:skoky", "maratón:vytrvalosť"]
  },
  {
    id: "povolania", name: "Povolania",
    words: ["učiteľ:trieda", "lekár:stetoskop", "hasič:hadica", "policajt:uniforma", "kuchár:zástera", "pilot:kokpit",
      "kaderník:nožnice", "predavač:pokladňa", "šofér autobusu:zastávka", "zubár:kreslo", "zdravotná sestra:injekcia",
      "programátor:kód", "elektrikár:kábel", "inštalatér:potrubie", "murár:tehla", "farmár:traktor", "poštár:list",
      "záchranár:siréna", "veterinár:zvieratá", "herec:javisko", "spevák:mikrofón", "futbalista:dres", "novinár:článok",
      "fotograf:objektív", "právnik:súd", "astronaut:skafander", "smetiar:kontajner", "čašník:tácka",
      "pekár:skoro ráno", "lesník:strom", "youtuber:kamera", "kominár:šťastie", "krajčír:ihla",
      "archeológ:vykopávky", "sudca:kladivko", "architekt:plány", "automechanik:kľúč", "záhradník:hrable",
      "tréner:píšťalka", "DJ:hudba"]
  },
  {
    id: "miesta", name: "Miesta",
    words: ["škola:lavica", "nemocnica:posteľ", "letisko:kufor", "železničná stanica:nástupište", "kino:plátno",
      "divadlo:opona", "múzeum:exponát", "knižnica:ticho", "plaváreň:šatňa", "štadión:tribúna", "zoo:klietka",
      "kostol:zvon", "hrad:veža", "pláž:piesok", "jaskyňa:tma", "supermarket:vozík", "pošta:balík", "banka:trezor",
      "reštaurácia:menu", "kaviareň:šálka", "hotel:recepcia", "kemping:stan", "aquapark:šmykľavka",
      "lunapark:kolotoč", "farma:stodola", "lyžiarske stredisko:vlek", "benzínová pumpa:diaľnica",
      "ihrisko:hojdačka", "cintorín:sviečky", "kaderníctvo:zrkadlo", "obchodné centrum:eskalátor", "park:lavička",
      "policajná stanica:modré svetlá", "trh:stánok", "cirkus:klaun", "sauna:para", "autoservis:zdvihák",
      "planetárium:hviezdy", "oceánárium:ryby", "lekáreň:tabletky"]
  },
  {
    id: "dom", name: "Veci v dome",
    words: ["chladnička:studené", "práčka:bubon", "mikrovlnka:ohrev", "televízor:obrazovka", "gauč:obývačka",
      "posteľ:spánok", "stôl:nohy", "stolička:sedenie", "lampa:svetlo", "zrkadlo:odraz", "vankúš:mäkký",
      "perina:páperie", "hrnček:čaj", "tanier:obed", "lyžica:polievka", "vidlička:hroty", "nôž:ostrý",
      "hrniec:pokrievka", "vysávač:prach", "žehlička:košeľa", "sprcha:kúpeľňa", "vaňa:pena", "umývadlo:kohútik",
      "záchod:papier", "budík:ráno", "dáždnik:dážď", "kľúče:zámok", "diaľkový ovládač:gombíky", "kôš:odpadky",
      "kreslo:pohodlie", "rýchlovarná kanvica:voda", "fén:vlasy", "uterák:sušenie", "mydlo:pena",
      "zubná kefka:pasta", "závesy:okno", "koberec:podlaha", "hodiny:čas", "radiátor:teplo", "sporák:varenie",
      "umývačka riadu:kuchyňa"]
  },
  {
    id: "technika", name: "Technika",
    words: ["mobil:aplikácie", "notebook:prenosný", "tablet:dotyk", "slúchadlá:uši", "reproduktor:hlasitosť",
      "myš:kurzor", "klávesnica:písmená", "monitor:pixely", "tlačiareň:papier", "router:Wi-Fi", "nabíjačka:zásuvka",
      "powerbanka:na cesty", "smart hodinky:zápästie", "fotoaparát:fotka", "dron:vrtule", "herná konzola:televízor",
      "gamepad:tlačidlá", "USB kľúč:súbory", "Arduino:doska", "spájkovačka:cín", "batéria:energia",
      "žiarovka:objímka", "kalkulačka:čísla", "mikrofón:hlas", "webkamera:videohovor", "robot:umelá inteligencia",
      "3D tlačiareň:plast", "satelit:obežná dráha", "rádio:stanica", "GPS:navigácia", "VR okuliare:hlava",
      "procesor:výkon", "laser:lúč", "elektrická kolobežka:jazda", "solárny panel:slnko", "multimeter:meranie",
      "HDMI kábel:obraz", "elektromobil:nabíjanie", "projektor:plátno", "laboratórny zdroj:napätie"]
  },
  {
    id: "hry", name: "Videohry",
    words: ["Minecraft:kocky", "Fortnite:tanečky", "Roblox:avatar", "Among Us:vesmírna loď", "Super Mario:inštalatér",
      "Pokémon:chytanie", "FIFA:futbal", "GTA:mesto", "Tetris:rady", "Pac-Man:duchovia", "Zelda:princezná",
      "Sonic:rýchlosť", "Angry Birds:prak", "Candy Crush:sladkosti", "Clash Royale:karty", "Brawl Stars:mobil",
      "Call of Duty:vojna", "Valorant:agenti", "League of Legends:šampióni", "Counter-Strike:bomba",
      "Rocket League:autá", "Subway Surfers:koľajnice", "Geometry Dash:rytmus", "Fall Guys:prekážky",
      "Mario Kart:preteky", "Snake:Nokia", "Stardew Valley:farma", "The Sims:život", "Hollow Knight:hmyz",
      "Terraria:kopanie", "Animal Crossing:ostrov", "Overwatch:hrdinovia", "Apex Legends:skok z lode",
      "Doom:démoni", "Portal:teleport", "Halo:vesmír", "Wii Sports:pohyb", "Just Dance:tanec",
      "Plants vs. Zombies:záhrada", "Hitman:tajná misia", "Cyberpunk 2077:budúcnosť"]
  },
  {
    id: "filmy", name: "Rozprávky a filmy",
    words: ["Shrek:močiar", "Popoluška:črievička", "Snehulienka:trpaslíci", "Ľadové kráľovstvo:sestry",
      "Leví kráľ:Afrika", "Harry Potter:okuliare", "Pán prsteňov:hobit", "Star Wars:svetelný meč", "Mimoni:žltí",
      "Toy Story:hračky", "Hľadá sa Nemo:oceán", "Spider-Man:pavučina", "Batman:netopier", "Titanic:loď",
      "Jurský park:dinosaury", "Avatar:modrí", "Autá:preteky", "Ratatouille:kuchyňa", "Kocúr v čižmách:klobúk",
      "Červená čiapočka:babička", "Perníková chalúpka:ježibaba", "Pinocchio:nos", "Peter Pan:lietanie",
      "Aladin:lampa", "Malá morská víla:more", "Kráska a zviera:ruža", "Mrázik:palica", "Pat a Mat:kutilovia",
      "Krtko:nohavičky", "Kung Fu Panda:bojové umenia", "Madagaskar:ostrov", "Doba ľadová:mamut",
      "Asterix:čarovný nápoj", "Garfield:lazane", "Scooby-Doo:záhady", "Simpsonovci:Springfield",
      "Sám doma:Vianoce", "Indiana Jones:bič", "Piráti z Karibiku:kapitán", "V hlave:emócie"]
  },
  {
    id: "slovensko", name: "Slovensko",
    words: ["Tatry:štíty", "Gerlachovský štít:najvyšší", "Dunaj:loď", "Bratislavský hrad:štyri veže",
      "Spišský hrad:ruina", "Bojnický zámok:duchovia", "Devín:sútok", "Jánošík:opasok",
      "bryndzové halušky:národné jedlo", "Kofola:bublinky", "Horalky:oblátka", "Chopok:lanovka",
      "Štrbské Pleso:skokanské mostíky", "Slovenský raj:rebríky", "Dobšinská ľadová jaskyňa:podzemie", "Kriváň:symbol",
      "Košice:dóm", "Banská Štiavnica:baníci", "Vlkolínec:drevenice", "fujara:pastier", "valaška:sekerka",
      "kroj:folklór", "Ľudovít Štúr:spisovná reč", "oštiepok:údený", "Brezno:Horehronie", "Horehronie:Kráľova hoľa",
      "Demänovská jaskyňa:kvaple", "Oravský hrad:skala", "Piešťany:kúpele", "Bratislava:hlavné mesto",
      "Nitra:Zobor", "Žilina:Považie", "Čičmany:ornamenty", "Peter Sagan:bicykel", "Zdeno Chára:hokej",
      "Slavín:pamätník", "Most SNP:UFO", "Trnava:malý Rím", "Liptovská Mara:priehrada", "Malá Fatra:Jánošíkove diery"]
  },
  {
    id: "priroda", name: "Príroda",
    words: ["strom:listy", "rieka:prúd", "jazero:hladina", "more:soľ", "hora:vrchol", "sopka:láva", "vodopád:šum",
      "púšť:ťava", "dúha:farby", "blesk:búrka", "sneh:vločky", "dážď:kvapky", "hmla:viditeľnosť", "oblak:nebo",
      "slnko:teplo", "mesiac:noc", "hviezda:trblietanie", "ostrov:voda", "les:huby", "lúka:kvety", "kvet:vôňa",
      "tráva:zelená", "kameň:tvrdý", "piesok:zrnká", "ľadovec:topenie", "tornádo:vietor", "zemetrasenie:otrasy",
      "mráz:inovať", "západ slnka:večer", "huba:klobúk", "mach:vlhko", "kaktus:sucho", "dub:žalude",
      "jedľa:ihličie", "slnečnica:semienka", "tulipán:Holandsko", "ruža:tŕne", "pramen:začiatok", "močiar:bahno",
      "polárna žiara:sever", "jar:kvitnutie", "leto:prázdniny", "jeseň:lístie", "zima:sánky"]
  },
  {
    id: "doprava", name: "Doprava",
    words: ["auto:volant", "vlak:koľaje", "električka:mesto", "autobus:zastávka", "trolejbus:drôty", "metro:podzemie",
      "lietadlo:krídla", "vrtuľník:vrtule", "loď:prístav", "ponorka:hĺbka", "bicykel:pedále", "kolobežka:odrážanie",
      "motorka:prilba", "skúter:Taliansko", "traktor:pole", "sanitka:siréna", "hasičské auto:rebrík",
      "policajné auto:majáky", "taxík:taxameter", "kamión:náklad", "lanovka:kabínka", "raketa:štart",
      "teplovzdušný balón:kôš", "plachetnica:vietor", "kajak:pádlo", "čln:jazero", "sane:sneh", "bager:lopata",
      "žeriav:stavba", "limuzína:luxus", "dodávka:sťahovanie", "koč:kráľ", "karavan:kemping",
      "kolieskové korčule:kolieska", "segway:rovnováha", "výťah:poschodia", "zubačka:Tatry", "jachta:boháč",
      "hydroplán:voda"]
  },
  {
    id: "skola", name: "Škola",
    words: ["tabuľa:krieda", "krieda:prach", "lavica:sused", "žiacka knižka:podpis", "peračník:ceruzky",
      "ceruzka:strúhadlo", "guma:chyby", "pravítko:čiara", "zošit:linajky", "učebnica:kapitola", "školská taška:chrbát",
      "písomka:známka", "jednotka:výborný", "päťka:najhoršia", "prestávka:zvonenie", "zvonček:koniec hodiny",
      "riaditeľ:kancelária", "triedna učiteľka:triednická hodina", "telocvičňa:rebriny", "jedáleň:obed",
      "šatňa:vešiak", "prezuvky:nohy", "domáca úloha:večer", "vysvedčenie:jún", "prázdniny:leto",
      "maturita:stužková", "stužková:šerpa", "školský výlet:autobus", "lyžiarsky kurz:týždeň", "tanečné:valčík",
      "matematika:príklady", "slovenčina:diktát", "dejepis:roky", "zemepis:mapa", "fyzika:pokusy",
      "chémia:laboratórium", "biológia:bunka", "informatika:počítač", "telesná výchova:rozcvička",
      "nemčina:der die das", "angličtina:slovíčka", "ťahák:podvádzanie", "kružidlo:hrot", "nástenka:plagát",
      "krúžok:poobede", "zborovňa:učitelia"]
  },
  {
    id: "oblecenie", name: "Oblečenie",
    words: ["tričko:krátke rukávy", "mikina:kapucňa", "sveter:vlna", "bunda:zips", "kabát:vešiak", "rifle:denim",
      "šortky:leto", "sukňa:otáčanie", "šaty:ples", "oblek:svadba", "kravata:uzol", "košeľa:gombíky",
      "tepláky:gumička", "pyžamo:večer", "ponožky:páry", "topánky:šnúrky", "tenisky:podrážka", "čižmy:vysoké",
      "papuče:doma", "šľapky:bazén", "čiapka:hlava", "šál:krk", "rukavice:prsty", "opasok:pracka",
      "slnečné okuliare:UV", "klobúk:krempa", "šiltovka:otočená", "plavky:voda", "pláštenka:dážď",
      "kombinéza:sneh", "legíny:elastické", "vesta:bez rukávov", "montérky:práca", "sako:formálne",
      "náhrdelník:šperk", "náramok:ruka", "prsteň:zásnuby", "župan:kúpeľňa", "uniforma:rovnaké",
      "nákrčník:vietor", "batoh:turistika", "kabelka:rameno"]
  },
  {
    id: "hudba", name: "Hudba",
    words: ["klavír:pedál", "gitara:struny", "bicie:paličky", "husle:sláčik", "flauta:dych", "trúbka:hlasná",
      "saxofón:jazz", "harmonika:mech", "violončelo:veľké", "kontrabas:obrovský", "ukulele:Havaj", "harfa:anjel",
      "bubon:rytmus", "xylofón:tóny", "triangel:cink", "rap:rýmy", "rock:dlhé vlasy", "pop:hitparáda",
      "metal:čierna", "jazz:improvizácia", "ľudová hudba:folklór", "techno:beat", "opera:árie",
      "vážna hudba:Mozart", "koncert:pódium", "festival:Pohoda", "karaoke:texty", "orchester:dirigent",
      "kapela:skúška", "zbor:hlasy", "noty:husľový kľúč", "metronóm:tempo", "playlist:Spotify",
      "vinyl:gramofón", "Eurovízia:súťaž", "hymna:vstať", "valčík:raz dva tri", "beatbox:ústa",
      "refrén:opakovanie", "dirigent:taktovka"]
  },
  {
    id: "krajiny", name: "Krajiny",
    words: ["Taliansko:čižma", "Francúzsko:bageta", "Nemecko:diaľnice", "Česko:knedle", "Poľsko:Krakov",
      "Maďarsko:Balaton", "Rakúsko:Alpy", "Španielsko:paella", "Anglicko:čaj", "USA:New York", "Kanada:javor",
      "Mexiko:sombrero", "Brazília:karneval", "Argentína:Messi", "Japonsko:sushi", "Čína:múr", "India:korenie",
      "Austrália:klokan", "Egypt:pyramídy", "Grécko:Akropola", "Chorvátsko:dovolenka", "Turecko:kebab",
      "Rusko:matriošky", "Ukrajina:boršč", "Švajčiarsko:banky", "Holandsko:tulipány", "Nórsko:fjordy",
      "Island:gejzíry", "Fínsko:jazerá", "Švédsko:IKEA", "Portugalsko:Ronaldo", "Írsko:zelená", "Škótsko:gajdy",
      "Južná Kórea:K-pop", "Thajsko:chrámy", "Keňa:safari", "Kuba:retro autá", "Jamajka:reggae", "Peru:lamy",
      "Nový Zéland:hobiti"]
  },
  {
    id: "sviatky", name: "Sviatky a akcie",
    words: ["Vianoce:stromček", "Veľká noc:kraslice", "Silvester:ohňostroj", "Nový rok:predsavzatia",
      "Halloween:tekvica", "narodeniny:darčeky", "meniny:kalendár", "svadba:obrúčky", "Valentín:srdce",
      "Deň matiek:kytica", "Mikuláš:sladkosti", "fašiangy:masky", "Dušičky:sviečky", "ples:polonéza",
      "promócia:diplom", "krst:bábätko", "pyžamová párty:spacák", "grilovačka:klobásy", "piknik:deka",
      "rodinný obed:nedeľa", "olympiáda:medaily", "MS v hokeji:fandenie", "prvý školský deň:september",
      "Deň detí:súťaže", "prvý sneh:sánkovanie", "dovolenka:kufre", "Štedrý večer:kapor", "Traja králi:koledníci",
      "Deň Zeme:planéta", "rozlúčka:posledný deň", "stretávka:spolužiaci", "maškarný bál:kostým",
      "jarmok:trdelník", "dožinky:úroda", "Deň otcov:kravata"]
  }
];
