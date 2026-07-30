import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/useT';
import { LOCATIONS } from '../../data/locations';
import { CATEGORY_BY_ID, TRADITION_BY_ID } from '../../data/categories';
import { useProgress } from '../../state/store';
import type { AtlasLocation } from '../../data/types';

export default function Discovery() {
  const { t, L } = useT();
  const [revealed, setRevealed] = useState<AtlasLocation | null>(null);
  const [spinning, setSpinning] = useState(false);
  const visited = useProgress((s) => s.visited);
  const recordDiscovery = useProgress((s) => s.recordDiscovery);

  function discover() {
    if (spinning) return;
    setSpinning(true);
    setRevealed(null);
    // Prefer unvisited places so Discovery keeps opening new doors.
    const unvisited = LOCATIONS.filter((l) => !visited[l.id]);
    const pool = unvisited.length > 0 ? unvisited : LOCATIONS;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setTimeout(() => {
      setSpinning(false);
      setRevealed(pick);
      recordDiscovery(pick.id);
    }, 900);
  }

  const wasNew = revealed ? !visited[revealed.id] || true : false;

  return (
    <div className="page">
      <h1 className="page-title">🎲 {t('discoverTitle')}</h1>
      <p className="page-subtitle">{t('discoverSubtitle')}</p>

      <div className="discover-stage">
        {spinning ? (
          <>
            <div className="discover-globe-emoji">🌍</div>
            <p className="page-subtitle">{t('discoverRevealing')}</p>
          </>
        ) : revealed ? (
          <div className="card reveal" style={{ width: '100%', textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: 48 }}>{CATEGORY_BY_ID[revealed.category].emoji}</div>
            <h2 style={{ fontSize: 22, margin: '8px 0 2px' }}>{L(revealed.name)}</h2>
            <p className="feature-sub" style={{ marginBottom: 10 }}>
              {L(revealed.country)} · {L(revealed.region)}
            </p>
            <div className="meta-row" style={{ justifyContent: 'center' }}>
              {revealed.traditions.map((tr) => (
                <span key={tr} className="tag">
                  {TRADITION_BY_ID[tr].emoji} {L(TRADITION_BY_ID[tr].name)}
                </span>
              ))}
              {revealed.unesco && <span className="tag gold">🏵️ UNESCO</span>}
            </div>
            <p style={{ fontSize: 14.5, textAlign: 'left', margin: '12px 0' }}>
              {L(revealed.whyItMatters)[0]}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link className="btn" to={`/location/${revealed.id}`}>
                {t('atlasOpenLocation')} →
              </Link>
              <button className="btn secondary" onClick={discover}>
                🎲 {t('discoverAgain')}
              </button>
            </div>
            {wasNew && <p className="feature-sub" style={{ marginTop: 8 }}>✨ {t('discoverNew')}</p>}
          </div>
        ) : (
          <>
            <div className="discover-globe-emoji">🌍</div>
            <button className="btn" style={{ fontSize: 18, padding: '14px 34px' }} onClick={discover}>
              🎲 {t('discoverButton')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
