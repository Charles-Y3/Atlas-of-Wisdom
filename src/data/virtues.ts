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
  /** Simpler prompt when Younger explorer mode is on. */
  reflectionYoung: Localized<string>;
  /** Optional tiny practice that also ticks this virtue for a place. */
  practice: Localized<string>;
  practiceYoung: Localized<string>;
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
    reflectionYoung: localized(
      'What is something new you learned this week?',
      '这一周你学到了什么新东西？',
    ),
    practice: localized(
      'Ask one honest question today — and really listen to the answer.',
      '今天提出一个诚实的问题 — 并认真倾听回答。',
    ),
    practiceYoung: localized(
      'Learn one new fact and tell someone about it.',
      '学一个新知识，讲给别人听。',
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
    reflectionYoung: localized(
      'Who could you be kind to today?',
      '今天你可以对谁善良一点？',
    ),
    practice: localized(
      'Do one small kindness for someone who cannot repay you.',
      '为无法回报你的人做一件小小的善事。',
    ),
    practiceYoung: localized(
      'Do one kind thing for someone today.',
      '今天为别人做一件好事。',
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
    reflectionYoung: localized(
      'What brave thing would you like to try?',
      '你想勇敢地试一试什么？',
    ),
    practice: localized(
      'Name one thing you have been putting off, then take the smallest next step.',
      '说出一件你一直在拖延的事，然后迈出最小的下一步。',
    ),
    practiceYoung: localized(
      'Try one small brave thing today — even a tiny try counts.',
      '今天试一件小小的勇敢的事 — 小小的尝试也算。',
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
    reflectionYoung: localized(
      'When was it okay to say “I don’t know”?',
      '什么时候说“我不知道”其实没关系？',
    ),
    practice: localized(
      'Admit one thing you do not know, and ask someone who might.',
      '承认一件你不知道的事，并向可能知道的人请教。',
    ),
    practiceYoung: localized(
      'Say “I don’t know” once today — then ask for help.',
      '今天说一次“我不知道” — 然后去请教。',
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
    reflectionYoung: localized(
      'What do you love spending time on?',
      '你最喜欢把时间花在什么上？',
    ),
    practice: localized(
      'Give twenty quiet minutes to what you claim to care about most.',
      '把二十分钟安静时间给那件你声称最在乎的事。',
    ),
    practiceYoung: localized(
      'Spend ten focused minutes on something you love.',
      '专心花十分钟在你喜爱的事上。',
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
    reflectionYoung: localized(
      'What are you practising that takes many tries?',
      '你在练习什么需要很多次才能做好的事？',
    ),
    practice: localized(
      'Return to one unfinished task and move it forward by a single step.',
      '回到一件未完成的事，推进一小步。',
    ),
    practiceYoung: localized(
      'Practise something hard once more today.',
      '今天再练习一次难的事情。',
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
    reflectionYoung: localized(
      'How do you help friends get along?',
      '你怎样帮助朋友们好好相处？',
    ),
    practice: localized(
      'Hold two opposing views in mind without choosing a winner yet.',
      '同时容纳两种对立看法，暂不急着分出胜负。',
    ),
    practiceYoung: localized(
      'Help two people understand each other a little better.',
      '帮助两个人彼此多理解一点。',
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
    reflectionYoung: localized(
      'When have you seen something unfair, and what did you do?',
      '你见过什么不公平的事？你做了什么？',
    ),
    practice: localized(
      'Speak up once where silence would have been easier.',
      '在沉默更容易的地方，勇敢发一次声。',
    ),
    practiceYoung: localized(
      'If something feels unfair, say so kindly once.',
      '若觉得不公平，温和地说一次。',
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
    reflectionYoung: localized(
      'What made you say “wow” lately?',
      '最近什么事让你忍不住说“哇”？',
    ),
    practice: localized(
      'Pause once today for something beautiful — no phone, just notice.',
      '今天为美好停一次 — 不看手机，只是留意。',
    ),
    practiceYoung: localized(
      'Find one “wow” thing outdoors or in the sky.',
      '在户外或天空里找一件让你说“哇”的事。',
    ),
  },
];

export const VIRTUE_BY_ID: Record<VirtueId, Virtue> = Object.fromEntries(
  VIRTUES.map((v) => [v.id, v]),
) as Record<VirtueId, Virtue>;
