import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/useT';
import { VIRTUES, type VirtueId } from '../../data/virtues';
import { LOCATION_BY_ID } from '../../data/locations';
import { useProgress } from '../../state/store';

const TRUNCATE = 120;

export default function ReflectionsJournal() {
  const { t, L } = useT();
  const reflections = useProgress((s) => s.reflections);
  const [filter, setFilter] = useState<VirtueId | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const entries = useMemo(() => {
    const rows = Object.entries(reflections ?? {}).map(([locId, r]) => ({
      locId,
      ...r,
      nameEn: LOCATION_BY_ID[locId]?.name.en ?? locId,
    }));
    rows.sort((a, b) => {
      if (a.day !== b.day) return a.day < b.day ? 1 : -1;
      return a.nameEn.localeCompare(b.nameEn);
    });
    if (filter === 'all') return rows;
    return rows.filter((r) => r.virtue === filter);
  }, [reflections, filter]);

  return (
    <div className="section">
      <h2>🪞 {t('journalTitle')}</h2>
      {Object.keys(reflections ?? {}).length === 0 ? (
        <p className="page-subtitle">{t('journalEmpty')}</p>
      ) : (
        <>
          <div className="chip-row" style={{ marginBottom: 10 }}>
            <button
              type="button"
              className={`chip ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              {t('journalAllVirtues')}
            </button>
            {VIRTUES.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`chip ${filter === v.id ? 'active' : ''}`}
                onClick={() => setFilter(v.id)}
              >
                {v.emoji} {L(v.name)}
              </button>
            ))}
          </div>
          <div className="journal-list">
            {entries.map((e) => {
              const loc = LOCATION_BY_ID[e.locId];
              const virtue = VIRTUES.find((v) => v.id === e.virtue);
              const open = expanded === e.locId;
              const long = e.text.length > TRUNCATE;
              const shown = open || !long ? e.text : `${e.text.slice(0, TRUNCATE).trim()}…`;
              return (
                <div key={e.locId} className="journal-row">
                  <div className="journal-meta">
                    <Link to={`/location/${e.locId}`} className="journal-place">
                      {loc ? L(loc.name) : e.locId}
                    </Link>
                    <span className="journal-virtue">
                      {virtue ? `${virtue.emoji} ${L(virtue.name)}` : e.virtue}
                    </span>
                    <span className="journal-day">{e.day}</span>
                  </div>
                  <p className="journal-text">{shown}</p>
                  {long && (
                    <button
                      type="button"
                      className="btn subtle journal-toggle"
                      onClick={() => setExpanded(open ? null : e.locId)}
                    >
                      {open ? t('journalCollapse') : t('journalExpand')}
                    </button>
                  )}
                </div>
              );
            })}
            {entries.length === 0 && (
              <p className="page-subtitle">{t('journalEmpty')}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
