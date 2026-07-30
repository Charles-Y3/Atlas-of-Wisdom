import type { AtlasLocation } from './types';
import { EAST_ASIA } from './locations/eastAsia';
import { SOUTH_SOUTHEAST_ASIA } from './locations/southSoutheastAsia';
import { MIDDLE_EAST_CENTRAL_ASIA } from './locations/middleEastCentralAsia';
import { EUROPE } from './locations/europe';
import { AFRICA_AMERICAS_OCEANIA } from './locations/africaAmericasOceania';

export const LOCATIONS: AtlasLocation[] = [
  ...EAST_ASIA,
  ...SOUTH_SOUTHEAST_ASIA,
  ...MIDDLE_EAST_CENTRAL_ASIA,
  ...EUROPE,
  ...AFRICA_AMERICAS_OCEANIA,
];

export const LOCATION_BY_ID: Record<string, AtlasLocation> = Object.fromEntries(
  LOCATIONS.map((l) => [l.id, l]),
);
