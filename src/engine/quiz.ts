import type { Localized } from '../i18n/types';
import { LOCATIONS } from '../data/locations';
import { CATEGORY_BY_ID, TRADITION_BY_ID } from '../data/categories';
import type { AtlasLocation } from '../data/types';
import { hashString, seededOrder } from './daily';

export type QuizKind = 'country' | 'tradition' | 'category';

export interface QuizQuestion {
  location: AtlasLocation;
  kind: QuizKind;
  options: Localized<string>[];
  correctIndex: number;
}

const KINDS: QuizKind[] = ['country', 'tradition', 'category'];

function answerFor(loc: AtlasLocation, kind: QuizKind): Localized<string> {
  if (kind === 'country') return loc.country;
  if (kind === 'tradition') return TRADITION_BY_ID[loc.traditions[0]].name;
  return CATEGORY_BY_ID[loc.category].name;
}

/** Unique decoy pool for a question kind, excluding the correct answer. */
function decoyPool(loc: AtlasLocation, kind: QuizKind): Localized<string>[] {
  const correct = answerFor(loc, kind).en;
  const seen = new Set<string>([correct]);
  const pool: Localized<string>[] = [];
  for (const other of LOCATIONS) {
    const candidate = answerFor(other, kind);
    if (!seen.has(candidate.en)) {
      seen.add(candidate.en);
      pool.push(candidate);
    }
  }
  return pool;
}

function pickKind(loc: AtlasLocation, preferred: QuizKind): QuizKind {
  if (preferred === 'tradition') {
    if (!loc.traditions.length || decoyPool(loc, 'tradition').length < 3) return 'category';
  }
  return preferred;
}

/** Build one MCQ with seeded decoys + option order. */
export function buildQuestion(loc: AtlasLocation, kind: QuizKind, seed: string): QuizQuestion {
  const resolved = pickKind(loc, kind);
  const correct = answerFor(loc, resolved);
  const pool = decoyPool(loc, resolved);
  const order = seededOrder(`${seed}:decoys`, pool.length);
  const decoys = order.slice(0, Math.min(3, pool.length)).map((i) => pool[i]);
  const options = [correct, ...decoys];
  const shuffle = seededOrder(`${seed}:opts`, options.length);
  const shuffled = shuffle.map((i) => options[i]);
  return {
    location: loc,
    kind: resolved,
    options: shuffled,
    correctIndex: shuffle.indexOf(0),
  };
}

/** Re-order existing choices after a wrong answer (same fact, new positions). */
export function reshuffleQuestion(q: QuizQuestion, seed: string): QuizQuestion {
  const correct = q.options[q.correctIndex];
  const shuffle = seededOrder(seed, q.options.length);
  const shuffled = shuffle.map((i) => q.options[i]);
  return {
    ...q,
    options: shuffled,
    correctIndex: shuffled.findIndex((o) => o.en === correct.en),
  };
}

/**
 * Deterministic 3-question daily quiz: everyone sees the same questions on
 * the same local date. Each question: 4 options, mastery-gated in the UI.
 */
export function dailyQuizQuestions(dayKey: string): QuizQuestion[] {
  const used = new Set<string>();
  return [0, 1, 2].map((qi) => dailyQuizQuestionVariant(dayKey, qi, 0, used));
}

/**
 * Slot question for the daily quiz. `variant` advances after two wrongs so
 * the explorer cannot brute-force the same item.
 */
export function dailyQuizQuestionVariant(
  dayKey: string,
  slot: number,
  variant: number,
  usedLocations: Set<string>,
): QuizQuestion {
  const kind = KINDS[(slot + variant) % KINDS.length];
  let idx = hashString(`quiz:${dayKey}:${slot}:v${variant}`) % LOCATIONS.length;
  let guard = 0;
  while (usedLocations.has(LOCATIONS[idx].id) && guard < LOCATIONS.length) {
    idx = (idx + 1) % LOCATIONS.length;
    guard++;
  }
  const loc = LOCATIONS[idx];
  usedLocations.add(loc.id);
  return buildQuestion(loc, kind, `quiz:${dayKey}:${slot}:v${variant}`);
}

/**
 * Two mastery-gated questions that seal a place as "visited".
 * Drawn from the place's country / tradition / category — never from
 * unfound quest hints.
 */
export function placeCheckQuestions(locationId: string): QuizQuestion[] {
  return [0, 1].map((qi) => placeCheckQuestionVariant(locationId, qi, 0)).filter(Boolean) as QuizQuestion[];
}

/** Place-seal step; `variant` bumps after two wrongs (new kind / decoys). */
export function placeCheckQuestionVariant(
  locationId: string,
  step: number,
  variant: number,
): QuizQuestion | null {
  const loc = LOCATIONS.find((l) => l.id === locationId);
  if (!loc) return null;
  const baseKinds: QuizKind[] = ['country', loc.traditions.length ? 'tradition' : 'category'];
  const kind = KINDS[(KINDS.indexOf(baseKinds[step] ?? 'category') + variant) % KINDS.length];
  return buildQuestion(loc, kind, `place-check:${locationId}:${step}:v${variant}`);
}
