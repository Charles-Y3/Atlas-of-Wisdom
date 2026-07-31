import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/useT';
import { COLLECTIONS } from '../../data/collections';
import { LOCATIONS, LOCATION_BY_ID } from '../../data/locations';
import { CATEGORY_BY_ID } from '../../data/categories';
import { LEGENDS } from '../../data/legends';
import { LEGEND_COLLECTION, isLegendCollectionComplete } from '../../data/legendCollection';
import { illustrationCandidates } from '../../data/illustrations';
import { livedPlaceIds, useProgress } from '../../state/store';
import type { CollectionDef } from '../../data/types';
import type { UiKey } from '../../i18n/strings';
import ScrollHintRow from '../../components/ScrollHintRow';

type Tab = CollectionDef['kind'] | 'legends' | 'gallery';

const TABS: { kind: Tab; labelKey: UiKey; emoji: string }[] = [
  { kind: 'places', labelKey: 'collectionTabPlaces', emoji: '🗺️' },
  { kind: 'virtues', labelKey: 'collectionTabVirtues', emoji: '🧭' },
  { kind: 'legends', labelKey: 'atlasLegends', emoji: '📜' },
  { kind: 'gallery', labelKey: 'collectionTabGallery', emoji: '🖼️' },
];

function PlateThumb({
  locationId,
  illustration,
  emoji,
  name,
  onOpen,
}: {
  locationId: string;
  illustration?: string;
  emoji: string;
  name: string;
  onOpen: () => void;
}) {
  const [srcIdx, setSrcIdx] = useState(0);
  const [failed, setFailed] = useState(false);
  const srcs = illustrationCandidates(locationId, illustration);
  const src = !failed ? srcs[srcIdx] : undefined;

  return (
    <button type="button" className="plate-card" title={name} onClick={onOpen}>
      {src ? (
        <img
          className="plate-card-img"
          src={src}
          alt=""
          onError={() => {
            if (srcIdx + 1 < srcs.length) setSrcIdx((i) => i + 1);
            else setFailed(true);
          }}
        />
      ) : (
        <div className="plate-card-fallback" aria-hidden>
          {emoji}
        </div>
      )}
      <span className="plate-card-name">
        {emoji} {name}
      </span>
    </button>
  );
}

function PlateLightbox({
  locationId,
  onClose,
}: {
  locationId: string;
  onClose: () => void;
}) {
  const { t, L } = useT();
  const loc = LOCATION_BY_ID[locationId];
  const [srcIdx, setSrcIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!loc) return null;

  const emoji = CATEGORY_BY_ID[loc.category].emoji;
  const srcs = illustrationCandidates(loc.id, loc.illustration);
  const src = !failed ? srcs[srcIdx] : undefined;

  return (
    <div className="plate-lightbox" role="dialog" aria-label={L(loc.name)} onClick={onClose}>
      <div className="plate-lightbox-actions" onClick={(e) => e.stopPropagation()}>
        <Link
          to={`/location/${loc.id}`}
          className="plate-lightbox-icon"
          title={t('atlasOpenLocation')}
          aria-label={t('atlasOpenLocation')}
        >
          📖
        </Link>
        <Link
          to={`/atlas?focus=${loc.id}`}
          className="plate-lightbox-icon"
          title={t('locShowOnMap')}
          aria-label={t('locShowOnMap')}
        >
          🗺️
        </Link>
      </div>
      <button
        type="button"
        className="plate-lightbox-art"
        onClick={onClose}
        aria-label={t('close')}
      >
        {src ? (
          <img
            src={src}
            alt={L(loc.name)}
            onError={() => {
              if (srcIdx + 1 < srcs.length) setSrcIdx((i) => i + 1);
              else setFailed(true);
            }}
          />
        ) : (
          <div className="plate-lightbox-fallback">
            <span>{emoji}</span>
            <span>{L(loc.name)}</span>
          </div>
        )}
      </button>
      <p className="plate-lightbox-caption">
        {emoji} {L(loc.name)}
      </p>
    </div>
  );
}

export default function Collection() {
  const { t, L } = useT();
  const visited = useProgress((s) => s.visited);
  const reflections = useProgress((s) => s.reflections);
  const practices = useProgress((s) => s.practices);
  const exploredLegends = useProgress((s) => s.exploredLegends);
  const visitedIds = new Set(Object.keys(visited));
  const livedIds = livedPlaceIds(reflections, practices);
  const exploredIds = new Set(Object.keys(exploredLegends ?? {}));
  const [tab, setTab] = useState<Tab>('places');
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  const sealedPlates = useMemo(
    () =>
      LOCATIONS.filter((l) => visited[l.id]).sort((a, b) =>
        L(a.name).localeCompare(L(b.name)),
      ),
    [visited, L],
  );

  const subtitle =
    tab === 'virtues'
      ? t('collectionSubtitleVirtues')
      : tab === 'legends'
        ? L(LEGEND_COLLECTION.description)
        : tab === 'gallery'
          ? t('collectionSubtitleGallery')
          : t('collectionSubtitle');

  const legendsGot = LEGENDS.filter((m) => exploredIds.has(m.id));
  const legendsComplete = isLegendCollectionComplete(exploredIds);

  return (
    <div className="page">
      <h1 className="page-title">🗃️ {t('collectionTitle')}</h1>
      <p className="page-subtitle">{subtitle}</p>

      <div style={{ marginBottom: 4 }}>
        <ScrollHintRow>
          {TABS.map((tabDef) => (
            <button
              key={tabDef.kind}
              type="button"
              className={`chip ${tab === tabDef.kind ? 'active' : ''}`}
              onClick={() => setTab(tabDef.kind)}
            >
              {tabDef.emoji} {t(tabDef.labelKey)}
            </button>
          ))}
        </ScrollHintRow>
      </div>

      <div className="coll-list">
        {tab === 'gallery' ? (
          sealedPlates.length === 0 ? (
            <p className="page-subtitle">{t('collectionGalleryEmpty')}</p>
          ) : (
            <div className="plate-gallery">
              {sealedPlates.map((loc) => (
                <PlateThumb
                  key={loc.id}
                  locationId={loc.id}
                  illustration={loc.illustration}
                  emoji={CATEGORY_BY_ID[loc.category].emoji}
                  name={L(loc.name)}
                  onOpen={() => setLightboxId(loc.id)}
                />
              ))}
            </div>
          )
        ) : tab === 'legends' ? (
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
            {!legendsComplete && (
              <p className="nudge-line">
                {t('collectionNudge').replace(
                  '{n}',
                  String(LEGEND_COLLECTION.totalCount - legendsGot.length),
                )}
              </p>
            )}
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
            const earned = c.kind === 'virtues' ? livedIds : visitedIds;
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
                {!complete && (
                  <p className="nudge-line">
                    {t('collectionNudge').replace('{n}', String(members.length - got.length))}
                  </p>
                )}
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

      {lightboxId && <PlateLightbox locationId={lightboxId} onClose={() => setLightboxId(null)} />}
    </div>
  );
}
