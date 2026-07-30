// Data validation, run before every build (`npm run validate-data`).
// Checks structural invariants the type system can't: id uniqueness,
// coordinate ranges, cross-references, non-empty localized fields, and
// that the offline basemap style + its GeoJSON are valid.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateStyleMin } from '@maplibre/maplibre-gl-style-spec';
import { LOCATIONS } from '../src/data/locations';
import { PEOPLE, PERSON_BY_ID } from '../src/data/people';
import { COLLECTIONS } from '../src/data/collections';
import { VIRTUES } from '../src/data/virtues';
import { LOCATION_TEACHINGS, PERSON_TEACHINGS } from '../src/data/teachings';
import { LEGENDS } from '../src/data/legends';
import { OFFLINE_STYLE } from '../src/components/map/offlineStyle';

const errors: string[] = [];

// ── Locations ──────────────────────────────────────────────────────────
const locIds = new Set<string>();
for (const l of LOCATIONS) {
  const where = `location "${l.id}"`;
  if (locIds.has(l.id)) errors.push(`duplicate location id: ${l.id}`);
  locIds.add(l.id);

  const [lng, lat] = l.coords;
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
    errors.push(`${where}: coords out of range [${lng}, ${lat}]`);
  }
  if (!l.name.en.trim() || !l.name.zh.trim()) errors.push(`${where}: empty name`);
  if (l.whyItMatters.en.length === 0 || l.whyItMatters.zh.length === 0) {
    errors.push(`${where}: whyItMatters must have at least one paragraph`);
  }
  if (l.whyItMatters.en.length !== l.whyItMatters.zh.length) {
    errors.push(`${where}: whyItMatters en/zh paragraph counts differ`);
  }
  if (l.timeline.length < 2) errors.push(`${where}: timeline needs at least 2 events`);
  const years = l.timeline.map((e) => e.year);
  const sorted = [...years].sort((a, b) => a - b);
  if (JSON.stringify(years) !== JSON.stringify(sorted)) {
    errors.push(`${where}: timeline events not in chronological order`);
  }
  if (l.traditions.length === 0) errors.push(`${where}: needs at least one tradition`);
  if (l.virtues.length === 0 || l.virtues.length > 3) {
    errors.push(`${where}: needs 1–3 virtues (has ${l.virtues.length})`);
  }
  if (new Set(l.virtues).size !== l.virtues.length) {
    errors.push(`${where}: duplicate virtue`);
  }
  for (const pid of l.connectedPeople) {
    if (!PERSON_BY_ID[pid]) errors.push(`${where}: unknown person "${pid}"`);
  }
}

// ── People ─────────────────────────────────────────────────────────────
const personIds = new Set<string>();
for (const p of PEOPLE) {
  if (personIds.has(p.id)) errors.push(`duplicate person id: ${p.id}`);
  personIds.add(p.id);
  for (const lid of p.locations) {
    if (!locIds.has(lid)) errors.push(`person "${p.id}": unknown location "${lid}"`);
  }
}

// ── Collections ────────────────────────────────────────────────────────
for (const c of COLLECTIONS) {
  const members = LOCATIONS.filter(c.match);
  if (members.length === 0) {
    errors.push(`collection "${c.id}" matches no locations`);
  }
}

// ── Virtues ────────────────────────────────────────────────────────────
// Every virtue must appear on at least 3 places, else its collection and
// its slice of the Virtue Compass would be trivially completable or empty.
for (const v of VIRTUES) {
  const count = LOCATIONS.filter((l) => l.virtues.includes(v.id)).length;
  if (count < 3) errors.push(`virtue "${v.id}": only ${count} location(s) tagged — needs at least 3`);
}

// ── Teachings ──────────────────────────────────────────────────────────
for (const l of LOCATIONS) {
  if (!LOCATION_TEACHINGS[l.id]) errors.push(`location "${l.id}": missing teaching`);
}
for (const p of PEOPLE) {
  if (!PERSON_TEACHINGS[p.id]) errors.push(`person "${p.id}": missing signature teaching`);
}

// ── Legends ────────────────────────────────────────────────────────────
const legendIds = new Set<string>();
for (const leg of LEGENDS) {
  if (legendIds.has(leg.id)) errors.push(`duplicate legend id: ${leg.id}`);
  legendIds.add(leg.id);
  if (leg.claimedLocations.length === 0) errors.push(`legend "${leg.id}": needs claimedLocations`);
  if (leg.theWhyItPersists.en.length !== leg.theWhyItPersists.zh.length) {
    errors.push(`legend "${leg.id}": theWhyItPersists en/zh paragraph counts differ`);
  }
  if (leg.relatedRealPlace && !locIds.has(leg.relatedRealPlace)) {
    errors.push(`legend "${leg.id}": unknown relatedRealPlace "${leg.relatedRealPlace}"`);
  }
}

// ── Offline basemap ────────────────────────────────────────────────────
// The globe has no tile server to fall back on, so a broken style or a
// missing GeoJSON file means a blank map for every user. Check both here
// rather than discovering it in the browser.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

for (const issue of validateStyleMin(OFFLINE_STYLE)) {
  errors.push(`basemap style: ${issue.message}`);
}

for (const [name, source] of Object.entries(OFFLINE_STYLE.sources)) {
  if (source.type !== 'geojson' || typeof source.data !== 'string') continue;
  // Style URLs are BASE_URL-prefixed ("/geo/x.json"); map back to public/.
  const rel = source.data.replace(/^\/+/, '');
  const file = path.join(publicDir, rel);
  if (!fs.existsSync(file)) {
    errors.push(`basemap source "${name}": missing ${rel} — run \`npm run gen:basemap\``);
    continue;
  }
  try {
    const fc = JSON.parse(fs.readFileSync(file, 'utf8')) as GeoJSON.FeatureCollection;
    if (fc.type !== 'FeatureCollection' || !Array.isArray(fc.features) || fc.features.length === 0) {
      errors.push(`basemap source "${name}": ${rel} is not a non-empty FeatureCollection`);
    }
  } catch (e) {
    errors.push(`basemap source "${name}": ${rel} is not valid JSON (${(e as Error).message})`);
  }
}

if (errors.length > 0) {
  console.error(`validate-data: ${errors.length} error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(
  `validate-data: OK — ${LOCATIONS.length} locations, ${PEOPLE.length} people, ${COLLECTIONS.length} collections, ${LEGENDS.length} legends, offline basemap valid`,
);
