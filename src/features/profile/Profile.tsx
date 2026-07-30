import { useT } from '../../i18n/useT';
import { useLocale } from '../../state/localeStore';
import { useSettings } from '../../state/settingsStore';
import { VISIBLE_LOCALES, LOCALE_LABELS } from '../../i18n/types';
import { ACHIEVEMENTS } from '../../data/achievements';
import { rankForXp, nextRankForXp } from '../../engine/progression';
import { useProgress, statsOf } from '../../state/store';
import VirtueCompass from './VirtueCompass';

export default function Profile() {
  const { t, L } = useT();
  const locale = useLocale((s) => s.locale);
  const setLocale = useLocale((s) => s.setLocale);
  const detailedMap = useSettings((s) => s.detailedMapWhenOnline);
  const setDetailedMap = useSettings((s) => s.setDetailedMapWhenOnline);
  const progress = useProgress();
  const stats = statsOf(progress);
  const rank = rankForXp(progress.xp);
  const next = nextRankForXp(progress.xp);

  const pct = next
    ? Math.min(100, Math.round(((progress.xp - rank.minXp) / (next.minXp - rank.minXp)) * 100))
    : 100;

  function reset() {
    if (window.confirm(t('profileResetConfirm'))) progress.reset();
  }

  return (
    <div className="page">
      <h1 className="page-title">🧭 {t('profileTitle')}</h1>
      <p className="page-subtitle">{t('profileAbout')}</p>

      <div className="card rank-card">
        <div className="rank-emoji">{rank.emoji}</div>
        <div className="rank-name">{L(rank.name)}</div>
        <p className="rank-blurb">{L(rank.blurb)}</p>
        <div className="progress">
          <div style={{ width: `${pct}%` }} />
        </div>
        <div className="progress-label">
          {progress.xp} {t('profileXp')}
          {next && (
            <>
              {' · '}{t('profileNextRank')}: {next.emoji} {L(next.name)} ({next.minXp} {t('profileXp')})
            </>
          )}
        </div>
      </div>

      <div className="section">
        <h2>{t('profileStats')}</h2>
        <div className="fact-grid">
          <div className="fact">
            <div className="fact-label">{t('profileStatPlaces')}</div>
            <div className="fact-value">{stats.placesExplored}</div>
          </div>
          <div className="fact">
            <div className="fact-label">{t('profileStatStories')}</div>
            <div className="fact-value">{stats.storiesRead}</div>
          </div>
          <div className="fact">
            <div className="fact-label">{t('profileStatCollections')}</div>
            <div className="fact-value">{stats.collectionsCompleted}</div>
          </div>
          <div className="fact">
            <div className="fact-label">{t('profileStatContinents')}</div>
            <div className="fact-value">{stats.continentsReached}</div>
          </div>
        </div>
      </div>

      <VirtueCompass />

      <div className="section">
        <h2>{t('profileAchievements')}</h2>
        <div className="ach-grid">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = progress.achievements.includes(a.id);
            return (
              <div key={a.id} className={`ach ${unlocked ? '' : 'locked'}`}>
                <div className="ach-emoji">{a.emoji}</div>
                <div className="ach-name">{L(a.name)}</div>
                <div className="ach-desc">{L(a.description)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="section">
        <h2>{t('language')}</h2>
        <div className="chip-row">
          {VISIBLE_LOCALES.map((l) => (
            <button key={l} className={`chip ${locale === l ? 'active' : ''}`} onClick={() => setLocale(l)}>
              {LOCALE_LABELS[l].flagEmoji} {LOCALE_LABELS[l].native}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>{t('settingsMap')}</h2>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={detailedMap}
            onChange={(e) => setDetailedMap(e.target.checked)}
          />
          <span>{t('settingsDetailedMap')}</span>
        </label>
        <p className="page-subtitle" style={{ marginTop: 6 }}>
          {t('settingsDetailedMapHint')}
        </p>
      </div>

      <div className="section">
        <button className="btn subtle" onClick={reset}>
          🗑️ {t('profileReset')}
        </button>
      </div>
    </div>
  );
}
