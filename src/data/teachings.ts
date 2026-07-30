import { localized } from '../i18n/types';
import type { Localized } from '../i18n/types';

export interface Teaching {
  text: Localized<string>;
  attribution: Localized<string>;
}

export const LOCATION_TEACHINGS: Record<string, Teaching> = {
  lumbini: {
    text: localized(
      'Even a prince, born into every comfort, must one day ask what suffering is — and whether there is a way beyond it.',
      '即便生在一切安逸之中的王子，终有一日也要追问：苦是什么，可有超越苦的道路。',
    ),
    attribution: localized(
      'Traditional reflection on the Buddha’s birthplace',
      '关于佛陀诞生地的传统省思',
    ),
  },
  'mahabodhi-temple': {
    text: localized(
      'Do not dwell in the past, do not dream of the future; concentrate the mind on the present moment.',
      '莫住过去，莫梦未来；当集中心念于当下这一刻。',
    ),
    attribution: localized('Attributed to the Buddha', '相传为佛陀所言'),
  },
  sarnath: {
    text: localized(
      'There is a middle path — avoiding the extremes of self-indulgence and self-torture — that leads to peace, insight and awakening.',
      '有一条中道 — 远离纵欲与自苦两端 — 能通向平静、智慧与觉悟。',
    ),
    attribution: localized(
      'First Sermon (Dhammacakkappavattana Sutta)',
      '《转法轮经》（初转法轮）',
    ),
  },
  nalanda: {
    text: localized(
      'Knowledge that is not shared is like a lamp under a cover; at a true university, minds meet so that light may travel farther.',
      '知识若不分享，犹如灯下覆罩；真正的学府里，心灵相遇，光芒才得远传。',
    ),
    attribution: localized(
      'Spirit of Nalanda’s scholarly community',
      '那烂陀学者共同体的精神',
    ),
  },
  varanasi: {
    text: localized(
      'What is born must die; what dies may be born again. The wise seek what neither birth nor death can touch.',
      '有生必有死，有死或再生。智者寻求生与死皆不能触碰的那一境。',
    ),
    attribution: localized(
      'Traditional teaching associated with Kashi',
      '与迦尸（瓦拉纳西）相关的传统教义',
    ),
  },
  'golden-temple': {
    text: localized(
      'There is no Hindu, there is no Muslim — only one God, and all people stand equal before the divine.',
      '无印度教徒，无穆斯林 — 唯有一神，人人在神前平等。',
    ),
    attribution: localized(
      'Guru Nanak (traditional saying)',
      '古鲁那纳克（传统说法）',
    ),
  },
  'ellora-caves': {
    text: localized(
      'Different paths may carve different caves from the same mountain — and still open onto the same sky of devotion.',
      '不同的道路，可从同一座山凿出不同的洞窟 — 却仍通向同一片虔敬的天空。',
    ),
    attribution: localized(
      'Reflection on Ellora’s shared sacred rock',
      '关于埃洛拉共有圣岩的省思',
    ),
  },
  'paro-taktsang': {
    text: localized(
      'Even the steepest cliff can become a nest of awakening when courage and compassion take wing together.',
      '即便最陡的悬崖，只要勇气与慈悲一同展翅，也能成为觉悟的巢。',
    ),
    attribution: localized(
      'Spirit of the Tiger’s Nest legend',
      '虎穴寺传说的精神',
    ),
  },
  'temple-of-the-tooth': {
    text: localized(
      'A relic is only as sacred as the reverence it awakens — true honour lives in a gentle mind.',
      '圣物之神圣，仅在于它所唤起的敬畏；真正的尊荣，住在柔软的心中。',
    ),
    attribution: localized(
      'Traditional Buddhist reflection',
      '佛教传统省思',
    ),
  },
  'shwedagon-pagoda': {
    text: localized(
      'Merit grows not from gold alone, but from the quiet gifts of kindness offered without asking for return.',
      '功德不只生于黄金，更生于不求回报、默默给予的善意。',
    ),
    attribution: localized(
      'Burmese Buddhist proverb (paraphrased)',
      '缅甸佛教谚语（意译）',
    ),
  },
  'angkor-wat': {
    text: localized(
      'Stone endures, dynasties fall. What outlasts both is the longing of the heart for the divine.',
      '石能久存，王朝会倾。比二者更长久的，是心灵对神圣的渴慕。',
    ),
    attribution: localized(
      'Reflection on Angkor’s sacred architecture',
      '关于吴哥圣建筑的省思',
    ),
  },
  borobudur: {
    text: localized(
      'Climb the levels of the path as you climb this mountain of stone: leave attachment below, and open into emptiness and light.',
      '攀此石山，如登道之阶：把执着留在下方，向上敞开于空与光明。',
    ),
    attribution: localized(
      'Teaching embodied in Borobudur’s design',
      '婆罗浮屠形制所体现的教义',
    ),
  },
  bagan: {
    text: localized(
      'A thousand temples rise from one plain — as countless acts of faith may rise from a single sincere heart.',
      '千座佛塔起于同一平原 — 无数虔信之举，亦可起于一颗真诚的心。',
    ),
    attribution: localized(
      'Reflection on Bagan’s landscape of devotion',
      '关于蒲甘虔敬景观的省思',
    ),
  },
  'jerusalem-old-city': {
    text: localized(
      'Pray for the peace of Jerusalem: may those who love you prosper. Peace be within your walls.',
      '你们要为耶路撒冷求平安：爱你的人必然兴旺。愿你城中有平安。',
    ),
    attribution: localized('Psalm 122:6–7', '诗篇 122:6–7'),
  },
  'church-of-the-nativity': {
    text: localized(
      'Glory to God in the highest, and on earth peace to people of good will.',
      '在至高之处荣耀归与神，在地上平安归于他所喜悦的人。',
    ),
    attribution: localized('Luke 2:14', '路加福音 2:14'),
  },
  'masjid-al-haram': {
    text: localized(
      'Indeed, the first House established for humankind was that at Bakkah — blessed and a guidance for the worlds.',
      '的确，为世人而设的第一座殿宇，确是在麦加的那座吉祥的天房、全世界的向导。',
    ),
    attribution: localized('Quran 3:96', '古兰经 3:96'),
  },
  'st-catherines-monastery': {
    text: localized(
      'Be still, and know that I am God.',
      '你们要休息，要知道我是神。',
    ),
    attribution: localized('Psalm 46:10', '诗篇 46:10'),
  },
  'registan-samarkand': {
    text: localized(
      'Seek knowledge even unto China — for learning is a light that no desert wind can put out.',
      '求知，即便远至中国 — 因为学问是光，沙漠之风也无法吹灭。',
    ),
    attribution: localized(
      'Hadith (widely cited in Silk Road learning culture)',
      '圣训（丝绸之路求学传统中广为引用）',
    ),
  },
  persepolis: {
    text: localized(
      'By the favour of Ahura Mazda I am king. May I never rule by fear alone, but by truth and good order.',
      '凭阿胡拉·马兹达之恩，我为王。愿我不以恐惧治国，惟以真理与良序。',
    ),
    attribution: localized(
      'Paraphrase of Achaemenid royal inscriptions',
      '阿契美尼德王室铭文意译',
    ),
  },
  'gobekli-tepe': {
    text: localized(
      'Long before cities, people gathered stones toward the sky — as if the first architecture of the human heart was wonder itself.',
      '早在城市出现之前，人们已把石头朝天空聚拢 — 仿佛人心最初的建筑，就是敬畏本身。',
    ),
    attribution: localized(
      'Reflection on humanity’s earliest known temple',
      '关于人类已知最早神庙的省思',
    ),
  },
  'mevlana-konya': {
    text: localized(
      'Come, come, whoever you are — wanderer, worshipper, lover of leaving. Ours is not a caravan of despair.',
      '来吧，来吧，无论你是谁 — 流浪者、礼拜者、爱离之人。我们的队伍，不是绝望的商队。',
    ),
    attribution: localized(
      'Attributed to Rumi (traditional invitation)',
      '相传为鲁米所作（传统邀请诗）',
    ),
  },
  'house-of-wisdom': {
    text: localized(
      'Translate what is true, test what is claimed, and share what is learned — for wisdom belongs to all who seek it.',
      '翻译真知，检验断言，分享所学 — 因为智慧属于一切寻求它的人。',
    ),
    attribution: localized(
      'Spirit of the Abbasid House of Wisdom',
      '阿拔斯王朝智慧宫的精神',
    ),
  },
  'acropolis-athens': {
    text: localized(
      'The unexamined life is not worth living.',
      '未经省察的人生不值得过。',
    ),
    attribution: localized(
      'Socrates (Plato, Apology)',
      '苏格拉底（柏拉图《申辩篇》）',
    ),
  },
  'platos-academy': {
    text: localized(
      'Let no one enter who is ignorant of geometry — for the soul that cannot see order cannot see the Good.',
      '不懂几何者不得入内 — 因为看不见秩序的灵魂，也看不见善。',
    ),
    attribution: localized(
      'Traditional motto of Plato’s Academy',
      '柏拉图学园传说门训',
    ),
  },
  delphi: {
    text: localized(
      'Know thyself. Nothing in excess.',
      '认识你自己。凡事勿过度。',
    ),
    attribution: localized(
      'Inscriptions at the Temple of Apollo, Delphi',
      '德尔斐阿波罗神庙铭文',
    ),
  },
  'hagia-sophia': {
    text: localized(
      'Wisdom has built her house; she has set up her seven pillars.',
      '智慧建造房屋，凿成七根柱子。',
    ),
    attribution: localized('Proverbs 9:1', '箴言 9:1'),
  },
  'st-peters-basilica': {
    text: localized(
      'You are Peter, and on this rock I will build my church.',
      '你是彼得，我要把我的教会建造在这磐石上。',
    ),
    attribution: localized('Matthew 16:18', '马太福音 16:18'),
  },
  'santiago-de-compostela': {
    text: localized(
      'The road itself teaches: every step taken in hope is already a kind of arrival.',
      '道路本身在教导：怀着希望迈出的每一步，已是一种抵达。',
    ),
    attribution: localized(
      'Pilgrim wisdom of the Camino',
      '朝圣之路的传统智慧',
    ),
  },
  'mont-saint-michel': {
    text: localized(
      'Between the tides of the world and the quiet of prayer, the soul learns when to stand firm and when to yield.',
      '在尘世潮汐与祷告的静默之间，灵魂学会何时站稳、何时退让。',
    ),
    attribution: localized(
      'Reflection on the Mount’s tidal solitude',
      '关于圣米歇尔山潮汐孤岛的省思',
    ),
  },
  meteora: {
    text: localized(
      'Lift up your hearts. Seek the heights not to escape the earth, but to see it more clearly in God’s light.',
      '你们当举心向上。攀高不是为了逃离尘世，而是为了在神的光中更清楚地看见它。',
    ),
    attribution: localized(
      'Spirit of Meteora’s monastic calling',
      '迈泰奥拉修道召唤的精神',
    ),
  },
  'mount-athos': {
    text: localized(
      'Be still, pray without ceasing, and let the heart become a quiet lamp before the Face of God.',
      '当静默，当不住祷告，让心成为神面光前一盏安静的灯。',
    ),
    attribution: localized(
      'Hesychast tradition of Mount Athos',
      '阿索斯山静修传统',
    ),
  },
  'university-of-bologna': {
    text: localized(
      'Law is the art of the good and the fair — and learning it together binds strangers into a commonwealth of reason.',
      '法律是关于善与公正的技艺 — 共同学习它，能使陌生人结为理性的共同体。',
    ),
    attribution: localized(
      'Medieval jurists’ maxim (ius est ars boni et aequi)',
      '中世纪法学格言（法律是善与公正的技艺）',
    ),
  },
  'canterbury-cathedral': {
    text: localized(
      'Whan that Aprille with his shoures soote… — the pilgrimage begins whenever the heart grows ready to seek healing.',
      '当四月带着甘美的阵雨到来…… — 只要心灵准备好寻求医治，朝圣便已开始。',
    ),
    attribution: localized(
      'Echo of Chaucer’s Canterbury Tales (spirit of pilgrimage)',
      '呼应乔叟《坎特伯雷故事集》（朝圣精神）',
    ),
  },
  stonehenge: {
    text: localized(
      'Mark the turning of the sun, and remember: we are small beneath the sky, yet capable of building toward it together.',
      '记住太阳的回转，并记取：我们在天空下虽渺小，却能同心朝它建造。',
    ),
    attribution: localized(
      'Reflection on Stonehenge’s solar alignment',
      '关于巨石阵太阳对齐的省思',
    ),
  },
  'temple-of-confucius-qufu': {
    text: localized(
      'At fifteen I set my heart on learning; at thirty I stood firm; at forty I had no doubts; at seventy I could follow my heart’s desire without overstepping.',
      '吾十有五而志于学，三十而立，四十而不惑，七十而从心所欲，不逾矩。',
    ),
    attribution: localized('Analects 2.4', '论语 2.4'),
  },
  'mount-tai': {
    text: localized(
      'When Confucius climbed Mount Tai, the world below seemed small — so does the mind that rises above petty cares.',
      '孔子登东山而小鲁，登泰山而小天下 — 心灵若能超乎琐屑忧虑，亦复如此。',
    ),
    attribution: localized('Mencius 7A.24 (paraphrased)', '孟子 7A.24（意译）'),
  },
  'shaolin-temple': {
    text: localized(
      'A special transmission outside the scriptures — not relying on words, pointing directly to the human mind, seeing one’s nature and becoming Buddha.',
      '教外别传，不立文字，直指人心，见性成佛。',
    ),
    attribution: localized(
      'Chan (Zen) teaching associated with Bodhidharma',
      '与菩提达摩相关的禅宗教法',
    ),
  },
  'mount-wudang': {
    text: localized(
      'The softest thing in the world overcomes the hardest. Softness and yielding are the way of life.',
      '天下之至柔，驰骋天下之至坚。柔弱者，生之徒。',
    ),
    attribution: localized('Dao De Jing 43 & 76 (combined sense)', '道德经 43、76（合义）'),
  },
  'white-horse-temple': {
    text: localized(
      'The Dharma came on a white horse — and still arrives whenever a sincere seeker carries truth across a border.',
      '佛法曾骑白马而来 — 每当真诚的求道者把真理带过边界，它仍在到来。',
    ),
    attribution: localized(
      'Legend of White Horse Temple’s founding',
      '白马寺建寺传说',
    ),
  },
  'mogao-caves': {
    text: localized(
      'Paint the scriptures on the rock so that future eyes may still meet the Buddha’s face — art is a form of transmission.',
      '把经义绘在岩壁上，好让后世的眼睛仍能遇见佛面 — 艺术亦是一种传法。',
    ),
    attribution: localized(
      'Spirit of the Mogao cave workshops',
      '莫高窟画工坊的精神',
    ),
  },
  'yuelu-academy': {
    text: localized(
      'Investigate things to the utmost, and extend knowledge to the utmost — then sincerity and right action can follow.',
      '致知在格物；物格而后知至 — 然后诚意正心，方能继之。',
    ),
    attribution: localized(
      'Zhu Xi’s Great Learning program (paraphrased)',
      '朱熹《大学》为学纲领（意译）',
    ),
  },
  'todai-ji': {
    text: localized(
      'All beings have Buddha-nature. Even the largest statue is only a reminder of the vastness already within.',
      '一切众生皆有佛性。即便最大的佛像，也只是提醒：那广阔早已在心中。',
    ),
    attribution: localized(
      'Mahayana teaching embodied at Tōdai-ji',
      '东大寺所体现的大乘教义',
    ),
  },
  'fushimi-inari': {
    text: localized(
      'Walk beneath a thousand gates, and learn: the sacred is not one destination, but a path of continual respect.',
      '走过千座鸟居，便明白：神圣不是一个终点，而是不断恭敬前行的道路。',
    ),
    attribution: localized(
      'Shinto spirit of the Inari pilgrimage',
      '稻荷参拜的神道精神',
    ),
  },
  'ise-grand-shrine': {
    text: localized(
      'Renew what is holy by returning to simplicity — purity of heart matters more than the age of the wood.',
      '以归于素朴来更新神圣 — 心之洁净，重于木材之新旧。',
    ),
    attribution: localized(
      'Spirit of the Shikinen Sengū rebuilding',
      '式年迁宫重建的精神',
    ),
  },
  'mount-fuji': {
    text: localized(
      'Climb if you must; but also sit and look. The mountain teaches patience before it teaches height.',
      '若必须攀登，便攀登；也当坐下凝望。山在教你高度之前，先教你耐心。',
    ),
    attribution: localized(
      'Japanese mountain pilgrimage wisdom',
      '日本山岳修行智慧',
    ),
  },
  bulguksa: {
    text: localized(
      'The Pure Land is not far away when the mind is clear — build beauty so that faith may find a home.',
      '心清净时，净土不远 — 建造美，好让信仰有所安住。',
    ),
    attribution: localized(
      'Spirit of Silla Buddhist art at Bulguksa',
      '佛国寺新罗佛教艺术的精神',
    ),
  },
  'dosan-seowon': {
    text: localized(
      'Cultivate yourself first; then the household, then the state. Scholarship without virtue is an empty vessel.',
      '修身齐家，而后治国。无德之学，如空器。',
    ),
    attribution: localized(
      'Neo-Confucian ethos of the seowon',
      '书院（书堂）的性理学精神',
    ),
  },
  'potala-palace': {
    text: localized(
      'Compassion is the root of a peaceful mind; a peaceful mind is the root of a peaceful world.',
      '慈悲是平静之心的根；平静之心是和平世界的根。',
    ),
    attribution: localized(
      'Dalai Lama tradition (paraphrased)',
      '达赖喇嘛传统教言（意译）',
    ),
  },
  'mount-emei': {
    text: localized(
      'On the misty path, each step is practice. The mountain does not hurry — neither should the seeker.',
      '云雾路上，步步是修行。山不急，求道者亦不当急。',
    ),
    attribution: localized(
      'Buddhist pilgrimage wisdom of Mount Emei',
      '峨眉山佛教朝圣智慧',
    ),
  },
  'library-of-alexandria': {
    text: localized(
      'Gather the books of the world under one roof — for a city that remembers becomes wiser than a city that only conquers.',
      '把世界的书聚于一屋 — 因为记得的城市，比只会征服的城市更智慧。',
    ),
    attribution: localized(
      'Spirit of the Library of Alexandria',
      '亚历山大图书馆的精神',
    ),
  },
  'al-azhar': {
    text: localized(
      'Seek knowledge from the cradle to the grave — and let learning soften the heart as well as sharpen the mind.',
      '求知，从摇篮到坟墓 — 让学问既锐利心智，也柔软心灵。',
    ),
    attribution: localized(
      'Islamic scholarly maxim (widely cited)',
      '伊斯兰学术格言（广为引用）',
    ),
  },
  'al-qarawiyyin': {
    text: localized(
      'A mosque may also be a school: prayer opens the morning; study fills the day; both honour the same Light.',
      '清真寺亦可为学堂：晨以礼拜开启，日以学问充实；二者皆尊同一光辉。',
    ),
    attribution: localized(
      'Spirit of al-Qarawiyyin’s dual calling',
      '卡鲁因大学双重使命的精神',
    ),
  },
  'timbuktu-sankore': {
    text: localized(
      'Salt comes from the north, gold from the south, and the word of God and the treasures of wisdom from Timbuktu.',
      '盐来自北方，金来自南方，真主之言与智慧的宝藏来自廷巴克图。',
    ),
    attribution: localized(
      'West African proverb on Timbuktu',
      '关于廷巴克图的西非谚语',
    ),
  },
  lalibela: {
    text: localized(
      'Carve heaven downward into the earth — so that faith may stand even when the world above is hard.',
      '把天堂向下凿进大地 — 好让信仰在上方的世界艰难时，仍能屹立。',
    ),
    attribution: localized(
      'Spirit of Lalibela’s rock-hewn churches',
      '拉利贝拉岩石教堂的精神',
    ),
  },
  'great-zimbabwe': {
    text: localized(
      'Build with stone without mortar, and the walls still hold — so do communities held by trust rather than force.',
      '无灰浆而筑石，墙仍屹立 — 靠信任而非强力维系的共同体，亦复如此。',
    ),
    attribution: localized(
      'Reflection on Great Zimbabwe’s dry-stone craft',
      '关于大津巴布韦干砌石工艺的省思',
    ),
  },
  teotihuacan: {
    text: localized(
      'Walk the Avenue of the Dead toward the sun — and remember that every people has sought the sky’s measure of time and meaning.',
      '沿亡灵大道走向太阳 — 并记取：每个民族都曾向天空求取时间与意义的尺度。',
    ),
    attribution: localized(
      'Reflection on Teotihuacan’s sacred axis',
      '关于特奥蒂瓦坎神圣轴线的省思',
    ),
  },
  'chichen-itza': {
    text: localized(
      'When light and shadow meet on the serpent’s stair, the calendar speaks: live in rhythm with the turning year.',
      '当光影在羽蛇阶上相遇，历法便开口：要与流转的年岁合拍而活。',
    ),
    attribution: localized(
      'Maya solar wisdom at El Castillo',
      '卡斯蒂略金字塔的玛雅太阳智慧',
    ),
  },
  'machu-picchu': {
    text: localized(
      'Build where the mountains meet the clouds — and honour both Pachamama below and Inti above with careful hands.',
      '在山与云相接处建造 — 以审慎之手，敬重下方的大地母亲与上方的太阳。',
    ),
    attribution: localized(
      'Inca sacred geography (paraphrased)',
      '印加神圣地理观（意译）',
    ),
  },
  cahokia: {
    text: localized(
      'Raise a mound toward the morning sun, and gather as one people — community itself can be a form of prayer.',
      '筑丘朝向晨阳，聚为一体之民 — 共同体本身，亦可成为一种祈祷。',
    ),
    attribution: localized(
      'Spirit of Cahokia’s mound-builder gatherings',
      '卡霍基亚筑丘聚会的精神',
    ),
  },
  uluru: {
    text: localized(
      'Listen to Country. The rock remembers older stories than any one life — walk softly, and leave the sacred places undisturbed.',
      '倾听土地（Country）。岩石记得比任何一生更古老的故事 — 轻步而行，勿扰圣地。',
    ),
    attribution: localized(
      'Anangu teaching on respect for Country',
      '阿南古人对敬重土地（Country）的教导',
    ),
  },
  'mount-kailash': {
    text: localized(
      'Some peaks are not for standing on. Walk around what you revere — and let the mountain remain taller than your ambition.',
      '有些峰顶不是为了站上去。绕行你所敬畏的 — 让山仍比你的野心更高。',
    ),
    attribution: localized(
      'Spirit of the Kailash kora (paraphrased)',
      '冈仁波齐转山精神（意译）',
    ),
  },
  ausangate: {
    text: localized(
      'A mountain can be a relative. Greet it, offer what you can, and leave with less pride than you brought.',
      '山可以是亲戚。问候它，献上你所能献的，带着比来时更少的骄傲离开。',
    ),
    attribution: localized(
      'Andean teaching on apus (paraphrased)',
      '安第斯关于阿普的教诲（意译）',
    ),
  },
  'galapagos-islands': {
    text: localized(
      'Look closely enough, and kinship appears where you expected only difference — the living world is one family wearing many forms.',
      '看得够细，亲缘就会出现在你本以为只有差异之处 — 活的世界是一家人，穿着许多形态。',
    ),
    attribution: localized(
      'Spirit of Darwin\u2019s Galápagos insight (paraphrased)',
      '达尔文加拉帕戈斯洞见的精神（意译）',
    ),
  },
  'svalbard-global-seed-vault': {
    text: localized(
      'Guard the seeds of what feeds us — for the future has a right to the diversity we almost spent.',
      '守护喂养我们的种子 — 因为未来有权拥有我们几乎耗尽的多样。',
    ),
    attribution: localized(
      'Spirit of the Global Seed Vault mission (paraphrased)',
      '全球种子库使命的精神（意译）',
    ),
  },
  'challenger-deep': {
    text: localized(
      'The deepest blue on the map is not empty. It is unread — and humility is the first instrument of exploration.',
      '地图上最深的蓝不是空虚。它只是尚未读过 — 而谦卑是探索的第一件仪器。',
    ),
    attribution: localized(
      'Reflection on the deep ocean (Atlas of Wisdom)',
      '关于深海的省思（智慧地图集）',
    ),
  },
};

export const PERSON_TEACHINGS: Record<string, Teaching> = {
  confucius: {
    text: localized(
      'Do not impose on others what you yourself do not desire.',
      '己所不欲，勿施于人。',
    ),
    attribution: localized('Analects 15.24', '论语 15.24'),
  },
  mencius: {
    text: localized(
      'The tendency of human nature to do good is like that of water to flow downward.',
      '人性之善也，犹水之就下也。',
    ),
    attribution: localized('Mencius 6A.2', '孟子 6A.2'),
  },
  'zhu-xi': {
    text: localized(
      'Study widely, inquire carefully, think clearly, distinguish rightly, and practise earnestly.',
      '博学之，审问之，慎思之，明辨之，笃行之。',
    ),
    attribution: localized(
      'Zhongyong (Doctrine of the Mean), as taught by Zhu Xi',
      '《中庸》（朱熹所传习）',
    ),
  },
  laozi: {
    text: localized(
      'The highest goodness is like water. Water benefits all things and does not compete.',
      '上善若水。水善利万物而不争。',
    ),
    attribution: localized('Dao De Jing 8', '道德经 8'),
  },
  buddha: {
    text: localized(
      'Hatred is never appeased by hatred in this world. By non-hatred alone is hatred appeased. This is an eternal law.',
      '在此世间，恨意绝不能止息恨意；唯有无恨才能止息恨意。这是永恒的法则。',
    ),
    attribution: localized('Dhammapada 5', '法句经 5'),
  },
  bodhidharma: {
    text: localized(
      'Buddhas don’t save buddhas. If you use your mind to look for a buddha, you won’t see the buddha. As long as you look for a buddha somewhere else, you’ll never see that your own mind is the buddha.',
      '佛不度佛。若用寻佛之心，终不见佛。心外觅佛，永不见自心即佛。',
    ),
    attribution: localized(
      'Bloodstream Sermon (attributed)',
      '《血脉论》（相传）',
    ),
  },
  xuanzang: {
    text: localized(
      'I would rather die going west in search of the Dharma than live going east without it.',
      '宁向西而死，不东归而生 — 不为无经而苟活。',
    ),
    attribution: localized(
      'Traditional vow of Xuanzang (paraphrased)',
      '玄奘西行誓愿（传统说法，意译）',
    ),
  },
  ashoka: {
    text: localized(
      'All people are my children. I desire for them every kind of welfare and happiness in this world and the next — just as I desire it for my own children.',
      '一切人民皆如我之子女。我愿他们今世来世皆得安乐福祉 — 正如我愿自己的子女如此。',
    ),
    attribution: localized('Ashoka’s Rock Edict (Kalinga)', '阿育王石刻敕令（羯陵伽）'),
  },
  socrates: {
    text: localized(
      'I know that I know nothing — and this knowledge of my ignorance is the beginning of wisdom.',
      '我知我一无所知 — 而知晓自己的无知，正是智慧的开端。',
    ),
    attribution: localized(
      'Socratic paradox (Plato’s dialogues)',
      '苏格拉底悖论（柏拉图对话录）',
    ),
  },
  plato: {
    text: localized(
      'Until philosophers are kings, or the kings and princes of this world have the spirit and power of philosophy, cities will never have rest from their evils.',
      '除非哲学家为王，或世上的王者具有哲学的精神与力量，城邦永无安宁之日。',
    ),
    attribution: localized('Republic 473c–d', '理想国 473c–d'),
  },
  aristotle: {
    text: localized(
      'We are what we repeatedly do. Excellence, then, is not an act but a habit.',
      '我们反复做的事，造就了我们。卓越因此不是一次行动，而是一种习惯。',
    ),
    attribution: localized(
      'Nicomachean Ethics (popular paraphrase of Aristotle’s virtue ethic)',
      '尼各马可伦理学（亚里士多德德性论的通行意译）',
    ),
  },
  jesus: {
    text: localized(
      'Love your enemies, do good to those who hate you, bless those who curse you, pray for those who mistreat you.',
      '要爱你们的仇敌，善待恨你们的人；祝福咒诅你们的，为凌辱你们的祷告。',
    ),
    attribution: localized('Luke 6:27–28', '路加福音 6:27–28'),
  },
  muhammad: {
    text: localized(
      'None of you truly believes until he loves for his brother what he loves for himself.',
      '你们中任何人，都不算真正归信，直到他爱弟兄如爱自己所欲。',
    ),
    attribution: localized('Hadith (Bukhari & Muslim)', '圣训（布哈里与穆斯林）'),
  },
  rumi: {
    text: localized(
      'Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.',
      '你的功课不是去寻找爱，而只是寻找并拆除你在自己内心筑起、用以抵挡爱的那些屏障。',
    ),
    attribution: localized('Rumi (traditional attribution)', '鲁米（传统归属）'),
  },
  'guru-nanak': {
    text: localized(
      'There is no Hindu, there is no Muslim. Realise the One behind all names — and live by honest work, sharing, and remembrance.',
      '无印度教徒，无穆斯林。体认万名背后的那一 — 并以诚实劳作、分享与忆念而活。',
    ),
    attribution: localized(
      'Guru Nanak (core Sikh teaching, paraphrased)',
      '古鲁那纳克（锡克教核心教义，意译）',
    ),
  },
  'ibn-battuta': {
    text: localized(
      'Travel leaves you speechless, then turns you into a storyteller — for the world is wider than any one homeland, and strangers may yet become kin.',
      '旅行先让你哑口无言，再把你变成说故事的人 — 因为世界比任何故乡都广阔，而陌生人仍可能成为亲人。',
    ),
    attribution: localized(
      'Spirit of Ibn Battuta’s Rihla (paraphrased)',
      '伊本·白图泰《游记》的精神（意译）',
    ),
  },
};
