import type { Localized } from '../i18n/types';
import type { VirtueId } from './virtues';

// ── Registries ─────────────────────────────────────────────────────────

export type CategoryId =
  | 'temple'
  | 'church'
  | 'mosque'
  | 'monastery'
  | 'shrine'
  | 'sacred-mountain'
  | 'academy'
  | 'university'
  | 'library'
  | 'pilgrimage-site'
  | 'archaeological-site'
  | 'historic-city';

export type TraditionId =
  | 'confucianism'
  | 'daoism'
  | 'buddhism'
  | 'hinduism'
  | 'christianity'
  | 'islam'
  | 'judaism'
  | 'shinto'
  | 'sikhism'
  | 'zoroastrianism'
  | 'greek-philosophy'
  | 'indigenous'
  | 'scholarship';

export type ContinentId = 'asia' | 'europe' | 'africa' | 'north-america' | 'south-america' | 'oceania';

export interface Category {
  id: CategoryId;
  name: Localized<string>;
  emoji: string;
  /** Marker + chip accent colour (works on the dark basemap). */
  color: string;
}

export interface Tradition {
  id: TraditionId;
  name: Localized<string>;
  emoji: string;
}

// ── Locations ──────────────────────────────────────────────────────────

export interface TimelineEvent {
  /** Negative years are BC. */
  year: number;
  event: Localized<string>;
}

export interface AtlasLocation {
  id: string;
  name: Localized<string>;
  category: CategoryId;
  traditions: TraditionId[];
  country: Localized<string>;
  region: Localized<string>;
  continent: ContinentId;
  /** [longitude, latitude] — MapLibre order. */
  coords: [number, number];
  /** Founding / active period; negative = BC. Enables the future Time Explorer. */
  period: { fromYear: number; toYear?: number };
  unesco?: { year: number };
  status: Localized<string>;
  /** 1–3 short paragraphs, story-like, plain language. */
  whyItMatters: Localized<string[]>;
  timeline: TimelineEvent[];
  connectedPeople: string[];
  /**
   * Human qualities this place's story embodies (1–3). Powers the virtue
   * collections, the post-story reflection, and the Virtue Compass.
   */
  virtues: VirtueId[];
  /**
   * Path under `public/` to an offline parchment-style plate
   * (e.g. `illustrations/lumbini.png`). Emoji hero is used when absent.
   */
  illustration?: string;
  funFact?: Localized<string>;
  /** English Wikipedia article title (URL-ready, underscores ok). */
  wikipedia?: string;
}

// ── People ─────────────────────────────────────────────────────────────

export interface Person {
  id: string;
  name: Localized<string>;
  emoji: string;
  traditions: TraditionId[];
  /** Display string, e.g. "551–479 BC" — kept textual to avoid era math in UI. */
  dates: Localized<string>;
  bio: Localized<string>;
  /** Location ids; cross-checked by scripts/validate-data.ts. */
  locations: string[];
  wikipedia?: string;
}

// ── Collections (predicates over locations) ────────────────────────────

export interface CollectionDef {
  id: string;
  name: Localized<string>;
  emoji: string;
  description: Localized<string>;
  /** Which locations belong to this collection. */
  match: (loc: AtlasLocation) => boolean;
  /** 'places' = category/tradition/heritage groupings; 'virtues' = the nine virtue collections. */
  kind: 'places' | 'virtues';
}

// ── Achievements ───────────────────────────────────────────────────────

export interface ExplorationStats {
  placesExplored: number;
  storiesRead: number;
  collectionsCompleted: number;
  continentsReached: number;
  streak: number;
  discoveriesMade: number;
  quizzesCompleted: number;
  reflectionsWritten: number;
  /** How many distinct virtues the explorer has encountered (via reading). */
  virtuesTouched: number;
  /** How many legendary places have been opened. */
  legendsExplored: number;
}

export interface AchievementDef {
  id: string;
  name: Localized<string>;
  emoji: string;
  description: Localized<string>;
  check: (stats: ExplorationStats) => boolean;
}

// ── Legendary places (stories, not verified geography) ─────────────────

export interface LegendaryPlace {
  id: string;
  name: Localized<string>;
  emoji: string;
  /** One or more disputed candidate coordinates [lng, lat]. */
  claimedLocations: { coords: [number, number]; label: Localized<string> }[];
  firstSource: Localized<string>;
  /** Why humans keep telling this story — story voice, not "what happened". */
  theWhyItPersists: Localized<string[]>;
  leadingTheories: { title: Localized<string>; summary: Localized<string> }[];
  /** Optional real Atlas location id. */
  relatedRealPlace?: string;
  /**
   * Path under `public/` to an offline parchment plate
   * (e.g. `illustrations/atlantis.webp`).
   */
  illustration?: string;
}

/**
 * Format a signed year for display: -551 → "551 BC" / "公元前551年".
 * (公元/公元前 reads correctly in both Simplified and Traditional.)
 */
export function formatYear(year: number, locale: 'en' | 'zh-Hans' | 'zh-Hant' = 'en'): string {
  if (locale === 'en') return year < 0 ? `${-year} BC` : `${year} AD`;
  return year < 0 ? `公元前${-year}年` : `公元${year}年`;
}
