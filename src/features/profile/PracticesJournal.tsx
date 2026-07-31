import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/useT';
import { VIRTUES, type VirtueId } from '../../data/virtues';
import { LOCATION_BY_ID } from '../../data/locations';
import { useProgress } from '../../state/store';
import { useSettings } from '../../state/settingsStore';
import ScrollHintRow from '../../components/ScrollHintRow';

export default function PracticesJournal() {
  const { t, L } = useT();
  const practices = useProgress((s) => s.practices);
  const younger = useSettings((s) => s.youngerExplorer);
  const [filter, setFilter] = useState<VirtueId | 'all'>('all');

  const entries = useMemo(() => {
    const rows = Object.entries(practices ?? {}).map(([locId, p]) => ({
      locId,
      ...p,
      nameEn: LOCATION_BY_ID[locId]?.name.en ?? locId,
    }));
    rows.sort((a, b) => {
      if (a.day !== b.day) return a.day < b.day ? 1 : -1;
      return a.nameEn.localeCompare(b.nameEn);
    });
    if (filter === 'all') return rows;
    return rows.filter((r) => r.virtue === filter);
  }, [practices, filter]);

  return (
    <div className="section" style={{ marginTop: 0 }}>
      <h2>🌱 {t('practiceJournalTitle')}</h2>
      {Object.keys(practices ?? {}).length === 0 ? (
        <p className="page-subtitle">{t('practiceJournalEmpty')}</p>
      ) : (
        <>
          <div style={{ marginBottom: 10 }}>
            <ScrollHintRow>
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
            </ScrollHintRow>
          </div>
          <div className="journal-list">
            {entries.map((e) => {
              const loc = LOCATION_BY_ID[e.locId];
              const virtue = VIRTUES.find((v) => v.id === e.virtue);
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
                  {virtue && (
                    <p className="journal-text">
                      {L(younger ? virtue.practiceYoung : virtue.practice)}
                    </p>
                  )}
                </div>
              );
            })}
            {entries.length === 0 && (
              <p className="page-subtitle">{t('practiceJournalEmpty')}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
