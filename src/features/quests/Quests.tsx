import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/useT';
import { QUESTS } from '../../data/quests';
import { LOCATIONS, LOCATION_BY_ID } from '../../data/locations';
import { CATEGORY_BY_ID } from '../../data/categories';
import { useProgress } from '../../state/store';

function QuestGuessForm({
  questId,
  correctId,
}: {
  questId: string;
  correctId: string;
}) {
  const { t, L } = useT();
  const completeQuestStep = useProgress((s) => s.completeQuestStep);
  const [countryKey, setCountryKey] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [wrong, setWrong] = useState(false);

  const countries = useMemo(() => {
    const map = new Map<string, string>();
    for (const loc of LOCATIONS) {
      const key = loc.country.en;
      if (!map.has(key)) map.set(key, L(loc.country));
    }
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [L]);

  const places = useMemo(() => {
    const list = countryKey
      ? LOCATIONS.filter((l) => l.country.en === countryKey)
      : LOCATIONS;
    return [...list].sort((a, b) => L(a.name).localeCompare(L(b.name)));
  }, [countryKey, L]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!placeId) return;
    if (placeId !== correctId) {
      setWrong(true);
      return;
    }
    setWrong(false);
    completeQuestStep(questId, correctId);
  }

  return (
    <form className="quest-guess" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
      <label className="quest-guess-field">
        <span>{t('questGuessCountry')}</span>
        <select
          value={countryKey}
          onChange={(e) => {
            setCountryKey(e.target.value);
            setPlaceId('');
            setWrong(false);
          }}
        >
          <option value="">{t('questGuessPickCountry')}</option>
          {countries.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="quest-guess-field">
        <span>{t('questGuessPlace')}</span>
        <select
          value={placeId}
          onChange={(e) => {
            setPlaceId(e.target.value);
            setWrong(false);
          }}
        >
          <option value="">{t('questGuessPickPlace')}</option>
          {places.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {CATEGORY_BY_ID[loc.category].emoji} {L(loc.name)}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn" disabled={!placeId}>
        {t('questGuessSubmit')}
      </button>
      {wrong && <p className="quest-guess-wrong">{t('questGuessWrong')}</p>}
      <Link className="btn subtle quest-search-atlas" to="/atlas">
        🗺️ {t('questSearchAtlas')}
      </Link>
    </form>
  );
}

export default function Quests() {
  const { t, L } = useT();
  const questProgress = useProgress((s) => s.questProgress);
  const completedQuests = useProgress((s) => s.completedQuests);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="page">
      <h1 className="page-title">🛤️ {t('questsTitle')}</h1>
      <p className="page-subtitle">{t('questsSubtitle')}</p>

      <div className="quest-list">
        {QUESTS.map((q) => {
          const done = new Set(questProgress?.[q.id]?.completedSteps ?? []);
          const found = q.steps.filter((s) => done.has(s.id)).length;
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
                {!isComplete && (
                  <p className="nudge-line">
                    {t('questNudge').replace('{n}', String(total - found))}
                  </p>
                )}
              </button>

              {expanded && (
                <ol className="quest-steps">
                  {q.steps.map((step, i) => {
                    const foundStep = done.has(step.id);
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
                                <QuestGuessForm questId={q.id} correctId={step.id} />
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
