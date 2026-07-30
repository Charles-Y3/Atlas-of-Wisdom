import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/useT';
import { COLLECTIONS } from '../../data/collections';
import { LOCATIONS } from '../../data/locations';
import { CATEGORY_BY_ID } from '../../data/categories';
import { LEGENDS } from '../../data/legends';
import { LEGEND_COLLECTION, isLegendCollectionComplete } from '../../data/legendCollection';
import { useProgress } from '../../state/store';
import type { CollectionDef } from '../../data/types';

type Tab = CollectionDef['kind'] | 'legends';

const TABS: { kind: Tab; labelKey: 'collectionTabPlaces' | 'collectionTabVirtues' | 'atlasLegends'; emoji: string }[] = [
  { kind: 'places', labelKey: 'collectionTabPlaces', emoji: '🗺️' },
  { kind: 'virtues', labelKey: 'collectionTabVirtues', emoji: '🧭' },
  { kind: 'legends', labelKey: 'atlasLegends', emoji: '📜' },
];

export default function Collection() {
  const { t, L } = useT();
  const visited = useProgress((s) => s.visited);
  const read = useProgress((s) => s.read);
  const exploredLegends = useProgress((s) => s.exploredLegends);
  const visitedIds = new Set(Object.keys(visited));
  const readIds = new Set(Object.keys(read));
  const exploredIds = new Set(Object.keys(exploredLegends ?? {}));
  const [tab, setTab] = useState<Tab>('places');

  const subtitle =
    tab === 'virtues'
      ? t('collectionSubtitleVirtues')
      : tab === 'legends'
        ? L(LEGEND_COLLECTION.description)
        : t('collectionSubtitle');

  const legendsGot = LEGENDS.filter((m) => exploredIds.has(m.id));
  const legendsComplete = isLegendCollectionComplete(exploredIds);

  return (
    <div className="page">
      <h1 className="page-title">🗃️ {t('collectionTitle')}</h1>
      <p className="page-subtitle">{subtitle}</p>

      <div className="chip-row" style={{ marginBottom: 4 }}>
        {TABS.map((tabDef) => (
          <button
            key={tabDef.kind}
            className={`chip ${tab === tabDef.kind ? 'active' : ''}`}
            onClick={() => setTab(tabDef.kind)}
          >
            {tabDef.emoji} {t(tabDef.labelKey)}
          </button>
        ))}
      </div>

      <div className="coll-list">
        {tab === 'legends' ? (
          <div key={LEGEND_COLLECTION.id} className="card">
            <div className="coll-head">
              <span className="coll-emoji">{LEGEND_COLLECTION.emoji}</span>
              <div>
                <div className="coll-name">
                  {L(LEGEND_COLLECTION.name)}{' '}
                  {legendsComplete && <span className="tag gold">✓ {t('collectionComplete')}</span>}
                </div>
              </div>
            </div>
            <p className="coll-desc">{L(LEGEND_COLLECTION.description)}</p>
            <div className="progress">
              <div
                style={{
                  width: `${LEGEND_COLLECTION.totalCount ? (legendsGot.length / LEGEND_COLLECTION.totalCount) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="progress-label">
              {legendsGot.length} / {LEGEND_COLLECTION.totalCount} {t('collectionProgress')}
            </div>
            <div className="coll-members">
              {LEGENDS.map((m) =>
                exploredIds.has(m.id) ? (
                  <Link
                    key={m.id}
                    to={`/legend/${m.id}`}
                    className="tag"
                    style={{ textDecoration: 'none' }}
                    title={L(m.name)}
                  >
                    {m.emoji} {L(m.name)}
                  </Link>
                ) : (
                  <span key={m.id} className="member-dot" title="?" />
                ),
              )}
            </div>
          </div>
        ) : (
          COLLECTIONS.filter((c) => c.kind === tab).map((c) => {
            const members = LOCATIONS.filter(c.match);
            if (members.length === 0) return null;
            const earned = c.kind === 'virtues' ? readIds : visitedIds;
            const got = members.filter((m) => earned.has(m.id));
            const complete = got.length === members.length;
            return (
              <div key={c.id} className="card">
                <div className="coll-head">
                  <span className="coll-emoji">{c.emoji}</span>
                  <div>
                    <div className="coll-name">
                      {L(c.name)} {complete && <span className="tag gold">✓ {t('collectionComplete')}</span>}
                    </div>
                  </div>
                </div>
                <p className="coll-desc">{L(c.description)}</p>
                <div className="progress">
                  <div style={{ width: `${(got.length / members.length) * 100}%` }} />
                </div>
                <div className="progress-label">
                  {got.length} / {members.length} {t('collectionProgress')}
                </div>
                <div className="coll-members">
                  {members.map((m) =>
                    earned.has(m.id) ? (
                      <Link
                        key={m.id}
                        to={`/location/${m.id}`}
                        className="tag"
                        style={{ textDecoration: 'none' }}
                        title={L(m.name)}
                      >
                        {CATEGORY_BY_ID[m.category].emoji} {L(m.name)}
                      </Link>
                    ) : (
                      <span key={m.id} className="member-dot" title="?" />
                    ),
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
