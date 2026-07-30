import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useT } from '../../i18n/useT';
import { LEGEND_BY_ID } from '../../data/legends';
import { LOCATION_BY_ID } from '../../data/locations';
import { CATEGORY_BY_ID } from '../../data/categories';
import { useProgress, legendsUnlocked } from '../../state/store';

export default function LegendPage() {
  const { id } = useParams<{ id: string }>();
  const { t, L } = useT();
  const navigate = useNavigate();
  const progress = useProgress();
  const exploreLegend = useProgress((s) => s.exploreLegend);
  const unlocked = legendsUnlocked(progress);
  const legend = id ? LEGEND_BY_ID[id] : undefined;

  useEffect(() => {
    if (legend && unlocked) exploreLegend(legend.id);
  }, [legend, unlocked, exploreLegend]);

  if (!legend) {
    return (
      <div className="page">
        <p>Not found.</p>
        <Link to="/atlas" className="btn secondary">{t('back')}</Link>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="page">
        <p className="page-subtitle">{t('atlasLegendsLocked')}</p>
        <Link to="/atlas" className="btn secondary">{t('back')}</Link>
      </div>
    );
  }

  const related = legend.relatedRealPlace ? LOCATION_BY_ID[legend.relatedRealPlace] : undefined;

  return (
    <div>
      <div className="loc-hero legend-hero">
        <div className="loc-hero-inner">
          <button className="btn subtle" style={{ padding: '6px 14px', marginBottom: 12 }} onClick={() => navigate(-1)}>
            ← {t('back')}
          </button>
          <div className="loc-hero-emoji">{legend.emoji}</div>
          <h1>{L(legend.name)}</h1>
          <div className="legend-banner">{t('legendBanner')}</div>
        </div>
      </div>

      <div className="page">
        <div className="section">
          <h2>{t('legendFirstSource')}</h2>
          <p>{L(legend.firstSource)}</p>
        </div>

        <div className="section story">
          <h2>{t('legendWhyPersists')}</h2>
          {L(legend.theWhyItPersists).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="section">
          <h2>{t('legendClaimedSites')}</h2>
          <ul className="legend-sites">
            {legend.claimedLocations.map((c, i) => (
              <li key={i}>
                <strong>{L(c.label)}</strong>
                <span className="result-sub">
                  {' '}
                  ({c.coords[1].toFixed(1)}°, {c.coords[0].toFixed(1)}°)
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h2>{t('legendTheories')}</h2>
          <div className="timeline">
            {legend.leadingTheories.map((th, i) => (
              <div className="tl-item" key={i}>
                <div className="tl-year">{L(th.title)}</div>
                <div className="tl-event">{L(th.summary)}</div>
              </div>
            ))}
          </div>
        </div>

        {related && (
          <div className="section">
            <h2>{t('legendRelatedPlace')}</h2>
            <Link to={`/location/${related.id}`} className="card" style={{ display: 'block', textDecoration: 'none' }}>
              {CATEGORY_BY_ID[related.category].emoji} {L(related.name)}
            </Link>
          </div>
        )}

        <div className="section">
          <Link className="btn secondary" to="/atlas?legends=1">
            🗺️ {t('atlasLegends')}
          </Link>
        </div>
      </div>
    </div>
  );
}
