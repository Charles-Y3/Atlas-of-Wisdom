import { localized } from '../i18n/types';
import type { LegendaryPlace } from './types';

/**
 * Legendary / disputed places — stories humans keep retelling, not verified
 * atlas entries. Candidate coordinates mark where people have *looked*, not
 * where anything has been proven. Voice: why the story endures.
 */
export const LEGENDS: LegendaryPlace[] = [
  {
    id: 'atlantis',
    name: localized('Atlantis', '亚特兰蒂斯'),
    emoji: '🌊',
    claimedLocations: [
      {
        coords: [25.461, 36.393],
        label: localized('Santorini (Thera), Aegean Sea', '圣托里尼（锡拉），爱琴海'),
      },
      {
        coords: [-5.6, 36.0],
        label: localized('Beyond the Pillars of Hercules (Strait of Gibraltar)', '赫拉克勒斯之柱以外（直布罗陀海峡）'),
      },
      {
        coords: [-28.0, 38.5],
        label: localized('Mid-Atlantic / Azores region', '大西洋中部 / 亚速尔一带'),
      },
    ],
    firstSource: localized(
      'Plato\'s dialogues Timaeus and Critias (c. 360 BC) — a tale said to come from Egyptian priests via Solon.',
      '柏拉图对话录《蒂迈欧篇》与《克里提亚斯篇》（约公元前360年）— 据说经由梭伦从埃及祭司那里听来的故事。',
    ),
    theWhyItPersists: localized(
      [
        'Atlantis is less a lost island than a mirror. Plato told of a great power that grew arrogant and was swallowed by the sea — a warning dressed as geography. Every age since has redrawn the map to fit its own anxieties: empire, catastrophe, the dream of a wiser beginning.',
        'We keep looking because the story promises that somewhere, under water or under time, there was a civilization that got it right — and then fell. The search is rarely only for ruins. It is for a lesson we are not finished learning.',
      ],
      [
        '亚特兰蒂斯与其说是一座失落的岛，不如说是一面镜子。柏拉图讲的是一个日益傲慢、终被大海吞没的强国 — 用地理包装的警示。此后每个时代都按自己的焦虑重画这张地图：帝国、灾变、以及一个更智慧开端的梦。',
        '人们不断寻找，是因为故事承诺：在水下或时间之下，曾有一个“做对了”却又坠落的文明。搜寻往往不只是为了废墟，而是为了一堂我们尚未学完的课。',
      ],
    ),
    leadingTheories: [
      {
        title: localized('Moral allegory', '道德寓言'),
        summary: localized(
          'Many classicists read Atlantis as Plato\'s invention — a parable about hubris and ideal states, not a travel report.',
          '许多古典学者视亚特兰蒂斯为柏拉图的虚构 — 关于傲慢与理想城邦的寓言，而非游记。',
        ),
      },
      {
        title: localized('Minoan echo (Thera)', '米诺斯回响（锡拉）'),
        summary: localized(
          'The Bronze Age eruption of Thera devastated Aegean cultures; some see a folk memory of that disaster behind Plato\'s flood.',
          '青铜时代锡拉火山喷发重创爱琴文明；有人认为柏拉图洪水故事背后，是这场灾变的民间记忆。',
        ),
      },
      {
        title: localized('Atlantic speculation', '大西洋猜想'),
        summary: localized(
          'From Renaissance mapmakers to modern fringe writers, the ocean west of Gibraltar has been combed for a literal sunken continent — evidence remains contested or absent.',
          '从文艺复兴制图师到现代边缘作者，直布罗陀以西的大洋被反复搜寻，以求一块真正沉没的大陆 — 证据仍有争议或阙如。',
        ),
      },
    ],
  },
  {
    id: 'lemuria',
    name: localized('Lemuria / Mu', '列穆里亚 / 穆大陆'),
    emoji: '🏝️',
    claimedLocations: [
      {
        coords: [70.0, -15.0],
        label: localized('Indian Ocean (classical Lemuria hypothesis)', '印度洋（经典列穆里亚假说）'),
      },
      {
        coords: [-140.0, 0.0],
        label: localized('Central Pacific (Mu tradition)', '太平洋中部（穆大陆传统）'),
      },
      {
        coords: [46.5, -18.8],
        label: localized('Madagascar region (lemur-biogeography link)', '马达加斯加一带（与狐猴生物地理相关）'),
      },
    ],
    firstSource: localized(
      '19th-century science first: Philip Sclater\'s "Lemuria" (1864) to explain lemur fossils; later blended with occult and Pacific "Mu" lore (Churchward and others).',
      '先出自十九世纪科学：菲利普·斯克莱特1864年提出“列穆里亚”以解释狐猴化石分布；后与神秘学及太平洋“穆大陆”传说（丘奇沃德等）相互糅合。',
    ),
    theWhyItPersists: localized(
      [
        'Lemuria began as a bridge for animals — a hypothetical land to explain why related creatures lived on separated shores. Then storytellers moved in. The missing continent became a cradle of lost wisdom, a Pacific twin to Atlantis, a stage for every longing that science had left unnamed.',
        'What endures is the hunger for a forgotten homeland of the spirit: a place that sank so that we might still imagine rising again. Geology closed the old land-bridge idea; the myth simply found new oceans to inhabit.',
      ],
      [
        '列穆里亚起初是为动物搭的桥 — 一块假想陆地，用来解释近缘生物为何分居远岸。随后讲故事的人住了进来。失落的大陆成了失落智慧的摇篮，成了亚特兰蒂斯的太平洋孪生，成了科学尚未命名的种种渴望的舞台。',
        '持久的是对精神故乡的饥渴：一个沉没了、好让我们仍能想象再度升起的地方。地质学关上了旧日陆桥假说的门；神话只是换了片海洋继续栖居。',
      ],
    ),
    leadingTheories: [
      {
        title: localized('Obsolete biogeography', '过时的生物地理学'),
        summary: localized(
          'Continental drift and plate tectonics removed the need for a sunken Indo-Pacific land bridge; lemurs\' story is told differently now.',
          '大陆漂移与板块构造不再需要沉没的印度—太平洋陆桥；狐猴的故事如今有了别的讲法。',
        ),
      },
      {
        title: localized('Theosophical continent', '神智学大陆'),
        summary: localized(
          'Late-19th-century occult writers cast Lemuria as an earlier root-race homeland — influential in esoteric circles, not in earth science.',
          '十九世纪末神秘学作者将列穆里亚写成更早“根种族”的故乡 — 在玄学圈影响深远，但不属地球科学。',
        ),
      },
      {
        title: localized('Mu and Pacific lore', '穆大陆与太平洋传说'),
        summary: localized(
          'James Churchward\'s Mu placed a lost civilization under the Pacific; archaeologists treat it as modern myth-making layered on real island cultures.',
          '詹姆斯·丘奇沃德的穆大陆把失落文明置于太平洋之下；考古学者视之为叠在真实岛屿文化之上的现代造神话。',
        ),
      },
    ],
  },
  {
    id: 'shambhala',
    name: localized('Shambhala', '香巴拉'),
    emoji: '🕉️',
    claimedLocations: [
      {
        coords: [91.12, 32.5],
        label: localized('Northern Tibet / Changthang highlands', '藏北 / 羌塘高原'),
      },
      {
        coords: [88.0, 49.0],
        label: localized('Altai–Sayan region (Inner Asian readings)', '阿尔泰—萨彦一带（内亚读法）'),
      },
      {
        coords: [79.0, 34.0],
        label: localized('Western Himalaya approaches', '西喜马拉雅接近带'),
      },
    ],
    firstSource: localized(
      'Kalachakra Tantra and Tibetan Buddhist tradition — a hidden pure land ruled by wise kings, reachable by inner practice as much as by travel.',
      '《时轮金刚续》与藏传佛教传统 — 由智王统治的隐秘净土，抵达它既靠行脚，更靠内修。',
    ),
    theWhyItPersists: localized(
      [
        'Shambhala is a kingdom you cannot storm. In the Kalachakra teachings it is a realm of awakened society — sometimes drawn on maps of Inner Asia, always guarded by the idea that only the prepared heart finds the way. Empires have hunted it; pilgrims have sought it; none have put it in a museum.',
        'The story lasts because it refuses to be only geography. It is a promise that peace can be organized, that wisdom can rule a city, that somewhere north of ordinary fear there is still a court of calm. Related temples like the Potala keep the living tradition visible while the hidden land stays intentionally out of reach.',
      ],
      [
        '香巴拉是一座无法强攻的王国。在时轮教法里，它是觉醒社会的国度 — 有时被画进内亚地图，却始终由“唯有准备好的心才能找到路”这一观念守护。帝国搜寻过它，朝圣者寻找过它；无人能把它放进博物馆。',
        '故事流传，因为它拒绝只做地理。它承诺和平可以被组织，智慧可以治理一座城，在日常恐惧以北，仍有一座宁静的宫廷。布达拉宫等圣地让活传统可见，而隐秘国土则故意保持不可抵达。',
      ],
    ),
    leadingTheories: [
      {
        title: localized('Pure land / mandala', '净土 / 曼荼罗'),
        summary: localized(
          'Many teachers treat Shambhala as a visionary or inner landscape — a pattern of mind and ethics more than a GPS pin.',
          '许多上师视香巴拉为观想或内心风景 — 心与伦理的图式，而非一个定位坐标。',
        ),
      },
      {
        title: localized('Hidden Himalayan kingdom', '隐秘的喜马拉雅王国'),
        summary: localized(
          'Folk and travel lore place it beyond passes in Tibet or nearby ranges; no verified capital has ever been documented.',
          '民间与游记传统把它置于西藏或邻近山脉的关隘之外；从未有经核实的都城被记载。',
        ),
      },
      {
        title: localized('Western Shangri-La echo', '西方香格里拉回响'),
        summary: localized(
          'Hilton\'s Shangri-La borrowed the longing; modern tourism sometimes blurs novel, tantra, and Tibetan place-names into one soft myth.',
          '希尔顿的香格里拉借用了这份渴望；现代旅游有时把小说、密续与西藏地名揉成一团柔光神话。',
        ),
      },
    ],
    relatedRealPlace: 'potala-palace',
  },
  {
    id: 'el-dorado',
    name: localized('El Dorado', '埃尔多拉多'),
    emoji: '✨',
    claimedLocations: [
      {
        coords: [-73.779, 4.978],
        label: localized('Lake Guatavita, Colombia (Muisca rite)', '瓜塔维塔湖，哥伦比亚（穆伊斯卡礼仪）'),
      },
      {
        coords: [-61.0, 5.0],
        label: localized('Guiana Highlands / Manoa of the explorers', '圭亚那高原 / 探险家口中的马诺亚'),
      },
      {
        coords: [-70.0, -3.0],
        label: localized('Upper Amazon basin (later quests)', '上亚马孙盆地（后期寻访）'),
      },
    ],
    firstSource: localized(
      'Spanish colonial reports of a Muisca ritual — a zipa dusted in gold entering a highland lake — later swollen into a golden city.',
      '西班牙殖民时期关于穆伊斯卡礼仪的记述 — 一位周身敷金的齐帕首领走入高原湖泊 — 后来膨胀成一座黄金之城。',
    ),
    theWhyItPersists: localized(
      [
        'El Dorado began as a person, then became a city, then a fever. Conquistadors chased a gleam across rivers and graves; maps filled with lakes that promised wealth without end. The gold was real enough in the Andes — the endless city was the European dream projected onto other people\'s sacred water.',
        'We still say the name when we mean an unreachable prize. The story endures as a warning dressed in splendour: how desire redraws the land, and how someone else\'s ceremony can be mistaken for an invitation to take everything.',
      ],
      [
        '埃尔多拉多起于一个人，变成一座城，再变成一场热病。征服者追着金光越过河流与坟墓；地图上布满许诺无尽财富的湖泊。安第斯的黄金足够真实 — 那座无尽之城，却是欧洲人的梦，投射在他人的圣水之上。',
        '当我们说起一个够不着的奖赏，仍会用这个名字。故事以华美为衣，实为警示：欲望如何重绘大地，以及他人的礼仪如何被误读成予取予求的邀请。',
      ],
    ),
    leadingTheories: [
      {
        title: localized('Muisca lake ceremony', '穆伊斯卡湖祭'),
        summary: localized(
          'Archaeology and ethnohistory support gold offerings at Guatavita; the "gilded man" is better attested than any golden metropolis.',
          '考古与民族史支持瓜塔维塔的金器献祭；“金人”比任何黄金大都更有依据。',
        ),
      },
      {
        title: localized('Explorer mirage (Manoa)', '探险家蜃景（马诺亚）'),
        summary: localized(
          'Raleigh and others hunted a city in Guiana; the quest mixed Indigenous reports, rival gossip, and imperial hope.',
          '罗利等人在圭亚那寻城；探寻混合了原住民见闻、对手传闻与帝国希望。',
        ),
      },
      {
        title: localized('Metaphor of greed', '贪婪的隐喻'),
        summary: localized(
          'In literature and everyday speech, El Dorado is the prize that destroys the seeker — a moral more durable than any ruin.',
          '在文学与日常言语里，埃尔多拉多是毁掉寻宝者的奖赏 — 比任何废墟更耐久的寓意。',
        ),
      },
    ],
  },
  {
    id: 'hyperborea',
    name: localized('Hyperborea', '极北之地'),
    emoji: '❄️',
    claimedLocations: [
      {
        coords: [30.0, 70.0],
        label: localized('Far Arctic north (classical "beyond the north wind")', '极北冰原（古典“北风之外”）'),
      },
      {
        coords: [15.0, 64.0],
        label: localized('Scandinavia / northern Europe', '斯堪的纳维亚 / 北欧'),
      },
      {
        coords: [34.0, 45.5],
        label: localized('North of the Black Sea (some ancient geographies)', '黑海以北（部分古代地理）'),
      },
    ],
    firstSource: localized(
      'Archaic and Classical Greek poetry and geography — a blessed people "beyond Boreas," linked in myth to Apollo.',
      '古希腊古风与古典时期的诗歌与地理 — “北风之外”的幸福之民，神话中与阿波罗相连。',
    ),
    theWhyItPersists: localized(
      [
        'Hyperborea is the north as paradise: long light, gentle age, a people Apollo loved. Greeks who never wintered on the ice still needed a place where the god\'s arrows of plague could not reach — so they put bliss past the wind itself.',
        'Later ages reused the name for race myths and nationalist fantasies the ancients did not write. The honest thread that remains is older and quieter: the human wish that somewhere, at the edge of the map, life is kinder than here.',
      ],
      [
        '极北之地是作为天堂的北方：长日照、和缓的岁月、阿波罗所爱的人民。从未在冰原过冬的希腊人，仍需要一个瘟疫之箭够不着的地方 — 于是他们把福乐放在风的彼岸。',
        '后世盗用这个名字，写成古人并未写下的种族神话与国族幻想。真正耐久的线索更古老也更安静：人希望在地图边缘，生活比此处更仁慈。',
      ],
    ),
    leadingTheories: [
      {
        title: localized('Mythic geography', '神话地理'),
        summary: localized(
          'Most scholars treat Hyperborea as a poetic elsewhere — useful for cult and catalogue, not a surveyor\'s report.',
          '多数学者视极北之地为诗意的“别处” — 服务于祭仪与地理罗列，而非测绘报告。',
        ),
      },
      {
        title: localized('Distant real north', '遥远的真实北方'),
        summary: localized(
          'Some ancients stretched the name toward Scythia or the far north; travellers\' scraps may have fed the legend without proving a golden land.',
          '部分古人把名称伸向斯基泰或更北；旅人的片言或滋养了传说，却证明不了一片黄金乐土。',
        ),
      },
      {
        title: localized('Apollo\'s cult landscape', '阿波罗的祭仪景观'),
        summary: localized(
          'Hyperboreans appear in Delphic and Apollonian lore as gift-bearers from afar — the "place" may be a sacred relationship more than a country.',
          '极北民在德尔斐与阿波罗传说中以远方献礼者出现 — 这“地方”更像神圣关系，而非国度。',
        ),
      },
    ],
    relatedRealPlace: 'delphi',
  },
  {
    id: 'avalon',
    name: localized('Avalon', '阿瓦隆'),
    emoji: '🍎',
    claimedLocations: [
      {
        coords: [-2.699, 51.144],
        label: localized('Glastonbury Tor, Somerset', '格拉斯顿伯里巨石山，萨默塞特'),
      },
      {
        coords: [-2.71, 51.15],
        label: localized('Isle of Avalon (Somerset Levels once watery)', '阿瓦隆岛（昔日多水的萨默塞特低地）'),
      },
      {
        coords: [-4.75, 50.44],
        label: localized('Cornish / western British otherworld fringe', '康沃尔 / 不列颠西部异界边缘'),
      },
    ],
    firstSource: localized(
      'Medieval Arthurian tradition — Geoffrey of Monmouth and later romances: the isle of apples where Arthur is taken to heal.',
      '中世纪亚瑟王传统 — 蒙茅斯的杰弗里与后世传奇：亚瑟被送去疗伤的苹果之岛。',
    ),
    theWhyItPersists: localized(
      [
        'Avalon is the island that appears when the story needs mercy. Wounded kings sail there; apples and mist stand in for a kind of healing the battlefield cannot give. Glastonbury\'s tor rises like an island over once-flooded levels, so the landscape itself seemed to wink at the tale.',
        'People return to Avalon because endings hurt. The legend does not swear the king is dead — only that he rests where apples grow and the veil is thin. Hope, in other words, with a coastline.',
      ],
      [
        '阿瓦隆是故事需要慈悲时浮现的岛。受伤的王驶向那里；苹果与雾气代替战场给不了的疗愈。格拉斯顿伯里的山丘在曾被水漫过的低地上如岛耸立，风景本身仿佛对传说眨了眨眼。',
        '人们回到阿瓦隆，因为结局令人疼痛。传说并不发誓王已死去 — 只说他在苹果生长、薄纱轻隔之处安息。换言之：带着海岸线的希望。',
      ],
    ),
    leadingTheories: [
      {
        title: localized('Literary otherworld', '文学中的异界'),
        summary: localized(
          'Romance scholars often read Avalon as a Celtic-tinged paradise of narrative, not a missing county on the Ordnance Survey.',
          '传奇研究者常视阿瓦隆为带凯尔特色彩的叙事天堂，而非测绘地图上缺了一郡。',
        ),
      },
      {
        title: localized('Glastonbury identification', '格拉斯顿伯里比定'),
        summary: localized(
          'Monks and later antiquarians tied Avalon to Glastonbury; pilgrimage and poetry reinforced the link more than hard proof.',
          '修士与后世古物学者将阿瓦隆系于格拉斯顿伯里；朝圣与诗歌比硬证据更能加固这层联系。',
        ),
      },
      {
        title: localized('Pre-Christian echo', '前基督教回响'),
        summary: localized(
          'Some see older island-otherworld motifs behind the apple isle; the medieval text remains our clearest doorway.',
          '有人在苹果岛背后看见更古老的岛上异界母题；中世纪文本仍是最清晰的入口。',
        ),
      },
    ],
  },
  {
    id: 'kumari-kandam',
    name: localized('Kumari Kandam', '库马里坎达姆'),
    emoji: '🌏',
    claimedLocations: [
      {
        coords: [80.0, 5.0],
        label: localized('South of Kanyakumari / Indian Ocean shelf', '根尼亚古马里以南 / 印度洋陆架'),
      },
      {
        coords: [78.12, 9.93],
        label: localized('Madurai cultural heartland (as memory-anchor)', '马杜赖文化腹地（作为记忆锚点）'),
      },
      {
        coords: [77.54, 8.08],
        label: localized('Kanyakumari cape — traditional southern tip', '根尼亚古马里岬 — 传统南端'),
      },
    ],
    firstSource: localized(
      'Modern Tamil revival and literary tradition (19th–20th c.), drawing on older Sangam-era memory of lost southern lands and Pandyan lore.',
      '近代泰米尔复兴与文学传统（十九至二十世纪），接续更古老的桑伽姆时代对失落南方土地及潘迪亚传说的记忆。',
    ),
    theWhyItPersists: localized(
      [
        'Kumari Kandam is a sunken south — a vast Tamil homeland said to have slipped beneath the ocean, taking academies and kings with it. Whether read as deep-time geology or as cultural epic, it answers a tender question: where did our oldest songs begin?',
        'The story endures because language and pride need a cradle. When maps and empires pressed from the north, the ocean-south offered a origin no conqueror could occupy. It is less a claim to dig up than a claim to belong.',
      ],
      [
        '库马里坎达姆是沉没的南方 — 一片据说滑入海中的广袤泰米尔故土，学院与诸王一并沉没。无论读作深时地质还是文化史诗，它回应一个温柔的问题：我们最古老的歌，从何处起唱？',
        '故事流传，因为语言与尊严需要摇篮。当地图与帝国自北方逼近，海洋之南提供了一个征服者无法占领的起源。与其说是可挖掘的主张，不如说是归属的主张。',
      ],
    ),
    leadingTheories: [
      {
        title: localized('Cultural origin myth', '文化起源神话'),
        summary: localized(
          'Historians often frame Kumari Kandam as a modern nationalist and literary construction built on genuine love of Sangam antiquity.',
          '历史学者常将库马里坎达姆视为近代国族与文学建构，根植于对桑伽姆古史的真诚热爱。',
        ),
      },
      {
        title: localized('Sea-level memory', '海平面记忆'),
        summary: localized(
          'Post-glacial rising seas did reshape coasts; some link local flooding memories to the legend without proving a lost supercontinent.',
          '冰期后海平面上升确实重塑海岸；有人将地方洪水记忆与传说相连，却证明不了一块失落的超大陆。',
        ),
      },
      {
        title: localized('Lemuria crossover', '与列穆里亚交叠'),
        summary: localized(
          'Colonial-era Lemuria ideas were sometimes folded into Tamil narratives; the strands are entangled but not identical.',
          '殖民时代的列穆里亚观念有时被织进泰米尔叙事；线索纠缠，却并不等同。',
        ),
      },
    ],
  },
  {
    id: 'yonaguni',
    name: localized('Yonaguni Monument', '与那国岛海底遗迹'),
    emoji: '🪨',
    claimedLocations: [
      {
        coords: [123.007, 24.435],
        label: localized('Yonaguni, Yaeyama Islands, Japan (submerged terrace)', '日本八重山·与那国岛（水下阶地）'),
      },
    ],
    firstSource: localized(
      '1986 discovery by divers off Yonaguni; popularized amid debate between natural geology and human modification.',
      '1986年由潜水者在与那国岛海域发现；在天然地质与人工改造的争论中广为人知。',
    ),
    theWhyItPersists: localized(
      [
        'Yonaguni is the bridge case: a real formation you can dive to, photographed and measured, yet still argued over like a legend. Steps, right angles, and flat faces look like architecture until a geologist points to sandstone, tectonic tilt, and the sea\'s patient saw.',
        'We keep telling the story because the line between ruin and rock is exactly where wonder lives. Whether quarry or quarry of nature, the site asks the same human question: did we already build here once — or does the earth sometimes imitate our hands?',
      ],
      [
        '与那国是“桥梁案例”：一处你可潜至、可拍摄测量的真实构造，却仍像传说般被争论。阶梯、直角与平面看似建筑，直到地质学者指出砂岩、构造倾斜与大海耐心的切割。',
        '故事不断被讲述，因为废墟与岩石的界线，正是惊奇居住之处。无论采石场还是自然的采石，这地点问的是同一个问题：我们是否曾在此建造 — 还是大地有时模仿我们的手？',
      ],
    ),
    leadingTheories: [
      {
        title: localized('Natural sandstone geology', '天然砂岩地质'),
        summary: localized(
          'Many geologists argue parallel bedding, wave erosion, and faulting can produce the terraces without human hands.',
          '许多地质学者认为平行层理、波浪侵蚀与断层即可形成阶地，无需人手。',
        ),
      },
      {
        title: localized('Partly worked stone', '部分经人工修整'),
        summary: localized(
          'Some researchers allow natural origin with limited carving or quarrying during lower sea levels — still unproven as a city.',
          '一些研究者承认自然成因，并允许在较低海平面时期存在有限开凿或采石 — 仍未证明为城市。',
        ),
      },
      {
        title: localized('Lost-civilization reading', '失落文明读法'),
        summary: localized(
          'Popular books cast the monument as a sunken megalithic complex; mainstream archaeology has not confirmed that claim.',
          '通俗书籍将其写成沉没的巨石建筑群；主流考古学尚未确认这一说法。',
        ),
      },
    ],
  },
  {
    id: 'thule',
    name: localized('Thule', '图勒'),
    emoji: '🧭',
    claimedLocations: [
      {
        coords: [-19.0, 65.0],
        label: localized('Iceland (a frequent classical–medieval match)', '冰岛（古典—中世纪常见比定）'),
      },
      {
        coords: [-1.3, 60.4],
        label: localized('Shetland / northern British isles', '设得兰 / 不列颠群岛北部'),
      },
      {
        coords: [-40.0, 72.0],
        label: localized('Greenland (later "ultima Thule" readings)', '格陵兰（后世“终极图勒”读法）'),
      },
    ],
    firstSource: localized(
      'Pytheas of Massalia (4th century BC), reported via later writers — a far-northern land of long days and frozen seas.',
      '马萨利亚的皮提亚斯（公元前四世纪），经后世作家转述 — 一片白昼漫长、海面冰结的极北之地。',
    ),
    theWhyItPersists: localized(
      [
        'Thule is the label the Mediterranean stuck on the edge of the known. Pytheas sailed toward nights that barely fell; later librarians turned his report into a proverb — ultima Thule, the farthest place. Every century pinned the name on a new island when the old one became too familiar.',
        'The story lasts because maps need a horizon. Thule is less a town than a direction: the courage to say "we went that far," and the humility to admit the account arrived second-hand, salt-stained, and forever slightly out of reach.',
      ],
      [
        '图勒是地中海世界贴在已知边缘的标签。皮提亚斯驶向几乎不落的夜；后世的图书管理者把他的见闻变成谚语 — ultima Thule，最远之地。每当旧岛变得太熟悉，每个世纪就把这名字钉上新的岛。',
        '故事流传，因为地图需要地平线。图勒与其说是一座城，不如说是一个方向：说出“我们走到了那么远”的勇气，以及承认记述来自二手、沾着盐渍、永远稍稍够不着的谦卑。',
      ],
    ),
    leadingTheories: [
      {
        title: localized('Iceland or Norway', '冰岛或挪威'),
        summary: localized(
          'Common scholarly guesses place Pytheas\'s Thule in Iceland or coastal Norway — plausible, not sealed.',
          '常见学术猜测将皮提亚斯的图勒置于冰岛或挪威沿岸 — 合理，但未盖棺。',
        ),
      },
      {
        title: localized('Shetland / Orkney', '设得兰 / 奥克尼'),
        summary: localized(
          'British-isles candidates fit sailing ranges from Britain; ancient day-length clues are ambiguous.',
          '不列颠群岛候选地符合自不列颠出航的航程；古代日照线索则含糊。',
        ),
      },
      {
        title: localized('Moving frontier', '移动的边疆'),
        summary: localized(
          'In poetry and politics, Thule simply means "farthest north" — a migrating idea more than one fixed shore.',
          '在诗歌与政治里，图勒只表示“最北” — 迁移的观念，多于固定的海岸。',
        ),
      },
    ],
  },
];

export const LEGEND_BY_ID: Record<string, LegendaryPlace> = Object.fromEntries(
  LEGENDS.map((l) => [l.id, l]),
);
