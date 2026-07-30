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

/**
 * Deterministic 3-question daily quiz: everyone sees the same questions on
 * the same local date. Each question: 4 options, mastery-gated in the UI.
 */
export function dailyQuizQuestions(dayKey: string): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const usedLocations = new Set<string>();

  for (let qi = 0; qi < 3; qi++) {
    const kind = KINDS[qi % KINDS.length];
    // Pick a location not already used today.
    let idx = hashString(`quiz:${dayKey}:${qi}`) % LOCATIONS.length;
    while (usedLocations.has(LOCATIONS[idx].id)) idx = (idx + 1) % LOCATIONS.length;
    const loc = LOCATIONS[idx];
    usedLocations.add(loc.id);

    const correct = answerFor(loc, kind);
    const pool = decoyPool(loc, kind);
    const order = seededOrder(`decoys:${dayKey}:${qi}`, pool.length);
    const decoys = order.slice(0, Math.min(3, pool.length)).map((i) => pool[i]);

    const options = [correct, ...decoys];
    const shuffle = seededOrder(`options:${dayKey}:${qi}`, options.length);
    const shuffled = shuffle.map((i) => options[i]);
    questions.push({
      location: loc,
      kind,
      options: shuffled,
      correctIndex: shuffle.indexOf(0),
    });
  }
  return questions;
}

/**
 * Two mastery-gated questions that seal a place as "visited".
 * Drawn from the place's country / tradition / category — never from
 * unfound quest hints.
 */
export function placeCheckQuestions(locationId: string): QuizQuestion[] {
  const loc = LOCATIONS.find((l) => l.id === locationId);
  if (!loc) return [];
  const kinds: QuizKind[] = ['country', loc.traditions.length ? 'tradition' : 'category'];
  if (kinds[1] === 'tradition' && loc.traditions.length === 0) kinds[1] = 'category';
  // Prefer country + category when tradition decoys are thin.
  if (kinds[1] === 'tradition' && decoyPool(loc, 'tradition').length < 3) {
    kinds[1] = 'category';
  }

  return kinds.map((kind, qi) => {
    const correct = answerFor(loc, kind);
    const pool = decoyPool(loc, kind);
    const order = seededOrder(`place-check:${locationId}:decoys:${qi}`, pool.length);
    const decoys = order.slice(0, Math.min(3, pool.length)).map((i) => pool[i]);
    const options = [correct, ...decoys];
    const shuffle = seededOrder(`place-check:${locationId}:opts:${qi}`, options.length);
    const shuffled = shuffle.map((i) => options[i]);
    return {
      location: loc,
      kind,
      options: shuffled,
      correctIndex: shuffle.indexOf(0),
    };
  });
}
