import { localized } from '../i18n/types';
import type { Localized } from '../i18n/types';
import { LEGENDS } from './legends';

/**
 * Legend Seeker — progress metadata for legendary places, separate from
 * COLLECTIONS (which are predicates over AtlasLocation). Completion is
 * checked against `exploredLegends` in progress, not location matchers.
 */
export interface LegendCollectionMeta {
  id: 'legend-seeker';
  name: Localized<string>;
  emoji: string;
  description: Localized<string>;
  /** Total legends to explore; mirrors LEGENDS.length. */
  totalCount: number;
}

export const LEGEND_COLLECTION: LegendCollectionMeta = {
  id: 'legend-seeker',
  name: localized('Legend Seeker', '传说寻访者'),
  emoji: '📜',
  description: localized(
    'Explore every legendary place in the atlas — stories that endure without needing to be proven on a map.',
    '探索地图集中每一处传说之地 — 不必在地图上被证实、却仍流传不息的故事。',
  ),
  totalCount: LEGENDS.length,
};

/** True when every legend id appears in the explorer's exploredLegends set. */
export function isLegendCollectionComplete(exploredLegends: Iterable<string>): boolean {
  const seen = exploredLegends instanceof Set ? exploredLegends : new Set(exploredLegends);
  return LEGENDS.every((l) => seen.has(l.id));
}
