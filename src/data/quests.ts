import { localized, type Localized } from '../i18n/types';

/**
 * Hint-driven pilgrimages: each stop shows a clue only — never the place
 * name or a deep link — until the explorer finds it on the Atlas (visit).
 */
export interface QuestStep {
  /** Secret target location id — never shown until found. */
  id: string;
  hint: Localized<string>;
}

export interface QuestDef {
  id: string;
  name: Localized<string>;
  emoji: string;
  blurb: Localized<string>;
  steps: QuestStep[];
}

export const QUESTS: QuestDef[] = [
  {
    id: 'path-of-compassion',
    name: localized('Path of Compassion', '慈悲之路'),
    emoji: '🪷',
    blurb: localized(
      'Follow four clues along an early path of awakening. Find each place on the Atlas — the name stays hidden until you arrive.',
      '循着四条与早期觉悟之路相关的线索。在地图上寻访每一处——名字在抵达前保密。',
    ),
    steps: [
      {
        id: 'lumbini',
        hint: localized(
          'A garden in the foothills of the Himalayas, remembered as the birthplace of a prince who left his palace to understand suffering.',
          '喜马拉雅山麓的一座园子，人们记得一位王子在此诞生，他后来离开王宫去理解苦难。',
        ),
      },
      {
        id: 'mahabodhi-temple',
        hint: localized(
          'Under a fig tree in northern India, that same seeker is said to have sat until the mind grew still.',
          '在印度北部一棵无花果树下，同一位求道者据说静坐到心念澄明。',
        ),
      },
      {
        id: 'sarnath',
        hint: localized(
          'A deer park near the Ganges where the first teaching of a “middle way” was spoken aloud.',
          '恒河附近的一座鹿野苑，据说“中道”的第一次讲说在此响起。',
        ),
      },
      {
        id: 'borobudur',
        hint: localized(
          'A vast stone mountain of stupas on a tropical island, climbed like a mandala toward emptiness.',
          '热带岛屿上一座由佛塔堆成的石山，如曼荼罗般拾级而上，通向空性。',
        ),
      },
    ],
  },
  {
    id: 'way-of-learning',
    name: localized('Way of Learning', '求学之路'),
    emoji: '📚',
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
    id: 'confucian-trail',
    name: localized('Confucian Trail', '儒门足迹'),
    emoji: '📖',
    blurb: localized(
      'Trace a teacher’s homeland and the academies that kept his thought alive — without being told where to go.',
      '追随一位夫子的故乡与延续其思想的书院——但不直接告诉你去哪里。',
    ),
    steps: [
      {
        id: 'temple-of-confucius-qufu',
        hint: localized(
          'In Shandong, a vast temple complex stands where China’s most influential teacher was born and is still honoured.',
          '在山东，一座宏大的庙宇群立于中国影响最深的一位老师的故乡，至今受祭。',
        ),
      },
      {
        id: 'yuelu-academy',
        hint: localized(
          'An academy beneath Yuelu Mountain that shaped Confucian learning for a millennium.',
          '岳麓山下的一座书院，塑造儒学传承达千年。',
        ),
      },
      {
        id: 'dosan-seowon',
        hint: localized(
          'A quiet riverside academy in Korea dedicated to a philosopher who said nature itself is a teacher.',
          '韩国河畔一座静谧书院，献给一位认为自然本身就是老师的哲人。',
        ),
      },
      {
        id: 'mount-tai',
        hint: localized(
          'China’s most climbed sacred peak, where emperors once reported to Heaven.',
          '中国朝圣者最多的圣山之一，历代帝王曾在此祭天。',
        ),
      },
    ],
  },
  {
    id: 'mountain-pilgrimage',
    name: localized('Mountain Pilgrimage', '山岳朝圣'),
    emoji: '🏔️',
    blurb: localized(
      'Four peaks and cliff-side sanctuaries. Read the hints, then find them on the spinning globe.',
      '四座山峰与悬崖上的圣地。读线索，再在旋转的地球上找到它们。',
    ),
    steps: [
      {
        id: 'mount-tai',
        hint: localized(
          'The eastern sacred mountain of China, stairways of stone rising into cloud.',
          '中国五岳之东岳，石阶直入云中。',
        ),
      },
      {
        id: 'mount-fuji',
        hint: localized(
          'A near-perfect volcanic cone that has become the spiritual silhouette of an island nation.',
          '近乎完美的火山锥，成为一座岛国的精神剪影。',
        ),
      },
      {
        id: 'mount-emei',
        hint: localized(
          'A misty Buddhist mountain in Sichuan, one of four great sacred peaks of Chinese Buddhism.',
          '四川一座云雾缭绕的佛教名山，中国佛教四大名山之一。',
        ),
      },
      {
        id: 'paro-taktsang',
        hint: localized(
          'A nest of temples clinging to a sheer cliff in the Himalayas — the “Tiger’s Nest.”',
          '喜马拉雅一座悬崖上的寺巢——人称“虎穴”。',
        ),
      },
    ],
  },
  {
    id: 'silk-road-echoes',
    name: localized('Silk Road Echoes', '丝路回响'),
    emoji: '🐪',
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
    id: 'houses-of-devotion',
    name: localized('Houses of Devotion', '虔敬之屋'),
    emoji: '🕯️',
    blurb: localized(
      'Places built for prayer and service. The map holds them; the hints only point the way.',
      '为祈祷与奉献而建的地方。地图上有它们；线索只指方向。',
    ),
    steps: [
      {
        id: 'golden-temple',
        hint: localized(
          'A shimmering Sikh sanctuary in Punjab, open to all, with a pool of nectar around its heart.',
          '旁遮普一座向所有人敞开的锡克圣地，心中环绕着甘露之池。',
        ),
      },
      {
        id: 'mevlana-konya',
        hint: localized(
          'In Anatolia, the resting place of a poet of whirling love — the Mevlevi heart of Sufism.',
          '安纳托利亚，一位旋转之爱诗人的安息处——苏非托钵僧的心灵所在。',
        ),
      },
      {
        id: 'santiago-de-compostela',
        hint: localized(
          'The western end of a long Christian pilgrimage road across Spain, marked by a scallop shell.',
          '横穿西班牙的漫长基督朝圣之路的西端，以扇贝壳为记。',
        ),
      },
      {
        id: 'lalibela',
        hint: localized(
          'Churches carved downward into red rock in the Ethiopian highlands — a New Jerusalem in stone.',
          '埃塞俄比亚高原上向下凿入红岩的教堂——石中的新耶路撒冷。',
        ),
      },
    ],
  },
];
