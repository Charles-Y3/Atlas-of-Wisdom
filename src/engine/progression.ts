import { localized, type Localized } from '../i18n/types';

// ── XP rewards ─────────────────────────────────────────────────────────
export const XP_FOR = {
  firstVisit: 15,       // opening a location's page for the first time
  readStory: 55,        // finishing the story (and teaching) of a location
  discovery: 15,        // using Discovery mode on a new place
  dailyDiscovery: 20,   // opening the Discovery of the Day
  quizQuestion: 10,     // each daily-quiz question answered correctly
  reflection: 70,       // writing a reflection on a place's virtue
  collection: 150,      // completing a collection
  achievement: 60,      // unlocking an achievement
  teachingOfDay: 15,    // opening Teaching of the Day once per day
  exploreLegend: 30,    // first open of a legendary place
  questStep: 40,        // marking a quest stop's story as read
  questComplete: 120,   // finishing every stop on a quest
} as const;

// ── Explorer ranks (from the vision doc) ───────────────────────────────
export interface Rank {
  id: string;
  name: Localized<string>;
  emoji: string;
  minXp: number;
  blurb: Localized<string>;
}

// Thresholds tuned so early ranks come quickly (a few sessions) and the
// top ranks require exploring most of the atlas plus sustained habits.
export const RANKS: Rank[] = [
  {
    id: 'seeker',
    name: localized('Seeker', '寻路人'),
    emoji: '🔦',
    minXp: 0,
    blurb: localized(
      'Every atlas begins with a single question: what is out there?',
      '每一本地图集，都始于同一个问题：远方有什么？',
    ),
  },
  {
    id: 'explorer',
    name: localized('Explorer', '探索者'),
    emoji: '🧭',
    minXp: 150,
    blurb: localized(
      'The first pins are on your map. Curiosity has become motion.',
      '你的地图上有了第一批标记。好奇心已化作脚步。',
    ),
  },
  {
    id: 'traveller',
    name: localized('Traveller', '旅行者'),
    emoji: '🐫',
    minXp: 400,
    blurb: localized(
      'You cross continents without leaving home, following stories instead of roads.',
      '你足不出户而跨越大洲，追随的不是道路，而是故事。',
    ),
  },
  {
    id: 'historian',
    name: localized('Historian', '历史学人'),
    emoji: '📜',
    minXp: 800,
    blurb: localized(
      'Dates and places are becoming a single fabric — you see how one age leads to the next.',
      '年代与地点正织成一块布 — 你看见一个时代如何走向下一个。',
    ),
  },
  {
    id: 'scholar',
    name: localized('Scholar', '学者'),
    emoji: '🎓',
    minXp: 1400,
    blurb: localized(
      'You read places the way others read books, patiently and to the last page.',
      '你读一个地方，如同别人读一本书 — 耐心地，读到最后一页。',
    ),
  },
  {
    id: 'researcher',
    name: localized('Researcher', '研究者'),
    emoji: '🔍',
    minXp: 2200,
    blurb: localized(
      'The connections interest you more than the landmarks: teacher to student, temple to academy.',
      '比起地标，你更着迷于联系：师与徒，庙宇与书院。',
    ),
  },
  {
    id: 'master-explorer',
    name: localized('Master Explorer', '探索大师'),
    emoji: '🌏',
    minXp: 3200,
    blurb: localized(
      'Few corners of the atlas remain unknown to you. You guide others to their first discoveries.',
      '地图集里少有你未曾踏足的角落。你开始引导他人完成第一次发现。',
    ),
  },
  {
    id: 'wisdom-cartographer',
    name: localized('Wisdom Cartographer', '智慧制图师'),
    emoji: '🗺️',
    minXp: 4500,
    blurb: localized(
      'You no longer just read the map of human wisdom — you help draw it.',
      '你不再只是阅读人类智慧的地图 — 你在参与绘制它。',
    ),
  },
];

export function rankIndexForXp(xp: number): number {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].minXp) idx = i;
  }
  return idx;
}

export function rankForXp(xp: number): Rank {
  return RANKS[rankIndexForXp(xp)];
}

export function nextRankForXp(xp: number): Rank | null {
  const idx = rankIndexForXp(xp);
  return idx + 1 < RANKS.length ? RANKS[idx + 1] : null;
}
