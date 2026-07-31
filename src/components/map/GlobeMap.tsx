import { useCallback, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LOCATIONS } from '../../data/locations';
import { LEGENDS } from '../../data/legends';
import { CATEGORIES } from '../../data/categories';
import type { CategoryId } from '../../data/types';
import type { Locale } from '../../i18n/types';
import { L } from '../../i18n/L';
import { useSettings } from '../../state/settingsStore';
import { useToasts } from '../../state/toastStore';
import { OFFLINE_STYLE } from './offlineStyle';
import { ONLINE_PROBE_MS, ONLINE_STYLE_URL } from './onlineStyle';

/** Beyond this zoom every point is unclustered and gets a name label. */
const CLUSTER_MAX_ZOOM = 4;
const LABEL_MIN_ZOOM = CLUSTER_MAX_ZOOM;
const COUNTRY_LABEL_MIN_ZOOM = 1.2;
const COUNTRY_LABEL_MAX_ZOOM = 3.4;
const CITY_LABEL_MIN_ZOOM = 3.0;
const CITY_LABEL_MAX_ZOOM = LABEL_MIN_ZOOM;
/** Max country names on screen at once — avoids Pacific clutter. */
const MAX_COUNTRY_LABELS = 36;

/** True when lng/lat faces the camera on a globe (hides far-side project() ghosts). */
function isFrontHemisphere(map: maplibregl.Map, lng: number, lat: number): boolean {
  const c = map.getCenter();
  const toRad = Math.PI / 180;
  const φ1 = c.lat * toRad;
  const λ1 = c.lng * toRad;
  const φ2 = lat * toRad;
  const λ2 = lng * toRad;
  const x1 = Math.cos(φ1) * Math.cos(λ1);
  const y1 = Math.cos(φ1) * Math.sin(λ1);
  const z1 = Math.sin(φ1);
  const x2 = Math.cos(φ2) * Math.cos(λ2);
  const y2 = Math.cos(φ2) * Math.sin(λ2);
  const z2 = Math.sin(φ2);
  // Cosine of angular separation; > ~0.2 keeps labels off the limb/horizon.
  return x1 * x2 + y1 * y2 + z1 * z2 > 0.22;
}

function colorExpression(): maplibregl.ExpressionSpecification {
  const branches: string[] = [];
  for (const c of CATEGORIES) branches.push(c.id, c.color);
  return ['match', ['get', 'category'], ...branches, 'legend', '#6b4f2a', '#b0b8c9'] as unknown as maplibregl.ExpressionSpecification;
}

export interface QuestTrailStop {
  id: string;
  coords: [number, number];
  found: boolean;
  index: number;
}

export interface GlobeMapProps {
  /** null = show all categories. */
  filterCategory?: CategoryId | null;
  visitedIds?: Set<string>;
  onSelect?: (id: string) => void;
  /** Fly to this point when it changes. */
  focus?: { center: [number, number]; zoom?: number } | null;
  /** Slow idle spin (home hero). Stops on first user interaction. */
  autoRotate?: boolean;
  interactive?: boolean;
  locale: Locale;
  /** Report whether the live style is online tiles (for attribution). */
  onStyleModeChange?: (mode: 'offline' | 'online') => void;
  /** Show disputed/legendary claim points instead of atlas locations. */
  legendsMode?: boolean;
  /** Optional quest path drawn on the globe. */
  questTrail?: QuestTrailStop[] | null;
}

function buildQuestTrailGeoJson(stops: QuestTrailStop[] | null | undefined) {
  if (!stops || stops.length === 0) {
    return {
      line: { type: 'FeatureCollection' as const, features: [] as GeoJSON.Feature[] },
      stops: { type: 'FeatureCollection' as const, features: [] as GeoJSON.Feature[] },
    };
  }
  const coords = stops.map((s) => s.coords);
  return {
    line: {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: { type: 'LineString' as const, coordinates: coords },
          properties: {},
        },
      ],
    },
    stops: {
      type: 'FeatureCollection' as const,
      features: stops.map((s) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: s.coords },
        properties: { id: s.id, found: s.found ? 1 : 0, index: s.index },
      })),
    },
  };
}

type OverlayKind = 'cluster' | 'place' | 'country' | 'city';

interface Overlay {
  key: string;
  x: number;
  y: number;
  text: string;
  kind: OverlayKind;
}

const OVERLAY_CLASS: Record<OverlayKind, string> = {
  cluster: 'map-cluster-count',
  country: 'map-country-label',
  city: 'map-city-label',
  place: 'map-point-label',
};

function buildGeoJson(
  filterCategory: CategoryId | null | undefined,
  visitedIds: Set<string> | undefined,
  locale: Locale,
  legendsMode: boolean,
) {
  if (legendsMode) {
    return {
      type: 'FeatureCollection' as const,
      features: LEGENDS.flatMap((leg) =>
        leg.claimedLocations.map((claim, i) => {
          const base = L(leg.name, locale);
          return {
            type: 'Feature' as const,
            geometry: { type: 'Point' as const, coordinates: claim.coords },
            properties: {
              id: leg.id,
              category: 'legend',
              name: i === 0 ? base : `${base} · ${L(claim.label, locale)}`,
              visited: 0,
              legend: 1,
            },
          };
        }),
      ),
    };
  }
  return {
    type: 'FeatureCollection' as const,
    features: LOCATIONS.filter((l) => !filterCategory || l.category === filterCategory).map((l) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: l.coords },
      properties: {
        id: l.id,
        category: l.category,
        name: L(l.name, locale),
        visited: visitedIds?.has(l.id) ? 1 : 0,
        legend: 0,
      },
    })),
  };
}

async function probeOnlineStyle(): Promise<boolean> {
  try {
    const res = await fetch(ONLINE_STYLE_URL, {
      method: 'GET',
      signal: AbortSignal.timeout(ONLINE_PROBE_MS),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default function GlobeMap({
  filterCategory,
  visitedIds,
  onSelect,
  focus,
  autoRotate = false,
  interactive = true,
  locale,
  onStyleModeChange,
  legendsMode = false,
  questTrail = null,
}: GlobeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const loadedRef = useRef(false);
  const styleModeRef = useRef<'offline' | 'online'>('offline');
  const revertingRef = useRef(false);
  const tileErrorsRef = useRef(0);
  const filterRef = useRef(filterCategory);
  const visitedRef = useRef(visitedIds);
  const localeRef = useRef(locale);
  const legendsRef = useRef(legendsMode);
  const trailRef = useRef(questTrail);
  filterRef.current = filterCategory;
  visitedRef.current = visitedIds;
  localeRef.current = locale;
  legendsRef.current = legendsMode;
  trailRef.current = questTrail;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onStyleModeChangeRef = useRef(onStyleModeChange);
  onStyleModeChangeRef.current = onStyleModeChange;
  const overlayRootRef = useRef<HTMLDivElement>(null);
  /** Live label nodes — mutated on move so HTML tracks the canvas without React lag. */
  const overlayElsRef = useRef(new Map<string, HTMLSpanElement>());
  /** Prefer keeping the same country names across frames to avoid identity flicker. */
  const stickyCountryKeysRef = useRef<string[]>([]);

  const detailedMap = useSettings((s) => s.detailedMapWhenOnline);

  const setStyleMode = useCallback((mode: 'offline' | 'online') => {
    styleModeRef.current = mode;
    onStyleModeChangeRef.current?.(mode);
  }, []);

  const syncOverlays = useCallback(() => {
    const map = mapRef.current;
    const root = overlayRootRef.current;
    if (!map || !loadedRef.current || !root) return;
    const items: Overlay[] = [];
    const zoom = map.getZoom();
    const offline = styleModeRef.current === 'offline';
    const { width, height } = map.transform;

    const pushPoint = (
      lng: number,
      lat: number,
      text: string,
      kind: OverlayKind,
      key: string,
      yOff = 0,
    ) => {
      if (!text || !isFrontHemisphere(map, lng, lat)) return;
      const p = map.project([lng, lat]);
      if (p.x < -20 || p.y < -20 || p.x > width + 20 || p.y > height + 20) return;
      items.push({ key, x: p.x, y: p.y + yOff, text, kind });
    };

    if (map.getLayer('clusters')) {
      for (const f of map.queryRenderedFeatures({ layers: ['clusters'] })) {
        if (f.geometry.type !== 'Point') continue;
        const [lng, lat] = f.geometry.coordinates as [number, number];
        pushPoint(lng, lat, String(f.properties?.point_count ?? ''), 'cluster', `c${f.properties?.cluster_id}`);
      }
    }

    // Country labels: sticky set + nearest refill for empty slots.
    if (offline && zoom >= COUNTRY_LABEL_MIN_ZOOM && zoom < COUNTRY_LABEL_MAX_ZOOM && map.getSource('country-labels')) {
      const feats = map.querySourceFeatures('country-labels');
      const byName = new Map<string, { lng: number; lat: number; name: string; dist: number }>();
      const c = map.getCenter();
      for (const f of feats) {
        if (f.geometry.type !== 'Point') continue;
        const [lng, lat] = f.geometry.coordinates as [number, number];
        const name = String(f.properties?.name ?? '');
        if (!name || !isFrontHemisphere(map, lng, lat)) continue;
        const p = map.project([lng, lat]);
        if (p.x < -20 || p.y < -20 || p.x > width + 20 || p.y > height + 20) continue;
        const dist = (lng - c.lng) ** 2 + (lat - c.lat) ** 2;
        const prev = byName.get(name);
        if (!prev || dist < prev.dist) byName.set(name, { lng, lat, name, dist });
      }

      const kept: string[] = [];
      for (const name of stickyCountryKeysRef.current) {
        const s = byName.get(name);
        if (!s) continue;
        kept.push(name);
        pushPoint(s.lng, s.lat, s.name, 'country', `co${s.name}`);
        byName.delete(name);
      }
      const refill = [...byName.values()].sort((a, b) => a.dist - b.dist);
      for (const s of refill) {
        if (kept.length >= MAX_COUNTRY_LABELS) break;
        kept.push(s.name);
        pushPoint(s.lng, s.lat, s.name, 'country', `co${s.name}`);
      }
      stickyCountryKeysRef.current = kept;
    } else {
      stickyCountryKeysRef.current = [];
    }

    if (offline && zoom >= CITY_LABEL_MIN_ZOOM && zoom < CITY_LABEL_MAX_ZOOM && map.getLayer('cities')) {
      for (const f of map.queryRenderedFeatures({ layers: ['cities'] })) {
        if (f.geometry.type !== 'Point') continue;
        const [lng, lat] = f.geometry.coordinates as [number, number];
        pushPoint(lng, lat, String(f.properties?.name ?? ''), 'city', `ci${f.properties?.name}:${lng}`, 10);
      }
    }

    if (zoom >= LABEL_MIN_ZOOM && map.getLayer('points')) {
      for (const f of map.queryRenderedFeatures({ layers: ['points'] })) {
        if (f.geometry.type !== 'Point') continue;
        const [lng, lat] = f.geometry.coordinates as [number, number];
        pushPoint(
          lng,
          lat,
          String(f.properties?.name ?? ''),
          'place',
          `p${f.properties?.id ?? `${lng},${lat}`}`,
          12,
        );
      }
    }

    const els = overlayElsRef.current;
    const alive = new Set<string>();
    for (const o of items) {
      alive.add(o.key);
      let el = els.get(o.key);
      if (!el) {
        el = document.createElement('span');
        el.className = OVERLAY_CLASS[o.kind];
        root.appendChild(el);
        els.set(o.key, el);
      }
      if (el.textContent !== o.text) el.textContent = o.text;
      el.style.left = `${o.x}px`;
      el.style.top = `${o.y}px`;
    }
    for (const [key, el] of els) {
      if (alive.has(key)) continue;
      el.remove();
      els.delete(key);
    }
  }, []);

  const attachAtlasLayers = useCallback(
    (map: maplibregl.Map) => {
      map.setProjection({ type: 'globe' });
      loadedRef.current = true;

      if (map.getSource('atlas')) {
        // style.load after setStyle — source gone; always re-add fresh
      }

      if (!map.getSource('atlas')) {
        map.addSource('atlas', {
          type: 'geojson',
          data: buildGeoJson(filterRef.current, visitedRef.current, localeRef.current, legendsRef.current),
          cluster: true,
          clusterMaxZoom: CLUSTER_MAX_ZOOM,
          clusterRadius: 42,
        });
      }

      if (!map.getLayer('clusters')) {
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'atlas',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': '#b08a3c',
            'circle-opacity': 0.9,
            'circle-radius': ['step', ['get', 'point_count'], 13, 5, 17, 12, 22],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fffdf6',
          },
        });
      }

      if (!map.getLayer('points')) {
        map.addLayer({
          id: 'points',
          type: 'circle',
          source: 'atlas',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': colorExpression(),
            'circle-radius': ['case', ['==', ['get', 'legend'], 1], 9, 7],
            'circle-opacity': ['case', ['==', ['get', 'legend'], 1], 0.55, 1],
            'circle-stroke-width': [
              'case',
              ['==', ['get', 'legend'], 1],
              2,
              ['case', ['==', ['get', 'visited'], 1], 3, 1.5],
            ],
            'circle-stroke-color': [
              'case',
              ['==', ['get', 'legend'], 1],
              '#3d2e18',
              ['case', ['==', ['get', 'visited'], 1], '#4d7c4d', '#fffdf6'],
            ],
            'circle-stroke-opacity': ['case', ['==', ['get', 'legend'], 1], 0.45, 1],
          },
        });
      }

      const trailData = buildQuestTrailGeoJson(trailRef.current);
      if (!map.getSource('quest-trail')) {
        map.addSource('quest-trail', { type: 'geojson', data: trailData.line });
      } else {
        (map.getSource('quest-trail') as maplibregl.GeoJSONSource).setData(trailData.line);
      }
      if (!map.getSource('quest-stops')) {
        map.addSource('quest-stops', { type: 'geojson', data: trailData.stops });
      } else {
        (map.getSource('quest-stops') as maplibregl.GeoJSONSource).setData(trailData.stops);
      }
      if (!map.getLayer('quest-trail-line')) {
        map.addLayer({
          id: 'quest-trail-line',
          type: 'line',
          source: 'quest-trail',
          paint: {
            'line-color': '#b08a3c',
            'line-width': 2.5,
            'line-opacity': 0.85,
            'line-dasharray': [2, 1.5],
          },
        });
      }
      if (!map.getLayer('quest-stops-pts')) {
        map.addLayer({
          id: 'quest-stops-pts',
          type: 'circle',
          source: 'quest-stops',
          paint: {
            'circle-radius': ['case', ['==', ['get', 'found'], 1], 8, 6],
            'circle-color': ['case', ['==', ['get', 'found'], 1], '#b08a3c', '#e8dcc4'],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#6b4f2a',
            'circle-opacity': ['case', ['==', ['get', 'found'], 1], 1, 0.7],
          },
        });
      }

      syncOverlays();
    },
    [syncOverlays],
  );

  const applyOfflineStyle = useCallback(
    (map: maplibregl.Map) => {
      revertingRef.current = true;
      tileErrorsRef.current = 0;
      setStyleMode('offline');
      map.setStyle(OFFLINE_STYLE as maplibregl.StyleSpecification);
    },
    [setStyleMode],
  );

  // ── Init map once ──────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OFFLINE_STYLE,
      center: [60, 25],
      zoom: 1.4,
      attributionControl: false,
      interactive,
    });
    mapRef.current = map;
    setStyleMode('offline');

    const onStyleLoad = () => {
      attachAtlasLayers(map);
      revertingRef.current = false;
    };
    map.on('style.load', onStyleLoad);

    map.on('click', 'points', (e) => {
      const id = e.features?.[0]?.properties?.id as string | undefined;
      if (id) onSelectRef.current?.(id);
    });

    map.on('click', 'clusters', async (e) => {
      const f = e.features?.[0];
      if (!f) return;
      const clusterId = f.properties?.cluster_id as number;
      const source = map.getSource('atlas') as maplibregl.GeoJSONSource;
      const zoom = await source.getClusterExpansionZoom(clusterId);
      map.easeTo({ center: (f.geometry as GeoJSON.Point).coordinates as [number, number], zoom });
    });

    for (const layer of ['points', 'clusters']) {
      map.on('mouseenter', layer, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', layer, () => {
        map.getCanvas().style.cursor = '';
      });
    }

    map.on('move', syncOverlays);
    map.on('idle', syncOverlays);

    map.on('error', (e) => {
      if (styleModeRef.current !== 'online' || revertingRef.current) return;
      // Tile / network failures while on online style → fall back offline.
      const msg = (e as { error?: { message?: string }; message?: string }).error?.message
        ?? (e as { message?: string }).message
        ?? '';
      if (/ajax|fetch|network|tile|failed|404|timeout/i.test(msg) || !msg) {
        tileErrorsRef.current += 1;
        if (tileErrorsRef.current >= 2) {
          useToasts.getState().push({ titleKey: 'mapRevertedOffline', emoji: '🗺️' });
          applyOfflineStyle(map);
        }
      }
    });

    let rotating = autoRotate;
    let raf = 0;
    const spin = () => {
      if (!rotating) return;
      const c = map.getCenter();
      map.setCenter([c.lng + 0.02, c.lat]);
      raf = requestAnimationFrame(spin);
    };
    if (autoRotate) {
      const stop = () => {
        rotating = false;
      };
      map.on('pointerdown' as 'mousedown', stop);
      map.on('wheel', stop);
      map.on('touchstart', stop);
      raf = requestAnimationFrame(spin);
    }

    return () => {
      rotating = false;
      cancelAnimationFrame(raf);
      loadedRef.current = false;
      for (const el of overlayElsRef.current.values()) el.remove();
      overlayElsRef.current.clear();
      stickyCountryKeysRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Opt-in online style swap ───────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let cancelled = false;

    (async () => {
      if (!detailedMap) {
        if (styleModeRef.current === 'online') applyOfflineStyle(map);
        return;
      }
      if (styleModeRef.current === 'online') return;
      const ok = await probeOnlineStyle();
      if (cancelled || !mapRef.current) return;
      if (!ok) {
        useToasts.getState().push({ titleKey: 'mapOnlineUnavailable', emoji: '📡' });
        return;
      }
      tileErrorsRef.current = 0;
      setStyleMode('online');
      map.setStyle(ONLINE_STYLE_URL);
    })();

    return () => {
      cancelled = true;
    };
  }, [detailedMap, applyOfflineStyle, setStyleMode]);

  // ── Data updates (filter / visited / locale / legends) ─────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const source = map.getSource('atlas') as maplibregl.GeoJSONSource | undefined;
      source?.setData(buildGeoJson(filterCategory, visitedIds, locale, legendsMode));
      syncOverlays();
    };
    if (loadedRef.current) apply();
    else map.once('style.load', apply);
  }, [filterCategory, visitedIds, locale, legendsMode, syncOverlays]);

  // ── Quest trail updates ────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const data = buildQuestTrailGeoJson(questTrail);
      const line = map.getSource('quest-trail') as maplibregl.GeoJSONSource | undefined;
      const stops = map.getSource('quest-stops') as maplibregl.GeoJSONSource | undefined;
      line?.setData(data.line);
      stops?.setData(data.stops);
      if (questTrail && questTrail.length > 0) {
        const lngs = questTrail.map((s) => s.coords[0]);
        const lats = questTrail.map((s) => s.coords[1]);
        map.fitBounds(
          [
            [Math.min(...lngs) - 8, Math.min(...lats) - 6],
            [Math.max(...lngs) + 8, Math.max(...lats) + 6],
          ],
          { padding: 48, duration: 1400, maxZoom: 3.8 },
        );
      }
    };
    if (loadedRef.current) apply();
    else map.once('style.load', apply);
  }, [questTrail]);

  // ── Focus flights ──────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focus) return;
    map.flyTo({ center: focus.center, zoom: focus.zoom ?? 5.2, duration: 2200, essential: true });
  }, [focus]);

  return (
    <div className={`map-root ${legendsMode ? 'map-root-legends' : ''}`}>
      <div className="map-container" ref={containerRef} />
      <div className="map-overlay" ref={overlayRootRef} />
      <div className="map-compass" aria-hidden="true">
        <svg viewBox="0 0 64 64" className="map-compass-svg">
          <circle cx="32" cy="32" r="30" className="map-compass-ring" />
          <circle cx="32" cy="32" r="22" className="map-compass-ring-inner" />
          <polygon points="32,6 36,32 32,28 28,32" className="map-compass-needle-n" />
          <polygon points="32,58 28,32 32,36 36,32" className="map-compass-needle-s" />
          <text x="32" y="14" textAnchor="middle" className="map-compass-letter">
            N
          </text>
          <text x="54" y="35" textAnchor="middle" className="map-compass-letter">
            E
          </text>
          <text x="32" y="56" textAnchor="middle" className="map-compass-letter">
            S
          </text>
          <text x="10" y="35" textAnchor="middle" className="map-compass-letter">
            W
          </text>
        </svg>
      </div>
    </div>
  );
}
