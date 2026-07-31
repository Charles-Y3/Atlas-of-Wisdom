import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GlobeMap, { type QuestTrailStop } from '../../components/map/GlobeMap';
import ScrollHintRow from '../../components/ScrollHintRow';
import { useT } from '../../i18n/useT';
import { CATEGORIES, CATEGORY_BY_ID, TRADITION_BY_ID } from '../../data/categories';
import { LOCATION_BY_ID } from '../../data/locations';
import { LEGENDS, LEGEND_BY_ID } from '../../data/legends';
import { QUEST_BY_ID, isQuestUnlocked } from '../../data/quests';
import { useProgress, legendsUnlocked } from '../../state/store';
import type { CategoryId } from '../../data/types';

export default function Atlas() {
  const { t, L, locale } = useT();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState<CategoryId | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedLegendId, setSelectedLegendId] = useState<string | null>(null);
  const [styleMode, setStyleMode] = useState<'offline' | 'online'>('offline');
  const progress = useProgress();
  const visited = progress.visited;
  const unlocked = legendsUnlocked(progress);
  const legendsMode = params.get('legends') === '1' && unlocked;
  const questId = params.get('quest');
  const questCandidate = questId ? QUEST_BY_ID[questId] : undefined;
  const quest =
    questCandidate && isQuestUnlocked(questCandidate.id, progress.completedQuests)
      ? questCandidate
      : undefined;

  const visitedIds = useMemo(() => new Set(Object.keys(visited)), [visited]);
  /** Clue answers only — sealed visits never add a trail stop. */
  const foundSteps = useMemo(
    () => new Set(quest ? progress.questProgress?.[quest.id]?.completedSteps ?? [] : []),
    [quest, progress.questProgress],
  );

  /** Trail from correctly named clues only (≥2). Visited pins are ignored. */
  const questTrail = useMemo((): QuestTrailStop[] | null => {
    if (!quest || legendsMode) return null;
    const stops = quest.steps
      .map((s, i) => {
        if (!foundSteps.has(s.id)) return null;
        const loc = LOCATION_BY_ID[s.id];
        if (!loc) return null;
        return {
          id: s.id,
          coords: loc.coords,
          found: true,
          index: i + 1,
        };
      })
      .filter((s): s is QuestTrailStop => Boolean(s));
    return stops.length >= 2 ? stops : null;
  }, [quest, foundSteps, legendsMode]);

  const focusId = params.get('focus');
  const focus = useMemo(() => {
    if (legendsMode && selectedLegendId) {
      const leg = LEGEND_BY_ID[selectedLegendId];
      const c = leg?.claimedLocations[0];
      return c ? { center: c.coords, zoom: 3.5 } : null;
    }
    const loc = focusId ? LOCATION_BY_ID[focusId] : null;
    return loc ? { center: loc.coords, zoom: 5.5 } : null;
  }, [focusId, legendsMode, selectedLegendId]);

  const selected = selectedId ? LOCATION_BY_ID[selectedId] : null;
  const selectedLegend = selectedLegendId ? LEGEND_BY_ID[selectedLegendId] : null;

  function toggleLegends() {
    if (!unlocked) return;
    const next = new URLSearchParams(params);
    if (legendsMode) next.delete('legends');
    else {
      next.set('legends', '1');
      next.delete('quest');
    }
    setParams(next, { replace: true });
    setSelectedId(null);
    setSelectedLegendId(null);
  }

  function clearQuestTrail() {
    const next = new URLSearchParams(params);
    next.delete('quest');
    setParams(next, { replace: true });
  }

  return (
    <div className={`map-page ${legendsMode ? 'legends-mode' : ''}`}>
      <GlobeMap
        locale={locale}
        filterCategory={legendsMode ? null : filter}
        visitedIds={visitedIds}
        onSelect={(id) => {
          if (legendsMode) setSelectedLegendId(id);
          else setSelectedId(id);
        }}
        focus={focus}
        onStyleModeChange={setStyleMode}
        legendsMode={legendsMode}
        questTrail={questTrail}
      />

      <div className="map-chips">
        <ScrollHintRow>
          {!legendsMode && (
            <>
              <button className={`chip ${filter === null ? 'active' : ''}`} onClick={() => setFilter(null)}>
                🌍 {t('atlasAll')}
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className={`chip ${filter === c.id ? 'active' : ''}`}
                  onClick={() => setFilter(filter === c.id ? null : c.id)}
                >
                  {c.emoji} {L(c.name)}
                </button>
              ))}
            </>
          )}
          <button
            className={`chip ${legendsMode ? 'active' : ''} ${unlocked ? '' : 'dim'}`}
            onClick={toggleLegends}
            title={unlocked ? t('atlasLegendsHint') : t('atlasLegendsLocked')}
          >
            📜 {t('atlasLegends')}
            {!unlocked && ' 🔒'}
          </button>
        </ScrollHintRow>
        {quest && !legendsMode && questTrail && (
          <div className="map-quest-banner">
            <span>
              🛤️ {t('atlasQuestTrail')}: {L(quest.name)}
            </span>
            <button type="button" className="btn subtle" onClick={clearQuestTrail}>
              {t('atlasClearQuestTrail')}
            </button>
          </div>
        )}
        {legendsMode && <p className="map-legends-hint">{t('atlasLegendsHint')}</p>}
        {!unlocked && <p className="map-legends-hint">{t('atlasLegendsLocked')}</p>}
      </div>

      <div className="map-attrib">
        {t(styleMode === 'online' ? 'atlasAttributionOnline' : 'atlasAttribution')}
      </div>

      {selected && !legendsMode && (
        <div className="sheet reveal">
          <button className="sheet-close" onClick={() => setSelectedId(null)} aria-label={t('close')}>
            ✕
          </button>
          <h2>{L(selected.name)}</h2>
          <div className="meta-row">
            <span className="tag">
              {CATEGORY_BY_ID[selected.category].emoji} {L(CATEGORY_BY_ID[selected.category].name)}
            </span>
            {selected.traditions.map((tr) => (
              <span key={tr} className="tag">
                {TRADITION_BY_ID[tr].emoji} {L(TRADITION_BY_ID[tr].name)}
              </span>
            ))}
            {selected.unesco && <span className="tag gold">🏵️ UNESCO</span>}
            {visitedIds.has(selected.id) ? (
              <span className="tag visited">✓ {t('atlasVisited')}</span>
            ) : (
              <span className="tag">{t('atlasNotVisited')}</span>
            )}
          </div>
          <p style={{ fontSize: 14, margin: '4px 0 12px' }}>
            {L(selected.country)} · {L(selected.region)}
          </p>
          <button className="btn" onClick={() => navigate(`/location/${selected.id}`)}>
            {t('atlasOpenLocation')} →
          </button>
        </div>
      )}

      {selectedLegend && legendsMode && (
        <div className="sheet reveal">
          <button className="sheet-close" onClick={() => setSelectedLegendId(null)} aria-label={t('close')}>
            ✕
          </button>
          <h2>
            {selectedLegend.emoji} {L(selectedLegend.name)}
          </h2>
          <p className="legend-banner" style={{ margin: '8px 0 12px' }}>
            {t('legendBanner')}
          </p>
          <p style={{ fontSize: 14, margin: '4px 0 12px' }}>
            {selectedLegend.claimedLocations.length} {t('legendClaimedSites').toLowerCase()}
            {' · '}
            {LEGENDS.length} total
          </p>
          <button className="btn" onClick={() => navigate(`/legend/${selectedLegend.id}`)}>
            {t('legendExplore')} →
          </button>
        </div>
      )}
    </div>
  );
}
