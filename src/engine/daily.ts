// Deterministic date-seeded picks — the whole "daily" system works with no
// backend: every user (per locale-independent local date) sees the same
// Discovery of the Day and quiz, same pattern as Journey's dailyChallenge.

/** Local date key, e.g. "2026-07-30". */
export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Small deterministic string hash (FNV-1a). */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic index pick for a given seed string. */
export function pickIndex(seed: string, length: number): number {
  if (length <= 0) return 0;
  return hashString(seed) % length;
}

/**
 * Deterministic pseudo-shuffle: returns indices 0..n-1 ordered by seeded
 * hash. Used for quiz option order so it is stable within a day but varies
 * day to day.
 */
export function seededOrder(seed: string, n: number): number[] {
  return Array.from({ length: n }, (_, i) => i).sort(
    (a, b) => hashString(`${seed}:${a}`) - hashString(`${seed}:${b}`),
  );
}

/** Yesterday's key, for streak continuity checks. */
export function yesterdayKey(d = new Date()): string {
  const y = new Date(d);
  y.setDate(y.getDate() - 1);
  return todayKey(y);
}
