// Build-time script: generates the app's self-contained offline basemap.
//
// Bundles Natural Earth public-domain GeoJSON (no tile server):
//   - countries at 1:50m (smoother coasts) via `world-atlas`
//   - rivers, lakes, populated places at 1:50m (downloaded/cached)
//   - a decorative graticule
//
// Run with `npm run gen:basemap`. Output is committed under public/geo/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const cacheDir = path.join(root, 'scripts/data/ne');
const outDir = path.join(root, 'public/geo');

const NE_GEOJSON = {
  rivers:
    'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_rivers_lake_centerlines.geojson',
  lakes:
    'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_lakes.geojson',
  places:
    'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_populated_places.geojson',
} as const;

const CITY_COUNT = 200;

/**
 * Round coordinates to 2 decimal places (~1 km). At the zoom levels this
 * app uses (whole-globe down to city level) that is indistinguishable from
 * full precision, and it roughly halves the file size.
 */
function roundCoords(coords: unknown): unknown {
  if (typeof coords === 'number') return Math.round(coords * 100) / 100;
  if (Array.isArray(coords)) return coords.map(roundCoords);
  return coords;
}

function slimGeometry(g: GeoJSON.Geometry): GeoJSON.Geometry {
  return { ...g, coordinates: roundCoords((g as { coordinates: unknown }).coordinates) } as GeoJSON.Geometry;
}

/** Small deterministic string hash (FNV-1a) — land tint buckets only. */
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const TINT_COUNT = 4;

async function loadNe(name: keyof typeof NE_GEOJSON): Promise<GeoJSON.FeatureCollection> {
  fs.mkdirSync(cacheDir, { recursive: true });
  const cachePath = path.join(cacheDir, `${name}.geojson`);
  if (!fs.existsSync(cachePath)) {
    console.log(`gen-basemap: downloading Natural Earth ${name}…`);
    const res = await fetch(NE_GEOJSON[name]);
    if (!res.ok) throw new Error(`Failed to download ${name}: ${res.status} ${res.statusText}`);
    fs.writeFileSync(cachePath, await res.text(), 'utf8');
  }
  return JSON.parse(fs.readFileSync(cachePath, 'utf8')) as GeoJSON.FeatureCollection;
}

function writeFc(name: string, fc: GeoJSON.FeatureCollection): string {
  const p = path.join(outDir, name);
  fs.writeFileSync(p, JSON.stringify(fc), 'utf8');
  return p;
}

const kb = (p: string) => Math.round(fs.statSync(p).size / 1024);

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  // ── Countries (1:50m) ──────────────────────────────────────────────
  const topo = JSON.parse(
    fs.readFileSync(path.join(root, 'node_modules/world-atlas/countries-50m.json'), 'utf8'),
  ) as unknown as Topology;
  const countries = feature(topo, topo.objects.countries as never) as unknown as GeoJSON.FeatureCollection;

  /** Rough label anchor: average of exterior-ring vertices (good enough at globe zoom). */
  function labelPoint(g: GeoJSON.Geometry): [number, number] | null {
    let ring: number[][] | null = null;
    if (g.type === 'Polygon') ring = g.coordinates[0] as number[][];
    else if (g.type === 'MultiPolygon') {
      // Largest ring by vertex count ≈ main landmass for most countries.
      let best: number[][] = g.coordinates[0][0] as number[][];
      for (const poly of g.coordinates) {
        const r = poly[0] as number[][];
        if (r.length > best.length) best = r;
      }
      ring = best;
    }
    if (!ring || ring.length === 0) return null;
    let sx = 0;
    let sy = 0;
    for (const [x, y] of ring) {
      sx += x;
      sy += y;
    }
    return [sx / ring.length, sy / ring.length];
  }

  const slimCountries: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: countries.features.map((f) => {
      const name = (f.properties as { name?: string } | null)?.name ?? '';
      const lp = labelPoint(f.geometry);
      return {
        type: 'Feature' as const,
        properties: {
          name,
          tint: hashString(name) % TINT_COUNT,
          ...(lp ? { labelLng: roundCoords(lp[0]), labelLat: roundCoords(lp[1]) } : {}),
        },
        geometry: slimGeometry(f.geometry),
      };
    }),
  };

  const countryLabels: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: slimCountries.features
      .filter((f) => f.properties && typeof f.properties.labelLng === 'number')
      .map((f) => ({
        type: 'Feature' as const,
        properties: { name: (f.properties as { name: string }).name },
        geometry: {
          type: 'Point' as const,
          coordinates: [
            (f.properties as { labelLng: number }).labelLng,
            (f.properties as { labelLat: number }).labelLat,
          ],
        },
      })),
  };

  // ── Rivers & lakes (1:110m) ────────────────────────────────────────
  const riversRaw = await loadNe('rivers');
  const lakesRaw = await loadNe('lakes');

  const slimRivers: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: riversRaw.features
      .filter((f) => f.geometry && (f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString'))
      .map((f) => ({
        type: 'Feature' as const,
        properties: {},
        geometry: slimGeometry(f.geometry),
      })),
  };

  const slimLakes: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: lakesRaw.features
      .filter((f) => f.geometry && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'))
      .map((f) => ({
        type: 'Feature' as const,
        properties: {},
        geometry: slimGeometry(f.geometry),
      })),
  };

  // ── Top cities by population ───────────────────────────────────────
  const placesRaw = await loadNe('places');
  const ranked = placesRaw.features
    .map((f) => {
      const props = (f.properties ?? {}) as { NAME?: string; name?: string; POP_MAX?: number; pop_max?: number };
      const name = props.NAME ?? props.name ?? '';
      const pop = props.POP_MAX ?? props.pop_max ?? 0;
      const coords = f.geometry?.type === 'Point' ? (f.geometry.coordinates as [number, number]) : null;
      return { name, pop, coords };
    })
    .filter((c): c is { name: string; pop: number; coords: [number, number] } => Boolean(c.name && c.coords))
    .sort((a, b) => b.pop - a.pop)
    .slice(0, CITY_COUNT);

  const slimCities: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: ranked.map((c) => ({
      type: 'Feature' as const,
      properties: { name: c.name },
      geometry: {
        type: 'Point' as const,
        coordinates: roundCoords(c.coords) as [number, number],
      },
    })),
  };

  // ── Graticule ──────────────────────────────────────────────────────
  const graticuleFeatures: GeoJSON.Feature[] = [];
  for (let lng = -180; lng <= 180; lng += 20) {
    const line: [number, number][] = [];
    for (let lat = -80; lat <= 80; lat += 5) line.push([lng, lat]);
    graticuleFeatures.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: line } });
  }
  for (let lat = -60; lat <= 60; lat += 20) {
    const line: [number, number][] = [];
    for (let lng = -180; lng <= 180; lng += 5) line.push([lng, lat]);
    graticuleFeatures.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: line } });
  }
  const graticule: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: graticuleFeatures };

  const countriesPath = writeFc('countries.json', slimCountries);
  const countryLabelsPath = writeFc('country-labels.json', countryLabels);
  const graticulePath = writeFc('graticule.json', graticule);
  const riversPath = writeFc('rivers.json', slimRivers);
  const lakesPath = writeFc('lakes.json', slimLakes);
  const citiesPath = writeFc('cities.json', slimCities);

  console.log(
    `gen-basemap: ${slimCountries.features.length} countries (${kb(countriesPath)} KB), ` +
      `${countryLabels.features.length} country labels (${kb(countryLabelsPath)} KB), ` +
      `${slimRivers.features.length} rivers (${kb(riversPath)} KB), ` +
      `${slimLakes.features.length} lakes (${kb(lakesPath)} KB), ` +
      `${slimCities.features.length} cities (${kb(citiesPath)} KB), ` +
      `graticule (${kb(graticulePath)} KB)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
