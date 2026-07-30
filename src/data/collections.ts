import { localized } from '../i18n/types';
import type { CollectionDef } from './types';
import { VIRTUES } from './virtues';

/**
 * Virtue collections deliberately cut *across* traditions — "Places of
 * Compassion" spans Buddhist, Christian and Sikh sites alike. That
 * crossing is the point: it shows different traditions arriving at the
 * same human qualities, which is the thesis the whole app rests on.
 */
const VIRTUE_COLLECTIONS: CollectionDef[] = VIRTUES.map((v) => ({
  id: `virtue-${v.id}`,
  name: localized(`Places of ${v.name.en}`, `${v.name.zh}之地`),
  emoji: v.emoji,
  description: v.blurb,
  match: (l) => l.virtues.includes(v.id),
  kind: 'virtues',
}));

// Collections are predicates over locations — new content automatically
// joins the right collections, nothing is hand-maintained.
export const COLLECTIONS: CollectionDef[] = [
  {
    id: 'unesco-collector',
    name: localized('UNESCO Collector', '世界遗产收藏家'),
    emoji: '🏵️',
    description: localized(
      'Explore every UNESCO World Heritage Site in the atlas.',
      '探索地图集中每一处联合国教科文组织世界遗产。',
    ),
    match: (l) => Boolean(l.unesco),
    kind: 'places',
  },
  {
    id: 'sacred-mountains',
    name: localized('Sacred Mountains', '圣山'),
    emoji: '🏔️',
    description: localized(
      'Stand at the foot of every holy peak.',
      '走到每一座圣山脚下。',
    ),
    match: (l) => l.category === 'sacred-mountain',
    kind: 'places',
  },
  {
    id: 'confucian-heritage',
    name: localized('Confucian Heritage', '儒家遗产'),
    emoji: '📖',
    description: localized(
      'Trace the world the great teacher and his students built.',
      '追寻至圣先师与弟子们建立的世界。',
    ),
    match: (l) => l.traditions.includes('confucianism'),
    kind: 'places',
  },
  {
    id: 'buddhist-world',
    name: localized('The Buddhist World', '佛教世界'),
    emoji: '🪷',
    description: localized(
      'Follow the lotus from India across all of Asia.',
      '追随莲花，从印度走遍亚洲。',
    ),
    match: (l) => l.traditions.includes('buddhism'),
    kind: 'places',
  },
  {
    id: 'daoist-ways',
    name: localized('Daoist Ways', '道家之路'),
    emoji: '☯️',
    description: localized(
      'Visit the mountains and temples where the Way is studied.',
      '走访研习大道的山川与宫观。',
    ),
    match: (l) => l.traditions.includes('daoism'),
    kind: 'places',
  },
  {
    id: 'centres-of-learning',
    name: localized('Centres of Learning', '学问中心'),
    emoji: '🎓',
    description: localized(
      'Collect the academies, universities and libraries that kept knowledge alive.',
      '收集让知识生生不息的书院、大学与藏书楼。',
    ),
    match: (l) => l.category === 'academy' || l.category === 'university' || l.category === 'library',
    kind: 'places',
  },
  {
    id: 'paths-of-pilgrimage',
    name: localized('Paths of Pilgrimage', '朝圣之路'),
    emoji: '🥾',
    description: localized(
      'Walk, in spirit, the roads that millions have walked in faith.',
      '在心中走过千万人虔诚走过的道路。',
    ),
    match: (l) => l.category === 'pilgrimage-site',
    kind: 'places',
  },
  {
    id: 'ancient-echoes',
    name: localized('Ancient Echoes', '远古回声'),
    emoji: '🏺',
    description: localized(
      'Uncover the archaeological sites where civilisation first spoke.',
      '发掘文明最初发声的考古遗址。',
    ),
    match: (l) => l.category === 'archaeological-site',
    kind: 'places',
  },
  ...VIRTUE_COLLECTIONS,
];
