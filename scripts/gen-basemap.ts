// Build-time script: generates the app's self-contained offline basemap.
//
// Bundles Natural Earth public-domain GeoJSON (no tile server):
//   - countries, admin-1, rivers, lakes, populated places, major roads and
//     physical-feature names at 1:10m (finest Natural Earth tier — sharper
//     coastlines, far more rivers/towns than the old 1:50m data)
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
    'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_rivers_lake_centerlines.geojson',
  lakes: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_lakes.geojson',
  places:
    'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_populated_places.geojson',
  // Admin-1 stays at 50m — the 10m version alone was ~6 MB (4589 finely
  // detailed subdivisions) for boundary precision that doesn't read at this
  // app's zoom range. Everything else keeps the 10m detail bump.
  states:
    'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_1_states_provinces.geojson',
  roads: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_roads.geojson',
  physical:
    'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_geography_regions_points.geojson',
} as const;

// The client places labels by real collision-detection (see GlobeMap.tsx
// syncOverlays), not a flat reveal count, so it's fine to ship many more
// candidates than can ever be on screen at once — deep zoom into any region
// still has nearby names to draw from.
const CITY_COUNT = 3000;

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

/**
 * Douglas-Peucker line simplification. 1:10m Natural Earth data carries far
 * more vertices than this app's globe-to-city zoom range can ever resolve;
 * this drops near-collinear points while preserving the shape silhouette
 * (and any point further than `epsilon` from its chord is always kept).
 */
function simplifyLine(points: number[][], epsilon: number): number[][] {
  if (points.length < 3) return points;
  const [x1, y1] = points[0];
  const [x2, y2] = points[points.length - 1];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  let maxDist = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const d = len === 0 ? Math.hypot(x - x1, y - y1) : Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1) / len;
    if (d > maxDist) {
      maxDist = d;
      index = i;
    }
  }
  if (maxDist <= epsilon) return [points[0], points[points.length - 1]];
  const left = simplifyLine(points.slice(0, index + 1), epsilon);
  const right = simplifyLine(points.slice(index), epsilon);
  return left.slice(0, -1).concat(right);
}

/** Degrees — ~1 km at the equator. Rings/lines never need finer detail than
 *  the coordinate rounding below already applies. */
const SIMPLIFY_EPSILON = 0.01;

function simplifyRingsDeep(coords: unknown, depth: number): unknown {
  if (depth === 0) return simplifyLine(coords as number[][], SIMPLIFY_EPSILON);
  return (coords as unknown[]).map((c) => simplifyRingsDeep(c, depth - 1));
}

function slimGeometry(g: GeoJSON.Geometry): GeoJSON.Geometry {
  const raw = (g as { coordinates: unknown }).coordinates;
  // Depth to reach a flat ring/line of [lng,lat] pairs: Polygon rings are
  // nested one level, MultiPolygon/MultiLineString two, LineString zero.
  const depth = g.type === 'MultiPolygon' ? 2 : g.type === 'Polygon' || g.type === 'MultiLineString' ? 1 : 0;
  const simplified = simplifyRingsDeep(raw, depth);
  return { ...g, coordinates: roundCoords(simplified) } as GeoJSON.Geometry;
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

// ── Visual-center label anchor ──────────────────────────────────────────
// The old anchor (plain average of a ring's vertices, ring chosen by vertex
// count) puts labels in the sea for concave/archipelago shapes, and — worse
// — collapses antimeridian-crossing countries (Russia, USA via the
// Aleutians, Fiji) onto the wrong side of the globe, since raw longitudes
// like -179 and 179 average to ~0. Fixed by: (1) picking the ring with the
// largest *area* rather than the most vertices, (2) unwrapping that ring's
// longitudes before any arithmetic, (3) using a coarse-to-fine grid search
// for a point deep inside the ring (a "pole of inaccessibility") instead of
// a vertex average, which can land outside the polygon entirely.

type Ring = [number, number][];

function unwrapRing(ring: number[][]): Ring {
  const out: Ring = [[ring[0][0], ring[0][1]]];
  for (let i = 1; i < ring.length; i++) {
    let lng = ring[i][0];
    const prevLng = out[i - 1][0];
    while (lng - prevLng > 180) lng -= 360;
    while (lng - prevLng < -180) lng += 360;
    out.push([lng, ring[i][1]]);
  }
  return out;
}

function ringArea(ring: Ring): number {
  let sum = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

function pointInRing(x: number, y: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  let t = len2 === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function distToRingBoundary(x: number, y: number, ring: Ring): number {
  let best = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    best = Math.min(best, distToSegment(x, y, x1, y1, x2, y2));
  }
  return best;
}

/** Coarse-to-fine grid search for a point deep inside `ring`, unwrapped-lng coords. */
function visualCenter(ring: Ring): [number, number] | null {
  const lons = ring.map((p) => p[0]);
  const lats = ring.map((p) => p[1]);
  let cx = (Math.min(...lons) + Math.max(...lons)) / 2;
  let cy = (Math.min(...lats) + Math.max(...lats)) / 2;
  let spanX = Math.max(...lons) - Math.min(...lons) || 0.001;
  let spanY = Math.max(...lats) - Math.min(...lats) || 0.001;
  const GRID = 16;
  let best: [number, number] | null = null;
  for (let iter = 0; iter < 6; iter++) {
    let bestDist = -Infinity;
    let found: [number, number] | null = null;
    for (let i = 0; i <= GRID; i++) {
      for (let j = 0; j <= GRID; j++) {
        const x = cx - spanX / 2 + (i / GRID) * spanX;
        const y = cy - spanY / 2 + (j / GRID) * spanY;
        if (!pointInRing(x, y, ring)) continue;
        const d = distToRingBoundary(x, y, ring);
        if (d > bestDist) {
          bestDist = d;
          found = [x, y];
        }
      }
    }
    if (!found) break;
    best = found;
    cx = found[0];
    cy = found[1];
    spanX /= 4;
    spanY /= 4;
  }
  return best;
}

function wrapLng(lng: number): number {
  let l = lng;
  while (l > 180) l -= 360;
  while (l < -180) l += 360;
  return l;
}

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

  // ── Countries (1:10m) ──────────────────────────────────────────────
  const topo = JSON.parse(
    fs.readFileSync(path.join(root, 'node_modules/world-atlas/countries-10m.json'), 'utf8'),
  ) as unknown as Topology;
  const countries = feature(topo, topo.objects.countries as never) as unknown as GeoJSON.FeatureCollection;

  /** Label anchor: visual center of the largest-by-area exterior ring. */
  function labelPoint(g: GeoJSON.Geometry): [number, number] | null {
    const outerRings: number[][][] =
      g.type === 'Polygon'
        ? [g.coordinates[0] as number[][]]
        : g.type === 'MultiPolygon'
          ? (g.coordinates as number[][][][]).map((poly) => poly[0] as number[][])
          : [];
    let bestRing: Ring | null = null;
    let bestArea = -1;
    for (const r of outerRings) {
      if (r.length < 3) continue;
      const unwrapped = unwrapRing(r);
      const area = ringArea(unwrapped);
      if (area > bestArea) {
        bestArea = area;
        bestRing = unwrapped;
      }
    }
    if (!bestRing) return null;
    const vc = visualCenter(bestRing) ?? bestRing[0];
    return [wrapLng(vc[0]), vc[1]];
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

  // ── Rivers & lakes (1:10m) ─────────────────────────────────────────
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

  /** Label anchor for a line: the midpoint of its longest constituent part. */
  function lineLabelPoint(g: GeoJSON.Geometry): [number, number] | null {
    const lines: number[][][] =
      g.type === 'LineString'
        ? [g.coordinates as number[][]]
        : g.type === 'MultiLineString'
          ? (g.coordinates as number[][][])
          : [];
    let best: number[][] | null = null;
    let bestLen = -1;
    for (const line of lines) {
      if (line.length < 2) continue;
      let len = 0;
      for (let i = 1; i < line.length; i++) {
        len += Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]);
      }
      if (len > bestLen) {
        bestLen = len;
        best = line;
      }
    }
    return best ? (best[Math.floor(best.length / 2)] as [number, number]) : null;
  }

  // River names carry Natural Earth's own `scalerank` (1 = major river like
  // the Amazon/Nile, higher = minor) — reused client-side to prioritize
  // which names win when candidates compete for the same screen space.
  const riverLabels: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: riversRaw.features
      .filter((f) => f.geometry && (f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString'))
      .map((f) => {
        const props = (f.properties ?? {}) as { name?: string; name_en?: string; scalerank?: number };
        const name = props.name_en || props.name || '';
        const lp = name ? lineLabelPoint(f.geometry) : null;
        return { name, scalerank: props.scalerank ?? 10, lp };
      })
      .filter((r): r is { name: string; scalerank: number; lp: [number, number] } => Boolean(r.name && r.lp))
      .map((r) => ({
        type: 'Feature' as const,
        properties: { name: r.name, scalerank: r.scalerank },
        geometry: { type: 'Point' as const, coordinates: roundCoords(r.lp) as [number, number] },
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
      properties: { name: c.name, pop: c.pop },
      geometry: {
        type: 'Point' as const,
        coordinates: roundCoords(c.coords) as [number, number],
      },
    })),
  };

  // ── States / provinces (admin-1, 1:10m) ─────────────────────────────
  // Fills the zoom tier between "country" and "city" — a close-up view of
  // a single country previously had nothing but flat land tint at this level.
  const statesRaw = await loadNe('states');
  const slimStates: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: statesRaw.features
      .filter((f) => f.geometry && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'))
      .map((f) => {
        const props = (f.properties ?? {}) as { name?: string; name_en?: string; woe_name?: string };
        const name = props.name_en || props.name || props.woe_name || '';
        const lp = labelPoint(f.geometry);
        return {
          type: 'Feature' as const,
          properties: {
            name,
            ...(lp ? { labelLng: roundCoords(lp[0]), labelLat: roundCoords(lp[1]) } : {}),
          },
          geometry: slimGeometry(f.geometry),
        };
      })
      .filter((f) => f.properties.name),
  };

  const stateLabels: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: slimStates.features
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

  // ── Major roads ──────────────────────────────────────────────────────
  // Filtered to the top highway tier only — the full ne_10m_roads dataset
  // is tens of MB; this gives zoomed-in views some texture without an
  // unbounded offline bundle.
  const roadsRaw = await loadNe('roads');
  const slimRoads: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: roadsRaw.features
      .filter((f) => {
        const props = (f.properties ?? {}) as { type?: string };
        return props.type === 'Major Highway';
      })
      .filter((f) => f.geometry && (f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString'))
      .map((f) => ({
        type: 'Feature' as const,
        properties: {},
        geometry: slimGeometry(f.geometry),
      })),
  };

  // ── Physical-feature names (mountain ranges, deserts, plains…) ───────
  const physicalRaw = await loadNe('physical');
  const slimPhysical: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: physicalRaw.features
      .filter((f): f is GeoJSON.Feature<GeoJSON.Point> => f.geometry?.type === 'Point')
      .map((f) => {
        const props = (f.properties ?? {}) as { name?: string };
        return {
          type: 'Feature' as const,
          properties: { name: props.name ?? '' },
          geometry: { type: 'Point' as const, coordinates: roundCoords(f.geometry.coordinates) as [number, number] },
        };
      })
      .filter((f) => f.properties.name),
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
  const statesPath = writeFc('admin1.json', slimStates);
  const stateLabelsPath = writeFc('admin1-labels.json', stateLabels);
  const roadsPath = writeFc('roads.json', slimRoads);
  const physicalPath = writeFc('physical-labels.json', slimPhysical);
  const riverLabelsPath = writeFc('river-labels.json', riverLabels);

  console.log(
    `gen-basemap: ${slimCountries.features.length} countries (${kb(countriesPath)} KB), ` +
      `${countryLabels.features.length} country labels (${kb(countryLabelsPath)} KB), ` +
      `${slimRivers.features.length} rivers (${kb(riversPath)} KB), ` +
      `${riverLabels.features.length} river labels (${kb(riverLabelsPath)} KB), ` +
      `${slimLakes.features.length} lakes (${kb(lakesPath)} KB), ` +
      `${slimCities.features.length} cities (${kb(citiesPath)} KB), ` +
      `${slimStates.features.length} states/provinces (${kb(statesPath)} KB), ` +
      `${stateLabels.features.length} state labels (${kb(stateLabelsPath)} KB), ` +
      `${slimRoads.features.length} major roads (${kb(roadsPath)} KB), ` +
      `${slimPhysical.features.length} physical labels (${kb(physicalPath)} KB), ` +
      `graticule (${kb(graticulePath)} KB)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
