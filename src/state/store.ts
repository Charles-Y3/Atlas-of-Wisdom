import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { XP_FOR, rankIndexForXp, RANKS, STREAK_XP_MILESTONES } from '../engine/progression';
import { todayKey, yesterdayKey } from '../engine/daily';
import { LOCATIONS, LOCATION_BY_ID } from '../data/locations';
import { COLLECTIONS } from '../data/collections';
import { ACHIEVEMENTS } from '../data/achievements';
import { QUESTS } from '../data/quests';
import type { ExplorationStats } from '../data/types';
import type { VirtueId } from '../data/virtues';
import { useToasts } from './toastStore';

/** Minimum length of a saved reflection — see submitReflection. */
export const MIN_REFLECTION_CHARS = 25;

/** A user's written response to a place's virtue question. */
export interface Reflection {
  virtue: VirtueId;
  text: string;
  day: string;
}

interface AtlasProgress {
  xp: number;
  /** locationId → ISO date of first visit. */
  visited: Record<string, string>;
  /** locationId → true once the full story was read. */
  read: Record<string, true>;
  /** locationId → the reflection written after reading it. */
  reflections: Record<string, Reflection>;
  achievements: string[];
  completedCollections: string[];
  discoveriesMade: number;
  quizzesCompleted: number;
  /** Daily quiz state for todayKey(). */
  quiz: { day: string; answered: number; correct: number } | null;
  dailyDiscoveryDay: string | null;
  dailyTeachingDay: string | null;
  /** legendId → ISO date of first exploration. */
  exploredLegends: Record<string, string>;
  /** questId → steps already awarded XP for. */
  questProgress: Record<string, { completedSteps: string[] }>;
  /** questIds finished (all steps awarded once). */
  completedQuests: string[];
  streak: { count: number; lastDay: string | null };
  lastLocationId: string | null;

  visitLocation: (id: string) => void;
  markRead: (id: string) => void;
  submitReflection: (id: string, virtue: VirtueId, text: string) => void;
  recordDiscovery: (id: string) => void;
  openDailyDiscovery: (id: string) => void;
  openDailyTeaching: () => void;
  exploreLegend: (id: string) => void;
  answerQuiz: (correct: boolean) => void;
  /** Award quest-step XP when the explorer confirms the place by name. */
  completeQuestStep: (questId: string, locationId: string) => void;
  /** Legacy no-op — quests are confirmed by guess, not by visit. */
  syncQuestProgress: () => void;
  reset: () => void;
}

function emptyState() {
  return {
    xp: 0,
    visited: {},
    read: {},
    reflections: {},
    achievements: [],
    completedCollections: [],
    discoveriesMade: 0,
    quizzesCompleted: 0,
    quiz: null,
    dailyDiscoveryDay: null,
    dailyTeachingDay: null,
    exploredLegends: {},
    questProgress: {},
    completedQuests: [],
    streak: { count: 0, lastDay: null },
    lastLocationId: null,
  };
}

export function statsOf(
  s: Pick<
    AtlasProgress,
    | 'visited'
    | 'read'
    | 'reflections'
    | 'completedCollections'
    | 'streak'
    | 'discoveriesMade'
    | 'quizzesCompleted'
    | 'exploredLegends'
  >,
): ExplorationStats {
  const visitedIds = Object.keys(s.visited);
  const readIds = Object.keys(s.read);
  const continents = new Set(visitedIds.map((id) => LOCATION_BY_ID[id]?.continent).filter(Boolean));
  // Virtues are earned by reading stories, not by pin-collecting.
  const virtues = new Set(readIds.flatMap((id) => LOCATION_BY_ID[id]?.virtues ?? []));
  return {
    placesExplored: visitedIds.length,
    storiesRead: readIds.length,
    collectionsCompleted: s.completedCollections.length,
    continentsReached: continents.size,
    streak: s.streak.count,
    discoveriesMade: s.discoveriesMade,
    quizzesCompleted: s.quizzesCompleted,
    reflectionsWritten: Object.keys(s.reflections ?? {}).length,
    virtuesTouched: virtues.size,
    legendsExplored: Object.keys(s.exploredLegends ?? {}).length,
  };
}

/**
 * How many places whose stories the explorer has read carry each virtue —
 * the data behind the Virtue Compass.
 */
export function virtueCounts(read: Record<string, true>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const id of Object.keys(read)) {
    for (const v of LOCATION_BY_ID[id]?.virtues ?? []) counts[v] = (counts[v] ?? 0) + 1;
  }
  return counts;
}

export const useProgress = create<AtlasProgress>()(
  persist(
    (set, get) => {
      const toast = (t: Parameters<ReturnType<typeof useToasts.getState>['push']>[0]) =>
        useToasts.getState().push(t);

      /** Apply an XP delta, announcing any rank-up. */
      function gainXp(delta: number, s: { xp: number }): number {
        const before = rankIndexForXp(s.xp);
        const xp = s.xp + delta;
        const after = rankIndexForXp(xp);
        if (after > before) {
          const r = RANKS[after];
          toast({ titleKey: 'rankUp', body: r.name, emoji: r.emoji });
        }
        return xp;
      }

      /** Keep the daily streak alive; call on any meaningful exploration. */
      function touchedStreak(streak: AtlasProgress['streak']): AtlasProgress['streak'] {
        const today = todayKey();
        if (streak.lastDay === today) return streak;
        if (streak.lastDay === yesterdayKey()) return { count: streak.count + 1, lastDay: today };
        return { count: 1, lastDay: today };
      }

      /**
       * Mutable snapshot of everything the unlock engine reads, with the
       * streak already touched. Every action builds one of these, mutates
       * what it changed, then runs it through collectUnlocks and set().
       */
      type Snapshot = Pick<
        AtlasProgress,
        | 'xp'
        | 'visited'
        | 'read'
        | 'reflections'
        | 'completedCollections'
        | 'achievements'
        | 'streak'
        | 'discoveriesMade'
        | 'quizzesCompleted'
        | 'exploredLegends'
        | 'questProgress'
        | 'completedQuests'
      >;

      function snapshot(s: AtlasProgress): Snapshot {
        const prevStreak = s.streak.count;
        const streak = touchedStreak(s.streak);
        const next: Snapshot = {
          xp: s.xp,
          visited: s.visited,
          read: s.read,
          reflections: s.reflections ?? {},
          completedCollections: s.completedCollections,
          achievements: s.achievements,
          streak,
          discoveriesMade: s.discoveriesMade,
          quizzesCompleted: s.quizzesCompleted,
          exploredLegends: s.exploredLegends ?? {},
          questProgress: s.questProgress ?? {},
          completedQuests: s.completedQuests ?? [],
        };
        // Returning on a new day that hits 3 / 7 / 30 earns a streak gift.
        if (streak.count > prevStreak) {
          const bonus = STREAK_XP_MILESTONES[streak.count];
          if (bonus) {
            next.xp = gainXp(bonus, next);
            toast({ titleKey: 'streakBonus', emoji: '🔥', xp: bonus });
          }
        }
        return next;
      }

      /**
       * After any progress change: grant newly-completed collections and
       * achievements (each once, with XP + toast).
       */
      function collectUnlocks(next: Snapshot): void {
        const visitedIds = new Set(Object.keys(next.visited));
        const readIds = new Set(Object.keys(next.read));
        for (const c of COLLECTIONS) {
          if (next.completedCollections.includes(c.id)) continue;
          const members = LOCATIONS.filter(c.match);
          // Place collections: visit. Virtue collections: mark story as read.
          const earned = c.kind === 'virtues' ? readIds : visitedIds;
          if (members.length > 0 && members.every((m) => earned.has(m.id))) {
            next.completedCollections = [...next.completedCollections, c.id];
            next.xp = gainXp(XP_FOR.collection, next);
            toast({ titleKey: 'collectionCompleted', body: c.name, emoji: c.emoji, xp: XP_FOR.collection });
          }
        }
        const stats = statsOf(next);
        for (const a of ACHIEVEMENTS) {
          if (next.achievements.includes(a.id)) continue;
          if (a.check(stats)) {
            next.achievements = [...next.achievements, a.id];
            next.xp = gainXp(XP_FOR.achievement, next);
            toast({ titleKey: 'achievementUnlocked', body: a.name, emoji: a.emoji, xp: XP_FOR.achievement });
          }
        }
      }

      /**
       * Award a quest step only when the explorer explicitly confirms the
       * place (guess form on Quests) — visiting a pin alone never ticks it.
       */
      function awardQuestStep(
        next: Snapshot,
        questId: string,
        locationId: string,
        opts?: { silent?: boolean },
      ): boolean {
        const quest = QUESTS.find((q) => q.id === questId);
        if (!quest || !quest.steps.some((s) => s.id === locationId)) return false;
        const prog = next.questProgress[questId] ?? { completedSteps: [] };
        if (prog.completedSteps.includes(locationId)) return false;

        const completedSteps = [...prog.completedSteps, locationId];
        next.questProgress = { ...next.questProgress, [questId]: { completedSteps } };
        next.xp = gainXp(XP_FOR.questStep, next);
        if (!opts?.silent) {
          toast({ titleKey: 'questStepDone', body: quest.name, emoji: quest.emoji, xp: XP_FOR.questStep });
        }

        if (
          quest.steps.every((s) => completedSteps.includes(s.id)) &&
          !next.completedQuests.includes(questId)
        ) {
          next.completedQuests = [...next.completedQuests, questId];
          next.xp = gainXp(XP_FOR.questComplete, next);
          if (!opts?.silent) {
            toast({
              titleKey: 'questComplete',
              body: quest.name,
              emoji: quest.emoji,
              xp: XP_FOR.questComplete,
            });
          }
        }
        return true;
      }

      return {
        ...emptyState(),

        visitLocation: (id) => {
          const s = get();
          if (!LOCATION_BY_ID[id]) return;
          const next = snapshot(s);
          if (!s.visited[id]) {
            next.visited = { ...s.visited, [id]: new Date().toISOString() };
            next.xp = gainXp(XP_FOR.firstVisit, next);
            toast({ titleKey: 'locFirstVisitXp', emoji: '📍', xp: XP_FOR.firstVisit });
          }
          collectUnlocks(next);
          set({ ...next, lastLocationId: id });
        },

        markRead: (id) => {
          const s = get();
          if (s.read[id] || !LOCATION_BY_ID[id]) return;
          const next = snapshot(s);
          next.read = { ...s.read, [id]: true as const };
          next.xp = gainXp(XP_FOR.readStory, next);
          toast({ titleKey: 'locReadBonus', emoji: '📖', xp: XP_FOR.readStory });
          collectUnlocks(next);
          set(next);
        },

        submitReflection: (id, virtue, text) => {
          const s = get();
          const trimmed = text.trim();
          // Mirrors Journey's minimum-effort thresholds: a reflection has
          // to be an actual thought, not a keystroke.
          if (trimmed.length < MIN_REFLECTION_CHARS || !LOCATION_BY_ID[id]) return;
          const next = snapshot(s);
          next.reflections = { ...next.reflections, [id]: { virtue, text: trimmed, day: todayKey() } };
          next.xp = gainXp(XP_FOR.reflection, next);
          toast({ titleKey: 'reflectionSaved', emoji: '🪞', xp: XP_FOR.reflection });
          collectUnlocks(next);
          set(next);
        },

        recordDiscovery: (id) => {
          const s = get();
          const isNew = !s.visited[id];
          const next = snapshot(s);
          next.discoveriesMade = s.discoveriesMade + 1;
          if (isNew) next.xp = gainXp(XP_FOR.discovery, next);
          collectUnlocks(next);
          set(next);
        },

        openDailyDiscovery: (id) => {
          const s = get();
          const today = todayKey();
          if (s.dailyDiscoveryDay === today) return;
          const next = snapshot(s);
          next.xp = gainXp(XP_FOR.dailyDiscovery, next);
          toast({ titleKey: 'homeDiscoveryOfDay', emoji: '🌅', xp: XP_FOR.dailyDiscovery });
          collectUnlocks(next);
          set({ ...next, dailyDiscoveryDay: today, lastLocationId: id });
        },

        openDailyTeaching: () => {
          const s = get();
          const today = todayKey();
          if (s.dailyTeachingDay === today) return;
          const next = snapshot(s);
          next.xp = gainXp(XP_FOR.teachingOfDay, next);
          toast({ titleKey: 'homeTeachingOfDay', emoji: '📜', xp: XP_FOR.teachingOfDay });
          collectUnlocks(next);
          set({ ...next, dailyTeachingDay: today });
        },

        exploreLegend: (id) => {
          const s = get();
          const next = snapshot(s);
          if (!s.exploredLegends?.[id]) {
            next.exploredLegends = { ...(s.exploredLegends ?? {}), [id]: new Date().toISOString() };
            next.xp = gainXp(XP_FOR.exploreLegend, next);
            toast({ titleKey: 'legendExplore', emoji: '📜', xp: XP_FOR.exploreLegend });
          }
          collectUnlocks(next);
          set(next);
        },

        answerQuiz: (correct) => {
          const s = get();
          const today = todayKey();
          const quiz = s.quiz?.day === today ? s.quiz : { day: today, answered: 0, correct: 0 };
          if (quiz.answered >= 3) return;
          if (!correct) return; // mastery-gated: wrong answers don't advance
          const updated = { day: today, answered: quiz.answered + 1, correct: quiz.correct + 1 };
          const finished = updated.answered === 3;
          const next = snapshot(s);
          next.quizzesCompleted = s.quizzesCompleted + (finished ? 1 : 0);
          next.xp = gainXp(XP_FOR.quizQuestion, next);
          collectUnlocks(next);
          set({ ...next, quiz: updated });
        },

        completeQuestStep: (questId, locationId) => {
          const s = get();
          const next = snapshot(s);
          if (!awardQuestStep(next, questId, locationId)) return;
          // Naming a place also counts as arriving there.
          if (!next.visited[locationId] && LOCATION_BY_ID[locationId]) {
            next.visited = { ...next.visited, [locationId]: new Date().toISOString() };
          }
          collectUnlocks(next);
          set({ ...next, lastLocationId: locationId });
        },

        /** No-op kept for older callers — quests no longer auto-fill from visits. */
        syncQuestProgress: () => {},

        reset: () => set({ ...emptyState() }),
      };
    },
    { name: 'atlas-progress', version: 2 },
  ),
);

/** Legends layer unlock: twelve stories read, or Master Explorer XP. */
export function legendsUnlocked(s: Pick<AtlasProgress, 'read' | 'xp' | 'achievements'>): boolean {
  return Object.keys(s.read).length >= 12 || s.xp >= 3200 || s.achievements.includes('beyond-the-map');
}
