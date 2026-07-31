import { localized, type Localized } from '../i18n/types';
import { rankMeets, RANK_FEATURE } from '../engine/progression';

/**
 * Hint-driven pilgrimages: each stop shows a clue only — never the place
 * name — until the explorer confirms it via the guess form (country + place).
 */
export interface QuestStep {
  /** Secret target location id — never shown until found. */
  id: string;
  hint: Localized<string>;
}

export type QuestKind =
  | 'pilgrimage'
  | 'learning'
  | 'mountain'
  | 'route'
  | 'devotion'
  | 'legend'
  | 'epoch'
  | 'ocean';

export type QuestTier = 'beginner' | 'intermediate' | 'advanced';

export const QUEST_TIERS: QuestTier[] = ['beginner', 'intermediate', 'advanced'];

export interface QuestDef {
  id: string;
  name: Localized<string>;
  emoji: string;
  kind: QuestKind;
  tier: QuestTier;
  blurb: Localized<string>;
  steps: QuestStep[];
}

export const QUESTS: QuestDef[] = [
  // ── Beginner ───────────────────────────────────────────────────────
  {
    id: 'path-of-compassion',
    name: localized('Path of Compassion', '慈悲之路'),
    emoji: '🪷',
    kind: 'pilgrimage',
    tier: 'beginner',
    blurb: localized(
      'Four famous stops on the Buddha’s path. Clues are clear — name each place when you know it.',
      '佛陀之路上四处著名站点。线索清楚——认得出时点出地名。',
    ),
    steps: [
      {
        id: 'lumbini',
        hint: localized(
          'In Nepal, near the Himalayan foothills: the garden remembered as the birthplace of the Buddha.',
          '在尼泊尔，近喜马拉雅山麓：人们记得佛陀诞生的那座园子。',
        ),
      },
      {
        id: 'mahabodhi-temple',
        hint: localized(
          'In Bodh Gaya, northern India: the temple by the Bodhi tree where the Buddha is said to have awakened.',
          '在印度北部菩提伽耶：菩提树旁的大寺，据说佛陀在此觉悟。',
        ),
      },
      {
        id: 'sarnath',
        hint: localized(
          'Near Varanasi in India: the deer park where the Buddha gave his first sermon on the Middle Way.',
          '在印度瓦拉纳西附近：鹿野苑，佛陀在此初转法轮，讲说中道。',
        ),
      },
      {
        id: 'borobudur',
        hint: localized(
          'On the island of Java in Indonesia: the great stone stupa-mountain climbed like a mandala.',
          '在印度尼西亚爪哇岛：如曼荼罗般拾级而上的巨大石塔山。',
        ),
      },
    ],
  },
  {
    id: 'confucian-trail',
    name: localized('Confucian Trail', '儒门足迹'),
    emoji: '📖',
    kind: 'learning',
    tier: 'beginner',
    blurb: localized(
      'Confucius’s homeland and the academies that kept his thought alive. The clues name regions clearly.',
      '孔子的故乡与延续其思想的书院。线索会清楚标出地域。',
    ),
    steps: [
      {
        id: 'temple-of-confucius-qufu',
        hint: localized(
          'In Qufu, Shandong, China: the great temple complex at Confucius’s hometown.',
          '在中国山东曲阜：孔子故乡那座宏大的孔庙建筑群。',
        ),
      },
      {
        id: 'yuelu-academy',
        hint: localized(
          'In Changsha, Hunan, China: the thousand-year academy at the foot of Yuelu Mountain.',
          '在中国湖南长沙：岳麓山下那座千年书院。',
        ),
      },
      {
        id: 'dosan-seowon',
        hint: localized(
          'In South Korea: a riverside Confucian academy (seowon) honouring the scholar Yi Hwang.',
          '在韩国：河畔一座纪念学者李滉的儒家书院。',
        ),
      },
      {
        id: 'mount-tai',
        hint: localized(
          'In Shandong, China: Mount Tai — the eastern sacred peak where emperors once reported to Heaven.',
          '在中国山东：泰山——东岳圣山，历代帝王曾在此祭天。',
        ),
      },
    ],
  },
  {
    id: 'mountain-pilgrimage',
    name: localized('Mountain Pilgrimage', '山岳朝圣'),
    emoji: '🏔️',
    kind: 'mountain',
    tier: 'beginner',
    blurb: localized(
      'Four well-known sacred peaks and cliff sanctuaries. Read the clear hints, then find them on the globe.',
      '四座广为人知的圣山与悬崖圣地。读清线索，再在地球上找到它们。',
    ),
    steps: [
      {
        id: 'mount-tai',
        hint: localized(
          'China’s Mount Tai in Shandong — stone stairways rising into cloud, the eastern sacred mountain.',
          '中国山东的泰山——石阶直入云中的东岳。',
        ),
      },
      {
        id: 'mount-fuji',
        hint: localized(
          'Japan’s Mount Fuji — the near-perfect volcanic cone that is the nation’s spiritual silhouette.',
          '日本的富士山——近乎完美的火山锥，岛国的精神剪影。',
        ),
      },
      {
        id: 'mount-emei',
        hint: localized(
          'Mount Emei in Sichuan, China — a misty Buddhist sacred peak, one of the four great ones.',
          '中国四川的峨眉山——云雾中的佛教名山，四大佛教名山之一。',
        ),
      },
      {
        id: 'paro-taktsang',
        hint: localized(
          'In Bhutan: Paro Taktsang, the Tiger’s Nest — temples clinging to a sheer Himalayan cliff.',
          '在不丹：帕罗虎穴寺——紧贴喜马拉雅悬崖的寺院。',
        ),
      },
    ],
  },
  {
    id: 'houses-of-devotion',
    name: localized('Houses of Devotion', '虔敬之屋'),
    emoji: '🕯️',
    kind: 'devotion',
    tier: 'beginner',
    blurb: localized(
      'Famous houses of prayer across traditions. Clues name the country and the community.',
      '各传统中著名的祈祷之所。线索会点出国家与信众。',
    ),
    steps: [
      {
        id: 'golden-temple',
        hint: localized(
          'In Amritsar, Punjab, India: the Golden Temple — the shimmering Sikh sanctuary open to all.',
          '在印度旁遮普阿姆利则：金庙——向所有人敞开的锡克圣地。',
        ),
      },
      {
        id: 'mevlana-konya',
        hint: localized(
          'In Konya, Turkey: the resting place of Rumi, heart of the whirling Mevlevi Sufi tradition.',
          '在土耳其科尼亚：鲁米的安息处，旋转托钵苏非传统的心灵所在。',
        ),
      },
      {
        id: 'santiago-de-compostela',
        hint: localized(
          'In northwest Spain: Santiago de Compostela — the cathedral at the end of the Camino pilgrimage.',
          '在西班牙西北：圣地亚哥-德孔波斯特拉——朝圣之路尽头的大教堂。',
        ),
      },
      {
        id: 'lalibela',
        hint: localized(
          'In the Ethiopian highlands: Lalibela — churches carved down into red rock, a New Jerusalem in stone.',
          '在埃塞俄比亚高原：拉利贝拉——向下凿入红岩的教堂，石中的新耶路撒冷。',
        ),
      },
    ],
  },

  // ── Intermediate ───────────────────────────────────────────────────
  {
    id: 'way-of-learning',
    name: localized('Way of Learning', '求学之路'),
    emoji: '📚',
    kind: 'learning',
    tier: 'intermediate',
    blurb: localized(
      'Hunt for academies and libraries where minds met across centuries. Clues only — search the globe.',
      '寻访那些跨越世纪、心灵相遇的书院与图书馆。只有线索——请在地球上搜索。',
    ),
    steps: [
      {
        id: 'nalanda',
        hint: localized(
          'Ruins of a great Buddhist university in India where thousands of monks once debated under monsoon skies.',
          '印度一座大型佛教学府的遗迹，昔日成千上万僧人在雨季的天空下辩经。',
        ),
      },
      {
        id: 'yuelu-academy',
        hint: localized(
          'A Song-dynasty academy at the foot of a wooded hill in Hunan, still teaching after a thousand years.',
          '湖南一座林木山麓下的宋代书院，千年后仍在传学。',
        ),
      },
      {
        id: 'house-of-wisdom',
        hint: localized(
          'In Abbasid Baghdad, a house of translation and astronomy where Greek and Indian knowledge met Arabic.',
          '阿拔斯朝的巴格达，一座翻译与天文学之屋，希腊与印度的知识在此与阿拉伯相遇。',
        ),
      },
      {
        id: 'library-of-alexandria',
        hint: localized(
          'The legendary library of the Mediterranean that tried to gather every book in the known world — now a modern echo on the same shore.',
          '地中海传说中的图书馆，曾试图汇集已知世界的每一部书——如今同岸有一座现代回响。',
        ),
      },
    ],
  },
  {
    id: 'silk-road-echoes',
    name: localized('Silk Road Echoes', '丝路回响'),
    emoji: '🐪',
    kind: 'route',
    tier: 'intermediate',
    blurb: localized(
      'Ideas travelled these corridors. Follow whispers of caves, caravanserais, and translation houses.',
      '思想曾沿着这些走廊旅行。追随石窟、商队驿站与翻译之所的低语。',
    ),
    steps: [
      {
        id: 'white-horse-temple',
        hint: localized(
          'China’s first Buddhist temple, said to honour the white horses that carried scriptures from the west.',
          '中国第一座佛寺，据说为纪念驮经东来的白马而建。',
        ),
      },
      {
        id: 'mogao-caves',
        hint: localized(
          'A desert cliff honeycombed with painted caves where the Silk Road left its prayers in pigment.',
          '沙漠悬崖上蜂窝般的彩绘石窟，丝绸之路把祈祷留在颜料里。',
        ),
      },
      {
        id: 'registan-samarkand',
        hint: localized(
          'Three towering tiled madrasahs facing a public square in the heart of Central Asia.',
          '中亚腹地，三座琉璃贴面的高大经学院面向一座公共广场。',
        ),
      },
      {
        id: 'house-of-wisdom',
        hint: localized(
          'Where scholars in a river city translated the stars and the ancients for a caliphate.',
          '一座河畔之城的学者们，曾为哈里发国翻译星辰与古人。',
        ),
      },
    ],
  },
  {
    id: 'living-libraries',
    name: localized('Living Libraries', '活着的图书馆'),
    emoji: '🏛️',
    kind: 'learning',
    tier: 'intermediate',
    blurb: localized(
      'From medieval courtyards of learning to a vault that keeps the seeds of tomorrow — find four keepers of memory.',
      '从中世纪的求学庭院，到守护明日种子的地窖——寻访四处记忆的守望者。',
    ),
    steps: [
      {
        id: 'al-qarawiyyin',
        hint: localized(
          'In a North African medina, a mosque-university founded by a woman in the ninth century still teaches.',
          '北非一座麦地那中，由一位女性于九世纪创立的清真寺学府，至今仍在传学。',
        ),
      },
      {
        id: 'timbuktu-sankore',
        hint: localized(
          'On the edge of the Sahara, manuscript libraries once made a desert city a beacon of scholarship.',
          '撒哈拉边缘，手稿图书馆曾使一座沙漠之城成为学问的灯塔。',
        ),
      },
      {
        id: 'al-azhar',
        hint: localized(
          'Beside the Nile, a great mosque-school has guided Islamic learning for over a thousand years.',
          '尼罗河畔，一座宏大的清真寺学府指引伊斯兰学问已逾千年。',
        ),
      },
      {
        id: 'svalbard-global-seed-vault',
        hint: localized(
          'Deep in Arctic rock, a quiet vault stores the world’s seed diversity against disaster.',
          '北极岩石深处，一座安静的地窖为防灾存着世界的种子多样性。',
        ),
      },
    ],
  },
  {
    id: 'andean-sky',
    name: localized('Andean Sky Path', '安第斯天路'),
    emoji: '🌄',
    kind: 'mountain',
    tier: 'intermediate',
    blurb: localized(
      'High places of the Americas — stone cities, sacred peaks, and pyramids under wide skies.',
      '美洲的高处——石城、圣山，与广阔天空下的金字塔。',
    ),
    steps: [
      {
        id: 'machu-picchu',
        hint: localized(
          'A cloud-wrapped Inca citadel on a ridge above a winding Urubamba valley.',
          '乌鲁班巴河谷蜿蜒之上、云雾缭绕的印加石城。',
        ),
      },
      {
        id: 'ausangate',
        hint: localized(
          'A glacier-crowned apu of the Andes, circled on foot by pilgrims who honour the mountain as a living being.',
          '安第斯一座冰川冠顶的山神峰，朝圣者徒步环绕，敬山如生灵。',
        ),
      },
      {
        id: 'teotihuacan',
        hint: localized(
          'On a high plateau, avenues and pyramids of a vanished city still align with sun and stars.',
          '高原上，一座消逝之城的大道与金字塔仍与日月星辰对齐。',
        ),
      },
      {
        id: 'chichen-itza',
        hint: localized(
          'In the Yucatán forest, a stepped pyramid throws a serpent of light on equinox days.',
          '尤卡坦丛林中，一座阶梯金字塔在春分秋分投下光之蛇影。',
        ),
      },
    ],
  },
  {
    id: 'east-asian-ways',
    name: localized('East Asian Ways', '东亚之路'),
    emoji: '🏯',
    kind: 'pilgrimage',
    tier: 'intermediate',
    blurb: localized(
      'Temples and mountains where Daoist, Buddhist and Shinto paths left enduring footprints.',
      '道教、佛教与神道留下持久足迹的寺观与山岳。',
    ),
    steps: [
      {
        id: 'mount-wudang',
        hint: localized(
          'A Daoist mountain range in China famous for internal arts and temples among the peaks.',
          '中国一座以武当内家与峰间宫观闻名的道教山脉。',
        ),
      },
      {
        id: 'todai-ji',
        hint: localized(
          'In an ancient Japanese capital, a vast hall shelters one of the largest bronze Buddhas ever cast.',
          '日本一座古都中，宏大殿宇庇护着史上最大的青铜大佛之一。',
        ),
      },
      {
        id: 'bulguksa',
        hint: localized(
          'On a wooded Korean hillside, stone pagodas and lotus ponds mark a Silla-era Buddhist sanctuary.',
          '韩国林木山坡上，石塔与莲池标示着新罗时代的佛教圣地。',
        ),
      },
      {
        id: 'fushimi-inari',
        hint: localized(
          'Thousands of vermilion torii gates climb a sacred hill above a city in western Japan.',
          '西日本一座城市上方，数千座朱红色鸟居攀上一座圣山。',
        ),
      },
    ],
  },

  // ── Advanced ───────────────────────────────────────────────────────
  {
    id: 'edge-of-the-map',
    name: localized('Edge of the Map', '地图边缘'),
    emoji: '📜',
    kind: 'legend',
    tier: 'advanced',
    blurb: localized(
      'Real places that echo myths of hidden kingdoms and ocean palaces. Thin clues — no legend names given.',
      '与隐秘王国、海中宫殿传说相呼应的真实之地。线索稀薄——不点出传说之名。',
    ),
    steps: [
      {
        id: 'delphi',
        hint: localized(
          'A Greek mountainside where an oracle once spoke — stories also pointed far north of the known winds.',
          '希腊山腰，昔日神谕在此响起——故事也曾指向已知风带以北的远方。',
        ),
      },
      {
        id: 'potala-palace',
        hint: localized(
          'A white-and-red palace stacked on a Tibetan hill — neighbour in story to a kingdom said to be hidden in the snows.',
          '西藏山丘上堆叠的红白宫殿——故事中与雪域隐秘王国为邻。',
        ),
      },
      {
        id: 'mount-kailash',
        hint: localized(
          'A crystal peak of the western Himalayas, walked around but never climbed — axis of many old cosmologies.',
          '西喜马拉雅一座水晶般的山峰，人可环绕却从不攀登——诸多古老宇宙观的轴心。',
        ),
      },
      {
        id: 'mount-wudang',
        hint: localized(
          'Peaks where immortals are said to keep the Way — a Chinese range of cloud temples and quiet practice.',
          '据说仙人守道的峰峦——中国一座云中宫观、静修之地的山脉。',
        ),
      },
      {
        id: 'fushimi-inari',
        hint: localized(
          'Fox-guarded gates on a Japanese hill — shoreward stories tell of a dragon palace beneath the waves.',
          '日本山丘上狐守护的鸟居——靠海的故事里，有龙宫在浪下。',
        ),
      },
    ],
  },
  {
    id: 'long-dawn',
    name: localized('Long Dawn of the Spirit', '精神的漫长黎明'),
    emoji: '🌅',
    kind: 'epoch',
    tier: 'advanced',
    blurb: localized(
      'From deep-time gathering places to houses of teaching — how humans kept asking larger questions. Sparse clues.',
      '从深时的聚会之地到传学之所——人类如何持续追问更大的问题。线索稀少。',
    ),
    steps: [
      {
        id: 'gobekli-tepe',
        hint: localized(
          'Before cities, T-shaped pillars were raised on a hill in Anatolia — gatherings older than writing.',
          '在城市之前，安纳托利亚山丘上竖起T形石柱——比文字更古老的聚会。',
        ),
      },
      {
        id: 'stonehenge',
        hint: localized(
          'On a green plain of the far northwest, stones still keep a calendar of sun and moon.',
          '遥远西北的绿原上，石头仍守着日月的历法。',
        ),
      },
      {
        id: 'varanasi',
        hint: localized(
          'A river city of steps and lamps where life and death meet the water each morning.',
          '一座阶梯与灯火的河城，生命与死亡每日清晨与水相遇。',
        ),
      },
      {
        id: 'jerusalem-old-city',
        hint: localized(
          'Walled stone where several faiths keep sacred memory within a few crowded streets.',
          '石墙之内，几种信仰在拥挤的街巷中守护神圣的记忆。',
        ),
      },
      {
        id: 'house-of-wisdom',
        hint: localized(
          'A caliphal city of translation where the sky’s mathematics and old books were gathered as a vocation.',
          '一座哈里发之城的翻译之所，把天空的数学与古书当作一种天职来汇集。',
        ),
      },
    ],
  },
  {
    id: 'ocean-of-stories',
    name: localized('Ocean of Stories', '故事之海'),
    emoji: '🌊',
    kind: 'ocean',
    tier: 'advanced',
    blurb: localized(
      'Islands, depths, teeth of relics, and a rock of the Dreaming — follow water and wonder to the edge.',
      '岛屿、深渊、圣物之牙，与梦之岩石——循水与惊奇走到边缘。',
    ),
    steps: [
      {
        id: 'galapagos-islands',
        hint: localized(
          'Pacific islands where finches and tortoises helped rewrite the story of life’s branching.',
          '太平洋群岛，雀鸟与龟帮助改写了生命分叉的故事。',
        ),
      },
      {
        id: 'challenger-deep',
        hint: localized(
          'The deepest known point in the world ocean — a trench where light never arrives.',
          '已知世界大洋最深处——光从未抵达的海沟。',
        ),
      },
      {
        id: 'temple-of-the-tooth',
        hint: localized(
          'On a tropical island, a shrine guards a relic said to be a tooth of the Awakened One.',
          '热带岛屿上，一座寺守护着据说属于觉悟者的一颗牙舍利。',
        ),
      },
      {
        id: 'uluru',
        hint: localized(
          'A vast red monolith of the southern continent, held sacred in the stories of its first peoples.',
          '南方大陆一座巨大的红岩单体，在其第一民族的故事中被视为神圣。',
        ),
      },
    ],
  },
  {
    id: 'crossroads-of-faith',
    name: localized('Crossroads of Faith', '信仰的十字路口'),
    emoji: '🕊️',
    kind: 'devotion',
    tier: 'advanced',
    blurb: localized(
      'Places where many paths have met in stone. Neutral clues — no tradition ranked above another.',
      '多条道路在石头中相遇的地方。中性线索——不以传统分高下。',
    ),
    steps: [
      {
        id: 'hagia-sophia',
        hint: localized(
          'A vast dome by a strait that has been church and mosque and museum — light through ancient windows.',
          '海峡边一座巨穹，曾为教堂、清真寺与博物馆——光从古老窗棂中来。',
        ),
      },
      {
        id: 'jerusalem-old-city',
        hint: localized(
          'Within one old wall, footsteps of several revelations share the same worn stones.',
          '同一座旧墙之内，几种启示的脚步分享同样磨损的石头。',
        ),
      },
      {
        id: 'ellora-caves',
        hint: localized(
          'A cliff in India carved into temples of more than one path, side by side in the rock.',
          '印度一座悬崖凿出不止一种道路的庙宇，并立于岩石之中。',
        ),
      },
      {
        id: 'angkor-wat',
        hint: localized(
          'A temple-mountain in the Cambodian forest that turned from one cosmic story toward another across centuries.',
          '柬埔寨丛林中一座寺山，数世纪间从一种宇宙故事转向另一种。',
        ),
      },
    ],
  },
];

export const QUEST_BY_ID: Record<string, QuestDef> = Object.fromEntries(
  QUESTS.map((q) => [q.id, q]),
);

export const QUESTS_BY_TIER: Record<QuestTier, QuestDef[]> = {
  beginner: QUESTS.filter((q) => q.tier === 'beginner'),
  intermediate: QUESTS.filter((q) => q.tier === 'intermediate'),
  advanced: QUESTS.filter((q) => q.tier === 'advanced'),
};

/** Whether a tier’s journeys may be played (completion path or rank path). */
export function questTierUnlocked(
  tier: QuestTier,
  completedQuestIds: readonly string[] | undefined,
  xp = 0,
): boolean {
  const done = new Set(completedQuestIds ?? []);
  if (tier === 'beginner') return true;
  if (tier === 'intermediate') {
    return (
      QUESTS_BY_TIER.beginner.every((q) => done.has(q.id)) ||
      rankMeets(xp, RANK_FEATURE.intermediateQuests)
    );
  }
  return (
    QUESTS_BY_TIER.intermediate.every((q) => done.has(q.id)) ||
    rankMeets(xp, RANK_FEATURE.advancedQuests)
  );
}

export function isQuestUnlocked(
  questId: string,
  completedQuestIds: readonly string[] | undefined,
  xp = 0,
): boolean {
  const q = QUEST_BY_ID[questId];
  if (!q) return false;
  return questTierUnlocked(q.tier, completedQuestIds, xp);
}

/** Quests the explorer may play — for Quest of the Month etc. */
export function unlockedQuests(
  completedQuestIds: readonly string[] | undefined,
  xp = 0,
): QuestDef[] {
  return QUESTS.filter((q) => questTierUnlocked(q.tier, completedQuestIds, xp));
}
