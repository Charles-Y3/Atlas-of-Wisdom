import type { Locale } from './types';
import { localized, type Localized } from './types';
import { L } from './L';

// Every static UI-chrome string in the app, authored in English and
// Simplified Chinese. Traditional Chinese is derived automatically (see
// scripts/gen-zh-hant.ts / src/i18n/L.ts). Content data (locations, people,
// collections, achievements) lives in its own localized fields in src/data/*.

export const UI = {
  // ── App shell ──────────────────────────────────────────────────────
  appName: localized('Atlas of Wisdom', '智慧地图集'),
  appTagline: localized(
    "Discover the places that shaped humanity's wisdom.",
    '探索塑造人类智慧的地方。',
  ),

  navHome: localized('Home', '首页'),
  navAtlas: localized('Atlas', '地图'),
  navDiscover: localized('Discover', '发现'),
  navQuests: localized('Quests', '旅程'),
  navCollection: localized('Collection', '收藏'),
  navProfile: localized('Explorer', '探索者'),

  loading: localized('Loading…', '加载中…'),
  back: localized('Back', '返回'),
  close: localized('Close', '关闭'),

  // ── Language gate / settings ───────────────────────────────────────
  gateWelcome: localized('Welcome, explorer', '欢迎你，探索者'),
  gateSubtitle: localized('Choose your language to begin the journey.', '选择语言，开始你的旅程。'),
  gateChangeLater: localized('You can change this anytime in Explorer settings.', '之后可随时在探索者页面更改。'),
  language: localized('Language', '语言'),

  // ── Home ───────────────────────────────────────────────────────────
  homeSearchPlaceholder: localized('Search places, people, traditions…', '搜索地点、人物、传统…'),
  homeDiscoveryOfDay: localized('Discovery of the Day', '今日发现'),
  homeTeachingOfDay: localized('Teaching of the Day', '今日教诲'),
  homeTeachingOfDaySub: localized('A thought from the atlas, for today.', '今日，来自地图集的一则省思。'),
  homeDailyQuiz: localized('Daily Quiz', '每日问答'),
  homeContinue: localized('Continue exploring', '继续探索'),
  homeStartExploring: localized('Open the Atlas', '打开地图'),
  homeRandomDiscovery: localized('Reveal a random discovery', '随机揭晓一个发现'),
  homeExplored: localized('places explored', '已探索地点'),
  homeSearchNoResults: localized('No matches found. Try another word.', '未找到匹配。换个词试试。'),
  homeSearchPeople: localized('People', '人物'),
  homeSearchPlaces: localized('Places', '地点'),

  // ── Atlas ──────────────────────────────────────────────────────────
  atlasTitle: localized('World Atlas', '世界地图'),
  atlasAll: localized('All', '全部'),
  atlasVisited: localized('explored', '已探索'),
  atlasNotVisited: localized('Not yet explored', '尚未探索'),
  atlasOpenLocation: localized('Explore this place', '探索此地'),
  atlasLegends: localized('Legends', '传说'),
  atlasLegendsLocked: localized(
    'Legends unlock after you read 12 stories — or reach Master Explorer.',
    '读完12个故事，或达到宗师级探索者后，即可解锁传说层。',
  ),
  atlasLegendsHint: localized(
    'Speculative pins — stories, not verified sites. Toggle off to return to the historical atlas.',
    '推测性标记 — 故事而非已证实遗址。关闭后回到历史地图。',
  ),
  atlasAttribution: localized('Basemap: Natural Earth (public domain)', '底图：Natural Earth（公有领域）'),
  atlasAttributionOnline: localized(
    'Detailed map: OpenFreeMap Liberty (when online)',
    '详细地图：OpenFreeMap Liberty（在线时）',
  ),
  mapOnlineUnavailable: localized(
    'Detailed map unavailable — staying offline',
    '详细地图不可用 — 继续使用离线底图',
  ),
  mapRevertedOffline: localized(
    'Connection lost — reverted to offline map',
    '连接中断 — 已切回离线地图',
  ),
  settingsMap: localized('Map', '地图'),
  settingsDetailedMap: localized('Use detailed map when online', '在线时使用详细地图'),
  settingsDetailedMapHint: localized(
    'Streams vector tiles over the network. Off by default so the app never quietly uses cellular data.',
    '会通过网络加载矢量瓦片。默认关闭，以免应用悄悄消耗流量。',
  ),

  // ── Location page ──────────────────────────────────────────────────
  locOverview: localized('Overview', '概览'),
  locCountry: localized('Country', '国家'),
  locRegion: localized('Region', '地区'),
  locCoordinates: localized('Coordinates', '坐标'),
  locPeriod: localized('Historical period', '历史时期'),
  locTraditions: localized('Traditions', '传统'),
  locStatus: localized('Current status', '现状'),
  locUnesco: localized('UNESCO World Heritage Site', '联合国教科文组织世界遗产'),
  locUnescoSince: localized('inscribed', '列入年份'),
  locWhyItMatters: localized('Why this place matters', '此地为何重要'),
  locTeaching: localized('Teaching', '教诲'),
  locTimeline: localized('Historical timeline', '历史时间线'),
  locConnectedPeople: localized('Connected people', '相关人物'),
  locFunFact: localized('Did you know?', '你知道吗？'),
  locLearnMore: localized('Learn more on Wikipedia', '在维基百科了解更多'),
  locShowOnMap: localized('Show on map', '在地图上查看'),
  locFirstVisitXp: localized('New discovery!', '新发现！'),
  locReadBonus: localized('Read to the end — bonus XP', '读完全部 — 奖励经验'),
  locMarkRead: localized('I have finished reading', '我已读完'),
  locReadDone: localized('Story complete', '故事已读完'),

  // ── Virtues & reflection ───────────────────────────────────────────
  locVirtues: localized('What this place teaches', '此地予人的启示'),
  reflectTitle: localized('Take a moment', '停一停'),
  reflectIntro: localized(
    'You have read the story. Now one question — there is no right answer, and only you will see it.',
    '故事你已读完。现在一个问题 — 没有标准答案，也只有你自己会看到。',
  ),
  reflectPlaceholder: localized('Write a few honest lines…', '诚实地写下几行…'),
  reflectSave: localized('Save reflection', '保存反思'),
  reflectSaved: localized('Reflection saved', '反思已保存'),
  reflectionSaved: localized('Reflection saved', '反思已保存'),
  reflectMinHint: localized('A few more words…', '再多写几个字…'),
  reflectYours: localized('You wrote', '你写下的'),
  reflectSkip: localized('Maybe later', '稍后再说'),

  compassTitle: localized('Virtue Compass', '德行罗盘'),
  compassIntro: localized(
    'The shape of the stories you have read so far.',
    '你至今所读过的故事的形状。',
  ),
  compassEmpty: localized(
    'Read a few stories and your compass will take shape.',
    '读完几个故事，你的罗盘就会显出形状。',
  ),
  compassPlacesCount: localized('places', '处'),

  // ── People ─────────────────────────────────────────────────────────
  personBorn: localized('Born', '出生'),
  personDied: localized('Died', '逝世'),
  personPlaces: localized('Associated places', '相关地点'),

  // ── Discovery ──────────────────────────────────────────────────────
  discoverTitle: localized('Discovery Mode', '发现模式'),
  discoverSubtitle: localized('One tap. Somewhere in the world, a story is waiting.', '轻点一下。世界的某个角落，正有一个故事等着你。'),
  discoverButton: localized('Discover', '发现'),
  discoverAgain: localized('Discover another', '再发现一个'),
  discoverRevealing: localized('Travelling…', '旅行中…'),
  discoverNew: localized('New place!', '新地点！'),
  discoverSeen: localized('You have been here before', '你来过这里'),

  // ── Quests ─────────────────────────────────────────────────────────
  questsTitle: localized('Quests', '旅程'),
  questsSubtitle: localized(
    'Clues only — find each place on the Atlas yourself. Names stay hidden until you arrive.',
    '只有线索——自己在地图上寻访每一处。抵达前不显示地名。',
  ),
  questProgress: localized('found', '已找到'),
  questComplete: localized('Quest complete', '旅程完成'),
  questStepDone: localized('Place found!', '找到了！'),
  questClue: localized('Clue', '线索'),
  questSearchAtlas: localized('Search the Atlas', '打开地图寻找'),
  questSerendipityTitle: localized('Serendipity', '偶遇'),
  questSerendipityBlurb: localized(
    'No path planned — let the atlas surprise you.',
    '不设路线——让地图集给你一个惊喜。',
  ),

  // ── Collections ────────────────────────────────────────────────────
  collectionTitle: localized('Collections', '收藏'),
  collectionSubtitle: localized('Every place you explore joins your atlas.', '你探索过的每个地方，都会收入你的地图集。'),
  collectionSubtitleVirtues: localized(
    'Virtue collections grow when you read a place’s story — not just visit the pin.',
    '德行收藏在你读完一处故事后增长——不只是点开地图上的标记。',
  ),
  collectionComplete: localized('Complete!', '已集齐！'),
  collectionProgress: localized('collected', '已收集'),
  collectionLocked: localized('Keep exploring to reveal this collection.', '继续探索以揭开这个收藏。'),
  collectionTabPlaces: localized('Places', '地点'),
  collectionTabVirtues: localized('Virtues', '德行'),

  // ── Profile / progression ──────────────────────────────────────────
  profileTitle: localized('Explorer Profile', '探索者档案'),
  profileRank: localized('Rank', '等级'),
  profileXp: localized('XP', '经验'),
  profileNextRank: localized('Next rank', '下一等级'),
  profileStreak: localized('day streak', '天连续探索'),
  profileAchievements: localized('Achievements', '成就'),
  profileAchievementLocked: localized('Locked', '未解锁'),
  profileStats: localized('Exploration stats', '探索统计'),
  profileStatPlaces: localized('Places explored', '已探索地点'),
  profileStatStories: localized('Stories read', '已读完故事'),
  profileStatCollections: localized('Collections completed', '已集齐收藏'),
  profileStatContinents: localized('Continents reached', '已到达大洲'),
  profileReset: localized('Reset exploration progress', '重置探索进度'),
  profileResetConfirm: localized('This erases all your discoveries, XP and achievements. Are you sure?', '这将清除你的全部发现、经验与成就。确定吗？'),
  profileAbout: localized('Part of the Great Harmony suite', '大同系列应用之一'),

  // ── Daily quiz ─────────────────────────────────────────────────────
  quizTitle: localized('Daily Quiz', '每日问答'),
  quizIntro: localized('Three questions from places you can explore.', '三道题，来自你可以探索的地方。'),
  quizQuestionCountry: localized('In which country is this place?', '这个地方位于哪个国家？'),
  quizQuestionTradition: localized('Which tradition is this place most associated with?', '这个地方与哪个传统联系最深？'),
  quizQuestionCategory: localized('What kind of place is this?', '这是哪一类地方？'),
  quizCorrect: localized('Correct!', '答对了！'),
  quizWrong: localized('Not quite — try again.', '不太对 — 再试一次。'),
  quizDone: localized('Quiz complete! Come back tomorrow.', '问答完成！明天再来。'),
  quizDoneToday: localized('Done for today', '今日已完成'),
  quizNext: localized('Next question', '下一题'),
  quizTryAgain: localized('Try again', '再试一次'),

  // ── XP toasts ──────────────────────────────────────────────────────
  xpGained: localized('XP gained', '获得经验'),
  rankUp: localized('Rank up!', '晋级！'),
  achievementUnlocked: localized('Achievement unlocked', '成就解锁'),
  collectionCompleted: localized('Collection complete', '收藏集齐'),

  // ── Legends ────────────────────────────────────────────────────────
  legendBanner: localized(
    'Legend — not verified history. Candidate sites mark where people have looked, not proven ruins.',
    '传说 — 非已证实的历史。候选地点标示人们曾寻找之处，而非已证实的遗址。',
  ),
  legendFirstSource: localized('First known source', '最早已知来源'),
  legendWhyPersists: localized('Why the story endures', '故事何以流传'),
  legendTheories: localized('Leading theories', '主要学说'),
  legendRelatedPlace: localized('Related place in the atlas', '地图集中的相关地点'),
  legendClaimedSites: localized('Claimed locations', '传说中的地点'),
  legendExplore: localized('Open legend', '打开传说'),
  legendSeekerProgress: localized('Legend Seeker', '传说寻访者'),
} as const;

export type UiKey = keyof typeof UI;

export function t(key: UiKey, locale: Locale): string {
  return L(UI[key] as Localized<string>, locale);
}
