import { useState } from 'react';
import { useT } from '../../i18n/useT';
import { RANKS, nextRankForXp, rankForXp } from '../../engine/progression';

/** Bottom sheet listing all ranks with XP thresholds and blurbs. */
export default function RankLadder({
  xp,
  open,
  onClose,
}: {
  xp: number;
  open: boolean;
  onClose: () => void;
}) {
  const { t, L } = useT();
  const current = rankForXp(xp);
  const next = nextRankForXp(xp);
  const [selectedId, setSelectedId] = useState<string | null>(current.id);

  if (!open) return null;

  const selected = RANKS.find((r) => r.id === selectedId) ?? current;

  return (
    <div className="rank-ladder-backdrop" onClick={onClose} role="presentation">
      <div
        className="sheet reveal rank-ladder-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={t('rankLadderTitle')}
      >
        <button type="button" className="sheet-close" onClick={onClose} aria-label={t('close')}>
          ✕
        </button>
        <h2>{t('rankLadderTitle')}</h2>
        <p className="page-subtitle" style={{ marginBottom: 10 }}>
          {t('rankLadderTap')}
          {next && (
            <>
              {' · '}
              {t('rankLadderNeed').replace('{n}', String(Math.max(0, next.minXp - xp)))}{' '}
              {next.emoji} {L(next.name)}
            </>
          )}
        </p>
        <ul className="rank-ladder-list">
          {RANKS.map((r) => {
            const isCurrent = r.id === current.id;
            const unlocked = xp >= r.minXp;
            const active = r.id === selected.id;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  className={`rank-ladder-row ${isCurrent ? 'current' : ''} ${active ? 'active' : ''} ${unlocked ? '' : 'locked'}`}
                  onClick={() => setSelectedId(r.id)}
                >
                  <span className="rank-ladder-emoji">{r.emoji}</span>
                  <span className="rank-ladder-meta">
                    <span className="rank-ladder-name">
                      {L(r.name)}
                      {isCurrent && <span className="tag gold">{t('rankLadderCurrent')}</span>}
                    </span>
                    <span className="rank-ladder-xp">
                      {r.minXp} {t('profileXp')}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="rank-ladder-blurb">
          <div className="rank-ladder-blurb-title">
            {selected.emoji} {L(selected.name)}
          </div>
          <p>{L(selected.blurb)}</p>
        </div>
      </div>
    </div>
  );
}
