import { localized, type Localized } from '../i18n/types';

// ── XP rewards ─────────────────────────────────────────────────────────
// Tuned to the full ladder: seal → read → reflect/practice → quests →
// collections. Early ranks come from a few sealed stories; top ranks need
// most of the atlas, lived virtues, and quest tiers.
export const XP_FOR = {
  firstVisit: 25,       // sealing a place by passing its place check
  readStory: 55,        // finishing the story (and teaching) of a location
  discovery: 15,        // using Discovery mode on a new place
  dailyDiscovery: 20,   // opening the Discovery of the Day
  quizQuestion: 10,     // each daily-quiz question answered correctly
  reflection: 70,       // writing a reflection (ticks virtues)
  practice: 35,         // accepting an optional virtue practice chip
  collection: 150,      // completing a collection
  achievement: 60,      // unlocking an achievement
  teachingOfDay: 15,    // opening Teaching of the Day once per day
  exploreLegend: 30,    // first open of a legendary place
  questStep: 40,        // confirming a quest clue by name
  questComplete: 120,   // finishing every stop on a quest
  streak3: 30,          // first time a journey reaches 3 days
  streak7: 70,          // a full week of returning
  streak30: 200,        // a month on the path
} as const;

/** Streak lengths that grant a one-time (per reach) XP bonus. */
export const STREAK_XP_MILESTONES: Record<number, number> = {
  3: XP_FOR.streak3,
  7: XP_FOR.streak7,
  30: XP_FOR.streak30,
};

// ── Explorer ranks ─────────────────────────────────────────────────────
export interface Rank {
  id: string;
  name: Localized<string>;
  emoji: string;
  minXp: number;
  blurb: Localized<string>;
}

/**
 * Thresholds mapped to the whole journey (65 places, 13 quests, virtues,
 * legends). Rough anchors:
 *  - Explorer: first seal + story (~80 XP)
 *  - Traveller: a handful of places or early quest steps
 *  - Historian: beginner quests / ~10 sealed stories
 *  - Scholar: reflections underway + broader atlas
 *  - Researcher: intermediate quests / half the map lived
 *  - Master Explorer: legends unlock (~most atlas engaged)
 *  - Wisdom Cartographer: near-complete atlas + quests + virtues
 */
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
    minXp: 100,
    blurb: localized(
      'The first place is sealed and its story read. Curiosity has become motion.',
      '你盖印了第一处地点，读完了它的故事。好奇心已化作脚步。',
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
    minXp: 1200,
    blurb: localized(
      'Dates and places are becoming a single fabric — beginner paths are behind you.',
      '年代与地点正织成一块布 — 入门之路已在身后。',
    ),
  },
  {
    id: 'scholar',
    name: localized('Scholar', '学者'),
    emoji: '🎓',
    minXp: 2400,
    blurb: localized(
      'You read places the way others read books — and pause to reflect on what they teach.',
      '你读一个地方，如同别人读一本书 — 并停下反思它所教的。',
    ),
  },
  {
    id: 'researcher',
    name: localized('Researcher', '研究者'),
    emoji: '🔍',
    minXp: 4000,
    blurb: localized(
      'Connections interest you more than landmarks: quests, virtues, and the threads between places.',
      '比起地标，你更着迷于联系：旅程、德行，以及地点之间的线。',
    ),
  },
  {
    id: 'master-explorer',
    name: localized('Master Explorer', '探索大师'),
    emoji: '🌏',
    minXp: 6000,
    blurb: localized(
      'Few corners of the atlas remain unknown. Legends open; you guide others to their first discoveries.',
      '地图集里少有你未曾踏足的角落。传说层开启；你开始引导他人完成第一次发现。',
    ),
  },
  {
    id: 'wisdom-cartographer',
    name: localized('Wisdom Cartographer', '智慧制图师'),
    emoji: '🗺️',
    minXp: 9000,
    blurb: localized(
      'You no longer just read the map of human wisdom — you help draw it.',
      '你不再只是阅读人类智慧的地图 — 你在参与绘制它。',
    ),
  },
];

/** XP at which Master Explorer (and the Legends layer via XP) unlocks. */
export const MASTER_EXPLORER_MIN_XP =
  RANKS.find((r) => r.id === 'master-explorer')?.minXp ?? 6000;

/** Secondary features gated by explorer rank (core explore/read stays free). */
export const RANK_FEATURE = {
  passportExport: 'explorer',
  onThisDay: 'traveller',
  intermediateQuests: 'historian',
  teachingOfDay: 'scholar',
  advancedQuests: 'researcher',
  cartographerPassport: 'wisdom-cartographer',
} as const;

export type RankFeature = keyof typeof RANK_FEATURE;

/** UiKey names for per-rank unlock blurbs (defined in strings.ts). */
export const RANK_UNLOCK_KEY: Record<string, string> = {
  seeker: 'rankUnlockSeeker',
  explorer: 'rankUnlockExplorer',
  traveller: 'rankUnlockTraveller',
  historian: 'rankUnlockHistorian',
  scholar: 'rankUnlockScholar',
  researcher: 'rankUnlockResearcher',
  'master-explorer': 'rankUnlockMasterExplorer',
  'wisdom-cartographer': 'rankUnlockCartographer',
};

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

export function rankMeets(xp: number, rankId: string): boolean {
  const r = RANKS.find((x) => x.id === rankId);
  return r ? xp >= r.minXp : false;
}

export function xpUnlocks(xp: number, feature: RankFeature): boolean {
  return rankMeets(xp, RANK_FEATURE[feature]);
}
