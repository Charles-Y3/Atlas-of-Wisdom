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
  homeGreetingFirst: localized(
    'The atlas is open. Where will you look first?',
    '地图集已打开。你想先望向何处？',
  ),
  homeGreetingReturn: localized(
    'Welcome back, explorer. Another place is waiting.',
    '欢迎回来，探索者。又有一处在等你。',
  ),
  homeGreetingStreak: localized(
    'Your journey continues — the path remembers your steps.',
    '旅途仍在继续——这条路记得你的脚步。',
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
  homeOnThisDay: localized('On This Day', '历史上的今日'),
  homeOnThisDaySub: localized(
    'A moment from the atlas, chosen for today.',
    '今日从地图集中拣选的一则往事。',
  ),
  homeQuestOfMonth: localized('Quest of the Month', '本月旅程'),
  homeQuestOfMonthSub: localized("This month's pilgrimage", '本月的朝圣之路'),
  streakRitual: localized('{n}-day journey', '{n} 日之旅'),
  streakRitual3: localized('Three days on the path', '三日在路上'),
  streakRitual7: localized('A week of wonder', '一周的惊奇'),
  streakRitual30: localized('A month of seeking', '一月的求索'),
  streakRitualHint: localized(
    'Return tomorrow to keep the flame — gifts at 3, 7 and 30 days.',
    '明天再来，火焰不灭 — 第 3、7、30 天有旅途礼物。',
  ),
  streakRitualNext: localized('Next gift at {n} days (+{xp} XP)', '下一份礼物：{n} 天（+{xp} 经验）'),
  streakBonus: localized('Streak gift', '连续探索礼物'),
  rankLadderTitle: localized('Explorer ranks', '探索者等级'),
  rankLadderCurrent: localized('Current', '当前'),
  rankLadderNeed: localized('{n} XP to reach', '还需 {n} 经验到达'),
  rankLadderTap: localized('Tap a rank to learn more', '点按等级查看简介'),
  scrollMoreHint: localized('Swipe for more', '向右滑动查看更多'),

  // ── Atlas ──────────────────────────────────────────────────────────
  atlasTitle: localized('World Atlas', '世界地图'),
  atlasAll: localized('All', '全部'),
  atlasQuestTrail: localized('Quest trail', '旅程路线'),
  atlasClearQuestTrail: localized('Clear trail', '清除路线'),
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
  settingsYounger: localized('Younger explorer', '少年探索者'),
  settingsYoungerHint: localized(
    'Shorter stories and simpler reflection questions.',
    '更短的故事，更简单的反思问题。',
  ),
  settingsSound: localized('Celebration sounds', '庆祝音效'),
  settingsSoundHint: localized(
    'A soft chime when you rank up or unlock an achievement. Off by default.',
    '晋级或解锁成就时轻响一声。默认关闭。',
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
  locSealXp: localized('Place sealed!', '地点已盖印！'),
  locSealTitle: localized('Seal this place', '为此地盖印'),
  locSealIntro: localized(
    'Answer two short questions to mark this place as visited. Wrong answers do not advance — try again.',
    '答对两道简短题，即可将此地记为已到访。答错不会前进 — 再试一次。',
  ),
  locSealDone: localized('Place sealed', '地点已盖印'),
  locReadBonus: localized('Read to the end — bonus XP', '读完全部 — 奖励经验'),
  locMarkRead: localized('I have finished reading', '我已读完'),
  locReadDone: localized('Story complete', '故事已读完'),

  // ── Virtues & reflection ───────────────────────────────────────────
  locVirtues: localized('What this place teaches', '此地予人的启示'),
  reflectTitle: localized('Take a moment', '停一停'),
  reflectIntro: localized(
    'You have read the story. Now one question — there is no right answer, and only you will see it. Saving ticks this place on your Virtue Compass.',
    '故事你已读完。现在一个问题 — 没有标准答案，也只有你自己会看到。保存后会在德行罗盘上记下此地。',
  ),
  reflectPlaceholder: localized('Write a few honest lines…', '诚实地写下几行…'),
  reflectSave: localized('Save reflection', '保存反思'),
  reflectSaved: localized('Reflection saved', '反思已保存'),
  reflectionSaved: localized('Reflection saved', '反思已保存'),
  reflectMinHint: localized('A few more words…', '再多写几个字…'),
  reflectYours: localized('You wrote', '你写下的'),
  reflectSkip: localized('Maybe later', '稍后再说'),

  practiceTitle: localized('A small practice', '一点小小的练习'),
  practiceIntro: localized(
    'Optional. Accept a tiny practice for this place — it also counts on your Virtue Compass.',
    '可选。接受此地的一点小练习 — 同样会记入你的德行罗盘。',
  ),
  practiceAccept: localized('I will try this', '我愿意试试'),
  practiceDone: localized('Practice noted', '练习已记下'),
  practiceYours: localized('Your practice', '你的练习'),
  practiceSaved: localized('Practice noted', '练习已记下'),

  compassTitle: localized('Virtue Compass', '德行罗盘'),
  compassIntro: localized(
    'The shape of places you have reflected on — or practised with.',
    '你曾反思或践行过的地方所呈现的形状。',
  ),
  compassEmpty: localized(
    'Write a reflection or accept a practice, and your compass will take shape.',
    '写下反思或接受练习，你的罗盘就会显出形状。',
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
  discoverAnyVirtue: localized('Any', '全部'),
  discoverFilterHint: localized('Prefer places of…', '偏好这些德行的地方…'),

  // ── Quests ─────────────────────────────────────────────────────────
  questsTitle: localized('Quests', '旅程'),
  questsSubtitle: localized(
    'Read each clue, then name the place — filter by country if it helps. Visiting a pin alone does not count. Trails appear only after you answer clues correctly.',
    '读懂每条线索，再点出地名——可按国家筛选。仅到访地点不算找到。路线只在答对线索后才会出现。',
  ),
  questProgress: localized('found', '已找到'),
  questComplete: localized('A pilgrimage complete', '一段朝圣之路完成了'),
  questStepDone: localized('Place found!', '找到了！'),
  questClue: localized('Clue', '线索'),
  questSearchAtlas: localized('Search the Atlas', '打开地图寻找'),
  questGuessCountry: localized('Country', '国家'),
  questGuessPlace: localized('Place', '地点'),
  questGuessSubmit: localized('This is the place', '就是这里'),
  questGuessWrong: localized('Not quite — try another place.', '不太对——换一处再试。'),
  questGuessPickCountry: localized('Choose a country…', '选择国家…'),
  questGuessPickPlace: localized('Choose a place…', '选择地点…'),
  questSerendipityTitle: localized('Serendipity', '偶遇'),
  questSerendipityBlurb: localized(
    'No path planned — let the atlas surprise you.',
    '不设路线——让地图集给你一个惊喜。',
  ),
  questNudge: localized('{n} clues left to find', '还剩 {n} 条线索待寻'),
  questShowTrail: localized('Show trail on Atlas', '在地图上显示路线'),
  questTrailPreview: localized('Trail', '路线'),
  questTrailHint: localized(
    'The trail links only places you named correctly for this quest — sealing a visit elsewhere does not add a stop.',
    '路线只连接你在此旅程中答对的地点 — 在别处盖印到访不会加入路线。',
  ),
  questTrailLocked: localized(
    'Answer two clues correctly to unlock the trail. Visiting places does not count.',
    '答对两条线索后解锁路线。仅到访地点不算。',
  ),
  questKindPilgrimage: localized('Pilgrimage', '朝圣'),
  questKindLearning: localized('Learning', '求学'),
  questKindMountain: localized('Mountains', '山岳'),
  questKindRoute: localized('Route', '通道'),
  questKindDevotion: localized('Devotion', '虔敬'),

  // ── Collections ────────────────────────────────────────────────────
  collectionTitle: localized('Collections', '收藏'),
  collectionSubtitle: localized('Every place you explore joins your atlas.', '你探索过的每个地方，都会收入你的地图集。'),
  collectionSubtitleVirtues: localized(
    'Virtue collections grow when you reflect or accept a practice — not just seal a visit.',
    '德行收藏在你写下反思或接受练习后增长——不只是盖印到访。',
  ),
  collectionSubtitleGallery: localized(
    'Parchment plates for every place you have sealed.',
    '你已盖印的每一处地点的羊皮纸插画。',
  ),
  collectionGalleryEmpty: localized(
    'Seal a place with its place check to collect its plate here.',
    '通过地点测验盖印后，插画会出现在这里。',
  ),
  collectionComplete: localized('Complete!', '已集齐！'),
  collectionProgress: localized('collected', '已收集'),
  collectionLocked: localized('Keep exploring to reveal this collection.', '继续探索以揭开这个收藏。'),
  collectionTabPlaces: localized('Places', '地点'),
  collectionTabVirtues: localized('Virtues', '德行'),
  collectionTabGallery: localized('Plates', '插画'),
  collectionNudge: localized('{n} more to complete', '还差 {n} 处即可集齐'),

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
  profileExportPassport: localized('Export passport', '导出探索护照'),
  journalTitle: localized('My Reflections', '我的反思'),
  journalEmpty: localized(
    'Finish a story and take a moment to reflect — your words stay here, private and local.',
    '读完一则故事后停下来反思——你写下的话只会留在本地，仅你可见。',
  ),
  journalAllVirtues: localized('All', '全部'),
  journalExpand: localized('Show more', '展开'),
  journalCollapse: localized('Show less', '收起'),
  reflectReopen: localized('Take a moment', '停一停'),
  profileTabOverview: localized('Overview', '概览'),
  profileTabJourney: localized('Journey', '旅途'),
  profileTabAchievements: localized('Achievements', '成就'),
  profileTabSettings: localized('Settings', '设置'),

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
  rankUp: localized('A new rank on the path', '路上又进一阶'),
  achievementUnlocked: localized('A milestone along the way', '途中又一个里程碑'),
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
