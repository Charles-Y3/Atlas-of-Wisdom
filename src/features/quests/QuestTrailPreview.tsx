import { LOCATION_BY_ID } from '../../data/locations';
import type { QuestStep } from '../../data/quests';

/** Compact SVG of confirmed quest stops only — appears once two are linked. */
export default function QuestTrailPreview({
  steps,
  foundIds,
}: {
  steps: QuestStep[];
  foundIds: Set<string>;
}) {
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
  const pad = 12;
  const W = 280;
  const H = 100;
  const dx = Math.max(maxLon - minLon, 0.01);
  const dy = Math.max(maxLat - minLat, 0.01);

  const xy = (lon: number, lat: number) => {
    const x = pad + ((lon - minLon) / dx) * (W - pad * 2);
    const y = pad + ((maxLat - lat) / dy) * (H - pad * 2);
    return [x, y] as const;
  };

  const poly = pts.map((p) => xy(p.lon, p.lat).join(',')).join(' ');

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
