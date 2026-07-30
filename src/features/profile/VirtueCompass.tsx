import { useT } from '../../i18n/useT';
import { VIRTUES } from '../../data/virtues';
import { LOCATIONS } from '../../data/locations';
import { useProgress, virtueCounts } from '../../state/store';

const SIZE = 260;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 88;

/**
 * Radar chart of which virtues the explorer's read stories embody.
 * Each axis is scaled against how many places in the whole atlas carry
 * that virtue, so a full ring means "you have read every place of this
 * kind" rather than an arbitrary number.
 */
export default function VirtueCompass() {
  const { t, L } = useT();
  const read = useProgress((s) => s.read);
  const counts = virtueCounts(read);

  const axes = VIRTUES.map((v, i) => {
    const total = LOCATIONS.filter((l) => l.virtues.includes(v.id)).length;
    const got = counts[v.id] ?? 0;
    const ratio = total > 0 ? got / total : 0;
    // Start at 12 o'clock and go clockwise.
    const angle = (i / VIRTUES.length) * Math.PI * 2 - Math.PI / 2;
    return { v, got, total, ratio, angle };
  });

  const point = (angle: number, radius: number) =>
    [CX + Math.cos(angle) * radius, CY + Math.sin(angle) * radius] as const;

  const polygon = axes
    .map(({ angle, ratio }) => point(angle, Math.max(ratio, 0.02) * R).join(','))
    .join(' ');

  const anyProgress = axes.some((a) => a.got > 0);

  return (
    <div className="section">
      <h2>🧭 {t('compassTitle')}</h2>
      <p className="page-subtitle" style={{ marginBottom: 10 }}>
        {anyProgress ? t('compassIntro') : t('compassEmpty')}
      </p>

      <div className="card compass-card">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="compass-svg" role="img" aria-label={t('compassTitle')}>
          {/* Rings */}
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <circle key={f} cx={CX} cy={CY} r={R * f} className="compass-ring" />
          ))}
          {/* Spokes */}
          {axes.map(({ v, angle }) => {
            const [x, y] = point(angle, R);
            return <line key={v.id} x1={CX} y1={CY} x2={x} y2={y} className="compass-spoke" />;
          })}
          {/* The explorer's shape */}
          <polygon points={polygon} className="compass-shape" />
          {/* Virtue emoji at each axis tip */}
          {axes.map(({ v, angle, got }) => {
            const [x, y] = point(angle, R + 18);
            return (
              <text
                key={v.id}
                x={x}
                y={y}
                className={`compass-label ${got > 0 ? '' : 'dim'}`}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {v.emoji}
              </text>
            );
          })}
        </svg>

        <ul className="compass-legend">
          {axes.map(({ v, got, total }) => (
            <li key={v.id} className={got > 0 ? '' : 'dim'}>
              <span>{v.emoji} {L(v.name)}</span>
              <span className="compass-count">
                {got}/{total} {t('compassPlacesCount')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
