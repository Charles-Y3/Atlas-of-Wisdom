import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlobeMap from '../../components/map/GlobeMap';
import { useT } from '../../i18n/useT';
import { LOCATIONS, LOCATION_BY_ID } from '../../data/locations';
import { PEOPLE } from '../../data/people';
import { CATEGORY_BY_ID, TRADITION_BY_ID } from '../../data/categories';
import { LOCATION_TEACHINGS } from '../../data/teachings';
import { unlockedQuests } from '../../data/quests';
import { formatYear } from '../../data/types';
import { monthKey, onThisDayPick, pickIndex, todayKey } from '../../engine/daily';
import { useProgress, statsOf } from '../../state/store';
import { rankForXp, xpUnlocks } from '../../engine/progression';
import DailyQuiz from './DailyQuiz';
import StreakRitual from '../profile/StreakRitual';
import RankLadder from '../profile/RankLadder';

export default function Home() {
  const { t, L, locale } = useT();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [rankOpen, setRankOpen] = useState(false);
  const progress = useProgress();
  const stats = statsOf(progress);
  const rank = rankForXp(progress.xp);
  const completedQuests = progress.completedQuests;

  const daily = useMemo(() => {
    const idx = pickIndex(`discovery:${todayKey()}`, LOCATIONS.length);
    return LOCATIONS[idx];
  }, []);

  const teachingIds = useMemo(() => Object.keys(LOCATION_TEACHINGS), []);
  const dailyTeaching = useMemo(() => {
    const idx = pickIndex(`teaching:${todayKey()}`, teachingIds.length);
    const id = teachingIds[idx];
    return { id, teaching: LOCATION_TEACHINGS[id], loc: LOCATION_BY_ID[id] };
  }, [teachingIds]);

  const onThisDay = useMemo(() => {
    const corpus = LOCATIONS.flatMap((l) =>
      l.timeline.map((e, eventIndex) => ({ locId: l.id, year: e.year, eventIndex })),
    );
    const pick = onThisDayPick(corpus);
    if (!pick) return null;
    const loc = LOCATION_BY_ID[pick.locId];
    const event = loc?.timeline[pick.eventIndex];
    if (!loc || !event) return null;
    return { loc, year: pick.year, event };
  }, []);

  const questOfMonth = useMemo(() => {
    const pool = unlockedQuests(completedQuests, progress.xp);
    if (pool.length === 0) return null;
    const idx = pickIndex(`questMonth:${monthKey()}`, pool.length);
    return pool[idx];
  }, [completedQuests, progress.xp]);

  const showOnThisDay = xpUnlocks(progress.xp, 'onThisDay');
  const showTeachingOfDay = xpUnlocks(progress.xp, 'teachingOfDay');
  const isCartographer = xpUnlocks(progress.xp, 'cartographerPassport');

  const greeting =
    stats.placesExplored === 0
      ? t('homeGreetingFirst')
      : stats.streak >= 3
        ? t('homeGreetingStreak')
        : t('homeGreetingReturn');

  const lastLocation = progress.lastLocationId ? LOCATION_BY_ID[progress.lastLocationId] : null;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return null;
    const places = LOCATIONS.filter((l) => {
      const hay = [
        l.name.en, l.name.zh, l.country.en, l.country.zh, l.region.en, l.region.zh,
        ...l.traditions.flatMap((tr) => [TRADITION_BY_ID[tr].name.en, TRADITION_BY_ID[tr].name.zh]),
      ].join(' ').toLowerCase();
      return hay.includes(q);
    }).slice(0, 6);
    const people = PEOPLE.filter((p) =>
      [p.name.en, p.name.zh].join(' ').toLowerCase().includes(q),
    ).slice(0, 4);
    return { places, people };
  }, [query]);

  const dailyOpened = progress.dailyDiscoveryDay === todayKey();
  const teachingOpened = progress.dailyTeachingDay === todayKey();

  return (
    <div>
      <div className="home-hero">
        <GlobeMap
          locale={locale}
          autoRotate
          interactive
          visitedIds={new Set(Object.keys(progress.visited))}
          onSelect={(id) => navigate(`/location/${id}`)}
        />
        <div className="home-hero-overlay">
          <h1 className="display">{t('appName')}</h1>
          <p>{t('appTagline')}</p>
          <p className="home-greeting">{greeting}</p>
        </div>
      </div>

      <div className="page" style={{ paddingTop: 4 }}>
        <div className="search-box">
          <span>🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('homeSearchPlaceholder')}
          />
        </div>

        {results && (
          <div className="search-results reveal">
            {results.places.length === 0 && results.people.length === 0 && (
              <p className="page-subtitle">{t('homeSearchNoResults')}</p>
            )}
            {results.places.map((l) => (
              <Link key={l.id} to={`/location/${l.id}`} className="result-row">
                <span className="result-emoji">{CATEGORY_BY_ID[l.category].emoji}</span>
                <span>
                  <span className="result-name">{L(l.name)}</span>
                  <span className="result-sub" style={{ display: 'block' }}>
                    {L(l.country)} · {L(CATEGORY_BY_ID[l.category].name)}
                  </span>
                </span>
              </Link>
            ))}
            {results.people.map((p) => {
              const firstPlace = p.locations.find((lid) => LOCATION_BY_ID[lid]);
              return (
                <Link
                  key={p.id}
                  to={firstPlace ? `/location/${firstPlace}` : '/atlas'}
                  className="result-row"
                >
                  <span className="result-emoji">{p.emoji}</span>
                  <span>
                    <span className="result-name">{L(p.name)}</span>
                    <span className="result-sub" style={{ display: 'block' }}>
                      {t('homeSearchPeople')} · {L(p.dates)}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="home-grid">
          <StreakRitual count={stats.streak} />

          <div className="stat-strip">
            <div className="stat-box">
              <div className="stat-num">{stats.placesExplored}</div>
              <div className="stat-label">{t('homeExplored')}</div>
            </div>
            <button
              type="button"
              className={`stat-box stat-box-btn ${isCartographer ? 'stat-box-cartographer' : ''}`}
              onClick={() => setRankOpen(true)}
            >
              <div className="stat-num">{rank.emoji}</div>
              <div className="stat-label">{L(rank.name)}</div>
            </button>
            <div className="stat-box">
              <div className="stat-num">{progress.xp}</div>
              <div className="stat-label">{t('profileXp')}</div>
            </div>
          </div>

          <Link
            to={`/location/${daily.id}`}
            className="card feature-card"
            onClick={() => {
              if (!dailyOpened) progress.openDailyDiscovery(daily.id);
            }}
          >
            <div className="feature-kicker">
              🌅 {t('homeDiscoveryOfDay')} {dailyOpened ? '✓' : ''}
            </div>
            <h3 className="feature-title">
              {CATEGORY_BY_ID[daily.category].emoji} {L(daily.name)}
            </h3>
            <p className="feature-sub">
              {L(daily.country)} · {L(CATEGORY_BY_ID[daily.category].name)}
            </p>
          </Link>

          {showTeachingOfDay && dailyTeaching.teaching && dailyTeaching.loc && (
            <Link
              to={`/location/${dailyTeaching.id}`}
              className="card feature-card teaching-card"
              onClick={() => {
                if (!teachingOpened) progress.openDailyTeaching();
              }}
            >
              <div className="feature-kicker">
                📜 {t('homeTeachingOfDay')} {teachingOpened ? '✓' : ''}
              </div>
              <h3 className="feature-title">{L(dailyTeaching.teaching.text)}</h3>
              <p className="feature-sub">
                — {L(dailyTeaching.teaching.attribution)} · {L(dailyTeaching.loc.name)}
              </p>
              <p className="feature-sub">{t('homeTeachingOfDaySub')}</p>
            </Link>
          )}

          {showOnThisDay && onThisDay && (
            <Link to={`/location/${onThisDay.loc.id}`} className="card feature-card">
              <div className="feature-kicker">📅 {t('homeOnThisDay')}</div>
              <h3 className="feature-title">
                {formatYear(onThisDay.year, locale)} · {L(onThisDay.loc.name)}
              </h3>
              <p className="feature-sub">{L(onThisDay.event.event)}</p>
              <p className="feature-sub">{t('homeOnThisDaySub')}</p>
            </Link>
          )}

          {questOfMonth && (
            <Link to="/quests" className="card feature-card">
              <div className="feature-kicker">🛤️ {t('homeQuestOfMonth')}</div>
              <h3 className="feature-title">
                {questOfMonth.emoji} {L(questOfMonth.name)}
              </h3>
              <p className="feature-sub">{t('homeQuestOfMonthSub')}</p>
            </Link>
          )}

          <DailyQuiz />

          {lastLocation && (
            <Link to={`/location/${lastLocation.id}`} className="card feature-card">
              <div className="feature-kicker">🧭 {t('homeContinue')}</div>
              <h3 className="feature-title">
                {CATEGORY_BY_ID[lastLocation.category].emoji} {L(lastLocation.name)}
              </h3>
              <p className="feature-sub">{L(lastLocation.country)}</p>
            </Link>
          )}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/atlas" className="btn" style={{ flex: 1, minWidth: 120 }}>
              🗺️ {t('homeStartExploring')}
            </Link>
            <Link to="/discover" className="btn secondary" style={{ flex: 1, minWidth: 120 }}>
              🔭 {t('navDiscover')}
            </Link>
            <Link to="/quests" className="btn secondary" style={{ flex: 1, minWidth: 120 }}>
              🛤️ {t('navQuests')}
            </Link>
          </div>
        </div>
      </div>

      <RankLadder xp={progress.xp} open={rankOpen} onClose={() => setRankOpen(false)} />
    </div>
  );
}
