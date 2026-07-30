import { useState } from 'react';
import { useT } from '../../i18n/useT';
import { useLocale } from '../../state/localeStore';
import { useSettings } from '../../state/settingsStore';
import { VISIBLE_LOCALES, LOCALE_LABELS } from '../../i18n/types';
import { ACHIEVEMENTS } from '../../data/achievements';
import { rankForXp, nextRankForXp } from '../../engine/progression';
import { useProgress, statsOf } from '../../state/store';
import VirtueCompass from './VirtueCompass';
import StreakRitual from './StreakRitual';
import ReflectionsJournal from './ReflectionsJournal';
import RankLadder from './RankLadder';
import { exportPassportPng } from './exportPassport';

type Tab = 'overview' | 'journey' | 'achievements' | 'settings';

export default function Profile() {
  const { t, L, locale } = useT();
  const setLocale = useLocale((s) => s.setLocale);
  const detailedMap = useSettings((s) => s.detailedMapWhenOnline);
  const setDetailedMap = useSettings((s) => s.setDetailedMapWhenOnline);
  const younger = useSettings((s) => s.youngerExplorer);
  const setYounger = useSettings((s) => s.setYoungerExplorer);
  const sound = useSettings((s) => s.soundEnabled);
  const setSound = useSettings((s) => s.setSoundEnabled);
  const progress = useProgress();
  const stats = statsOf(progress);
  const rank = rankForXp(progress.xp);
  const next = nextRankForXp(progress.xp);
  const [tab, setTab] = useState<Tab>('overview');
  const [rankOpen, setRankOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const pct = next
    ? Math.min(100, Math.round(((progress.xp - rank.minXp) / (next.minXp - rank.minXp)) * 100))
    : 100;

  function reset() {
    if (window.confirm(t('profileResetConfirm'))) progress.reset();
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: t('profileTabOverview') },
    { id: 'journey', label: t('profileTabJourney') },
    { id: 'achievements', label: t('profileTabAchievements') },
    { id: 'settings', label: t('profileTabSettings') },
  ];

  return (
    <div className="page">
      <h1 className="page-title">🧭 {t('profileTitle')}</h1>
      <p className="page-subtitle">{t('profileAbout')}</p>

      <div className="chip-row profile-tabs" style={{ marginBottom: 14 }}>
        {tabs.map((tabDef) => (
          <button
            key={tabDef.id}
            type="button"
            className={`chip ${tab === tabDef.id ? 'active' : ''}`}
            onClick={() => setTab(tabDef.id)}
          >
            {tabDef.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <StreakRitual count={stats.streak} />

          <div className="card rank-card">
            <button type="button" className="rank-card-open" onClick={() => setRankOpen(true)}>
              <div className="rank-emoji">{rank.emoji}</div>
              <div className="rank-name">{L(rank.name)}</div>
              <p className="rank-blurb">{L(rank.blurb)}</p>
            </button>
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
            <button
              type="button"
              className="btn secondary"
              style={{ marginTop: 14 }}
              disabled={exporting}
              onClick={() => {
                setExporting(true);
                void exportPassportPng(
                  {
                    xp: progress.xp,
                    streak: progress.streak,
                    visited: progress.visited,
                    reflections: progress.reflections ?? {},
                    practices: progress.practices ?? {},
                    completedCollections: progress.completedCollections,
                  },
                  locale,
                  t('appName'),
                ).finally(() => setExporting(false));
              }}
            >
              🛂 {exporting ? t('loading') : t('profileExportPassport')}
            </button>
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
        </>
      )}

      {tab === 'journey' && (
        <>
          <VirtueCompass />
          <ReflectionsJournal />
        </>
      )}

      {tab === 'achievements' && (
        <div className="section" style={{ marginTop: 0 }}>
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
      )}

      {tab === 'settings' && (
        <>
          <div className="section" style={{ marginTop: 0 }}>
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
            <label className="settings-toggle" style={{ marginTop: 14 }}>
              <input
                type="checkbox"
                checked={younger}
                onChange={(e) => setYounger(e.target.checked)}
              />
              <span>{t('settingsYounger')}</span>
            </label>
            <p className="page-subtitle" style={{ marginTop: 6 }}>
              {t('settingsYoungerHint')}
            </p>
            <label className="settings-toggle" style={{ marginTop: 14 }}>
              <input
                type="checkbox"
                checked={sound}
                onChange={(e) => setSound(e.target.checked)}
              />
              <span>{t('settingsSound')}</span>
            </label>
            <p className="page-subtitle" style={{ marginTop: 6 }}>
              {t('settingsSoundHint')}
            </p>
          </div>

          <div className="section">
            <button className="btn subtle" onClick={reset}>
              🗑️ {t('profileReset')}
            </button>
          </div>
        </>
      )}

      <RankLadder xp={progress.xp} open={rankOpen} onClose={() => setRankOpen(false)} />
    </div>
  );
}
