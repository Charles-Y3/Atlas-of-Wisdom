import { useEffect, useState } from 'react';
import { useT } from '../../i18n/useT';
import type { UiKey } from '../../i18n/strings';
import {
  RANKS,
  RANK_UNLOCK_KEY,
  nextRankForXp,
  rankForXp,
  type Rank,
} from '../../engine/progression';

/** Centered popup listing ranks; tap a row for a detail popup. */
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
  const [detail, setDetail] = useState<Rank | null>(null);

  useEffect(() => {
    if (!open) setDetail(null);
  }, [open]);

  if (!open) return null;

  const unlockLine = (rank: Rank) => {
    const key = RANK_UNLOCK_KEY[rank.id];
    return key ? t(key as UiKey) : '';
  };

  return (
    <div
      className="rank-ladder-backdrop"
      onClick={() => {
        if (detail) setDetail(null);
        else onClose();
      }}
      role="presentation"
    >
      {detail ? (
        <div
          className="rank-detail-popup reveal"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label={L(detail.name)}
        >
          <button
            type="button"
            className="sheet-close"
            onClick={() => setDetail(null)}
            aria-label={t('close')}
          >
            ✕
          </button>
          <div className="rank-detail-emoji">{detail.emoji}</div>
          <h3 className="rank-detail-name">{L(detail.name)}</h3>
          <p className="rank-detail-xp">
            {detail.minXp} {t('profileXp')}
            {detail.id === current.id && (
              <>
                {' · '}
                <span className="tag gold">{t('rankLadderCurrent')}</span>
              </>
            )}
          </p>
          <p className="rank-detail-blurb">{L(detail.blurb)}</p>
          <p className="rank-detail-unlock">
            <span className="rank-detail-unlock-label">{t('rankLadderUnlocks')}</span>
            {unlockLine(detail)}
          </p>
        </div>
      ) : (
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
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    className={`rank-ladder-row ${isCurrent ? 'current' : ''} ${unlocked ? '' : 'locked'}`}
                    onClick={() => setDetail(r)}
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
        </div>
      )}
    </div>
  );
}
