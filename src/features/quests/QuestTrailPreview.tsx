import { LOCATION_BY_ID } from '../../data/locations';
import type { QuestStep } from '../../data/quests';
import { useT } from '../../i18n/useT';

const EARTH_RADIUS_KM = 6371;

function haversineKm(lon1: number, lat1: number, lon2: number, lat2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

function formatKmNumber(km: number): string {
  if (km < 10) return km.toFixed(1);
  if (km < 100) return String(Math.round(km));
  return String(Math.round(km / 10) * 10);
}

/** Compact SVG of confirmed quest stops only — appears once two are linked. */
export default function QuestTrailPreview({
  steps,
  foundIds,
}: {
  steps: QuestStep[];
  foundIds: Set<string>;
}) {
  const { t } = useT();

  const pts = steps
    .map((s, i) => {
      if (!foundIds.has(s.id)) return null;
      const loc = LOCATION_BY_ID[s.id];
      return loc
        ? { id: s.id, lon: loc.coords[0], lat: loc.coords[1], index: i + 1 }
        : null;
    })
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (pts.length < 2) return null;

  const lons = pts.map((p) => p.lon);
  const lats = pts.map((p) => p.lat);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const pad = 16;
  const W = 280;
  const H = 120;
  const dx = Math.max(maxLon - minLon, 0.01);
  const dy = Math.max(maxLat - minLat, 0.01);

  const xy = (lon: number, lat: number) => {
    const x = pad + ((lon - minLon) / dx) * (W - pad * 2);
    const y = pad + ((maxLat - lat) / dy) * (H - pad * 2);
    return [x, y] as const;
  };

  const poly = pts.map((p) => xy(p.lon, p.lat).join(',')).join(' ');

  const segments = pts.slice(0, -1).map((a, i) => {
    const b = pts[i + 1];
    const [x1, y1] = xy(a.lon, a.lat);
    const [x2, y2] = xy(b.lon, b.lat);
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    // Nudge label off the line so it stays readable when stops are close.
    const vx = x2 - x1;
    const vy = y2 - y1;
    const len = Math.hypot(vx, vy) || 1;
    const ox = (-vy / len) * 10;
    const oy = (vx / len) * 10;
    const km = haversineKm(a.lon, a.lat, b.lon, b.lat);
    const label = t('questTrailDistanceKm').replace('{n}', formatKmNumber(km));
    return { key: `${a.id}-${b.id}`, x: mx + ox, y: my + oy, label };
  });

  return (
    <svg className="quest-trail-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden>
      <polyline
        points={poly}
        fill="none"
        stroke="rgba(176, 138, 60, 0.55)"
        strokeWidth="2"
        strokeDasharray="4 4"
        strokeLinejoin="round"
      />
      {segments.map((s) => (
        <text
          key={s.key}
          className="quest-trail-dist"
          x={s.x}
          y={s.y}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {s.label}
        </text>
      ))}
      {pts.map((p) => {
        const [x, y] = xy(p.lon, p.lat);
        return (
          <g key={p.id}>
            <circle cx={x} cy={y} r={6} fill="#b08a3c" stroke="#6b4f2a" strokeWidth="1.5" />
            <text
              x={x}
              y={y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="8"
              fill="#fffdf6"
            >
              {p.index}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
