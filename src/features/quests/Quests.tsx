import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/useT';
import { QUESTS } from '../../data/quests';
import { LOCATION_BY_ID } from '../../data/locations';
import { CATEGORY_BY_ID } from '../../data/categories';
import { useProgress } from '../../state/store';

export default function Quests() {
  const { t, L } = useT();
  const visited = useProgress((s) => s.visited);
  const completedQuests = useProgress((s) => s.completedQuests);
  const [openId, setOpenId] = useState<string | null>(null);

  // Backfill XP for places already visited before quest tracking existed.
  useEffect(() => {
    const run = () => useProgress.getState().syncQuestProgress();
    if (useProgress.persist.hasHydrated()) {
      run();
      return;
    }
    return useProgress.persist.onFinishHydration(run);
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">🛤️ {t('questsTitle')}</h1>
      <p className="page-subtitle">{t('questsSubtitle')}</p>

      <div className="quest-list">
        {QUESTS.map((q) => {
          const found = q.steps.filter((s) => visited[s.id]).length;
          const total = q.steps.length;
          const isComplete = completedQuests?.includes(q.id) || found === total;
          const expanded = openId === q.id;

          return (
            <div key={q.id} className={`card quest-card ${isComplete ? 'quest-done' : ''}`}>
              <button
                type="button"
                className="quest-toggle"
                onClick={() => setOpenId(expanded ? null : q.id)}
                aria-expanded={expanded}
              >
                <div className="quest-head">
                  <span className="quest-emoji">{q.emoji}</span>
                  <div className="quest-head-text">
                    <div className="quest-name">
                      {L(q.name)}{' '}
                      {isComplete && <span className="tag gold">✓ {t('questComplete')}</span>}
                    </div>
                    <p className="quest-blurb">{L(q.blurb)}</p>
                  </div>
                </div>
                <div className="progress">
                  <div style={{ width: `${total ? (found / total) * 100 : 0}%` }} />
                </div>
                <div className="progress-label">
                  {found} / {total} {t('questProgress')}
                </div>
              </button>

              {expanded && (
                <ol className="quest-steps">
                  {q.steps.map((step, i) => {
                    const foundStep = Boolean(visited[step.id]);
                    const loc = LOCATION_BY_ID[step.id];
                    return (
                      <li key={step.id} className={foundStep ? 'found' : 'hidden-step'}>
                        <div className="quest-step-row">
                          <span className="quest-step-mark">{foundStep ? '✓' : '?'}</span>
                          <div className="quest-step-body">
                            {foundStep && loc ? (
                              <>
                                <div className="quest-step-name">
                                  {CATEGORY_BY_ID[loc.category].emoji} {L(loc.name)}
                                </div>
                                <p className="quest-hint">{L(step.hint)}</p>
                                <Link className="btn subtle quest-open-found" to={`/location/${step.id}`}>
                                  {t('atlasOpenLocation')} →
                                </Link>
                              </>
                            ) : (
                              <>
                                <div className="quest-step-name">
                                  {t('questClue')} {i + 1}
                                </div>
                                <p className="quest-hint">{L(step.hint)}</p>
                                <Link className="btn secondary quest-search-atlas" to="/atlas">
                                  🗺️ {t('questSearchAtlas')}
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
