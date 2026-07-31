import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/useT';
import {
  QUEST_TIERS,
  QUESTS_BY_TIER,
  questTierUnlocked,
  type QuestDef,
  type QuestKind,
  type QuestTier,
} from '../../data/quests';
import { LOCATIONS, LOCATION_BY_ID } from '../../data/locations';
import { CATEGORY_BY_ID } from '../../data/categories';
import { useProgress } from '../../state/store';
import type { UiKey } from '../../i18n/strings';
import QuestTrailPreview from './QuestTrailPreview';

const KIND_LABEL: Record<QuestKind, UiKey> = {
  pilgrimage: 'questKindPilgrimage',
  learning: 'questKindLearning',
  mountain: 'questKindMountain',
  route: 'questKindRoute',
  devotion: 'questKindDevotion',
  legend: 'questKindLegend',
  epoch: 'questKindEpoch',
  ocean: 'questKindOcean',
};

const TIER_LABEL: Record<QuestTier, UiKey> = {
  beginner: 'questTierBeginner',
  intermediate: 'questTierIntermediate',
  advanced: 'questTierAdvanced',
};

const PREV_TIER: Record<QuestTier, QuestTier | null> = {
  beginner: null,
  intermediate: 'beginner',
  advanced: 'intermediate',
};

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

function QuestCard({
  q,
  expanded,
  onToggle,
}: {
  q: QuestDef;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { t, L } = useT();
  const questProgress = useProgress((s) => s.questProgress);
  const completedQuests = useProgress((s) => s.completedQuests);
  const done = new Set(questProgress?.[q.id]?.completedSteps ?? []);
  const found = q.steps.filter((s) => done.has(s.id)).length;
  const total = q.steps.length;
  const isComplete = completedQuests?.includes(q.id) || found === total;

  return (
    <div className={`card quest-card ${isComplete ? 'quest-done' : ''}`}>
      <button
        type="button"
        className="quest-toggle"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <div className="quest-head">
          <span className="quest-emoji">{q.emoji}</span>
          <div className="quest-head-text">
            <div className="quest-name">
              {L(q.name)}{' '}
              <span className="tag">{t(KIND_LABEL[q.kind])}</span>
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
        <div className="quest-expanded">
          <div className="quest-trail-block" onClick={(e) => e.stopPropagation()}>
            <div className="quest-trail-label">{t('questTrailPreview')}</div>
            {found >= 2 ? (
              <>
                <p className="quest-trail-hint">{t('questTrailHint')}</p>
                <QuestTrailPreview steps={q.steps} foundIds={done} />
                <Link className="btn secondary quest-show-trail" to={`/atlas?quest=${q.id}`}>
                  🗺️ {t('questShowTrail')}
                </Link>
              </>
            ) : (
              <p className="quest-trail-hint">{t('questTrailLocked')}</p>
            )}
          </div>
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
        </div>
      )}
    </div>
  );
}

export default function Quests() {
  const { t } = useT();
  const completedQuests = useProgress((s) => s.completedQuests);
  const xp = useProgress((s) => s.xp);
  const [tier, setTier] = useState<QuestTier>('beginner');
  const [openId, setOpenId] = useState<string | null>(null);

  const unlocked = questTierUnlocked(tier, completedQuests, xp);
  const list = QUESTS_BY_TIER[tier];
  const prev = PREV_TIER[tier];

  return (
    <div className="page">
      <h1 className="page-title">🛤️ {t('questsTitle')}</h1>
      <p className="page-subtitle">{t('questsSubtitle')}</p>

      <div className="chip-row profile-tabs quest-tier-tabs" style={{ marginBottom: 12 }}>
        {QUEST_TIERS.map((tId) => {
          const tierOpen = questTierUnlocked(tId, completedQuests, xp);
          return (
            <button
              key={tId}
              type="button"
              className={`chip ${tier === tId ? 'active' : ''}`}
              onClick={() => {
                setTier(tId);
                setOpenId(null);
              }}
            >
              {t(TIER_LABEL[tId])}
              {!tierOpen && ' 🔒'}
            </button>
          );
        })}
      </div>

      {!unlocked ? (
        <div className="card quest-tier-locked">
          <p>
            {t('questTierLocked').replace(
              '{tier}',
              prev ? t(TIER_LABEL[prev]) : t(TIER_LABEL.beginner),
            )}
          </p>
          <ul className="quest-tier-locked-names">
            {list.map((q) => (
              <li key={q.id}>
                <span aria-hidden>{q.emoji}</span> <LockedQuestName quest={q} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="quest-list">
          {list.map((q) => (
            <QuestCard
              key={q.id}
              q={q}
              expanded={openId === q.id}
              onToggle={() => setOpenId(openId === q.id ? null : q.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LockedQuestName({ quest }: { quest: QuestDef }) {
  const { L } = useT();
  return <span>{L(quest.name)}</span>;
}
