import { localized } from '../i18n/types';
import type { Localized } from '../i18n/types';

// Virtues are the app's "spiritual journey" thread: each place is tagged
// with the human qualities its story embodies. Deliberately chosen to be
// cross-traditional — the same virtue is honoured by Confucian academies,
// Sufi shrines and Andean citadels alike, which is the whole point. They
// are descriptive of the place's story, never a ranking of traditions.

export type VirtueId =
  | 'wisdom'
  | 'compassion'
  | 'courage'
  | 'humility'
  | 'devotion'
  | 'perseverance'
  | 'harmony'
  | 'justice'
  | 'wonder';

export interface Virtue {
  id: VirtueId;
  name: Localized<string>;
  emoji: string;
  /** Shown on the Virtue Compass and in virtue collections. */
  blurb: Localized<string>;
  /** Open question offered after finishing a story tagged with this virtue. */
  reflection: Localized<string>;
}

export const VIRTUES: Virtue[] = [
  {
    id: 'wisdom',
    name: localized('Wisdom', '智慧'),
    emoji: '🦉',
    blurb: localized(
      'Places built for learning, questioning and the patient pursuit of understanding.',
      '为学习、质疑与耐心求索而建的地方。',
    ),
    reflection: localized(
      'What is one thing you believed a year ago that you see differently now?',
      '有什么是你一年前深信不疑、如今却看法不同的？',
    ),
  },
  {
    id: 'compassion',
    name: localized('Compassion', '慈悲'),
    emoji: '🤲',
    blurb: localized(
      'Places where care for others — the poor, the stranger, the suffering — was made concrete.',
      '将对他人的关怀 — 对贫者、异乡人、受苦者 — 化为实事的地方。',
    ),
    reflection: localized(
      'Who in your life could use kindness this week, and what would it cost you to offer it?',
      '这一周里，你身边谁需要一份善意？给出它，你需要付出什么？',
    ),
  },
  {
    id: 'courage',
    name: localized('Courage', '勇气'),
    emoji: '🔥',
    blurb: localized(
      'Places marked by people who spoke, stayed or set out when it would have been easier not to.',
      '铭刻着那些本可退却、却选择发声、坚守或启程的人的地方。',
    ),
    reflection: localized(
      'What would you attempt if you knew no one would judge the outcome?',
      '如果没有人评判结果，你会去尝试什么？',
    ),
  },
  {
    id: 'humility',
    name: localized('Humility', '谦逊'),
    emoji: '🌾',
    blurb: localized(
      'Places whose builders bowed — to a mountain, a mystery, or the limits of their own knowing.',
      '建造者选择俯身的地方 — 向一座山、一个奥秘，或自身认知的边界。',
    ),
    reflection: localized(
      'When did you last say "I do not know" — and what happened after?',
      '你上一次说“我不知道”是什么时候？之后发生了什么？',
    ),
  },
  {
    id: 'devotion',
    name: localized('Devotion', '虔敬'),
    emoji: '🕯️',
    blurb: localized(
      'Places shaped by people who gave their days to something larger than themselves.',
      '由那些将岁月献给超越自身之事的人所塑造的地方。',
    ),
    reflection: localized(
      'What do you give your time to most freely? Is that what you would choose?',
      '你最心甘情愿把时间给了什么？那是你会选择的吗？',
    ),
  },
  {
    id: 'perseverance',
    name: localized('Perseverance', '恒毅'),
    emoji: '⛰️',
    blurb: localized(
      'Places that took lifetimes — sometimes centuries — and were finished by people who never saw them whole.',
      '耗费毕生、有时数百年才建成的地方 — 完成它的人，从未见过它的全貌。',
    ),
    reflection: localized(
      'What are you building slowly that will not be finished this year?',
      '你正在缓慢建造什么，而它今年不会完成？',
    ),
  },
  {
    id: 'harmony',
    name: localized('Harmony', '和合'),
    emoji: '☯️',
    blurb: localized(
      'Places where different peoples, faiths or forces were held together rather than driven apart.',
      '让不同的人群、信仰或力量共处而非分裂的地方。',
    ),
    reflection: localized(
      'Where in your life are you holding a tension that does not need to be resolved, only balanced?',
      '你生活中有什么张力，其实无需解决，只需平衡？',
    ),
  },
  {
    id: 'justice',
    name: localized('Justice', '公义'),
    emoji: '⚖️',
    blurb: localized(
      'Places tied to fairness, equality and the courage to say a wrong is a wrong.',
      '与公平、平等，以及敢于直言其非的勇气相连的地方。',
    ),
    reflection: localized(
      'What small unfairness have you grown used to overlooking?',
      '有什么细小的不公，你已习惯视而不见？',
    ),
  },
  {
    id: 'wonder',
    name: localized('Wonder', '惊叹'),
    emoji: '✨',
    blurb: localized(
      'Places that make people look up — at stars, at scale, at the strangeness of being here at all.',
      '让人抬头仰望的地方 — 望星辰、望宏阔，望“存在于此”本身的奇异。',
    ),
    reflection: localized(
      'When did something last stop you in your tracks? What made it worth pausing for?',
      '上一次让你驻足的是什么？它为何值得停下？',
    ),
  },
];

export const VIRTUE_BY_ID: Record<VirtueId, Virtue> = Object.fromEntries(
  VIRTUES.map((v) => [v.id, v]),
) as Record<VirtueId, Virtue>;
