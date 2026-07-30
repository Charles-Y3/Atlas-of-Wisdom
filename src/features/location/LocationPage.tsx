import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useT } from '../../i18n/useT';
import { LOCATION_BY_ID } from '../../data/locations';
import { PERSON_BY_ID } from '../../data/people';
import { CATEGORY_BY_ID, TRADITION_BY_ID } from '../../data/categories';
import { VIRTUE_BY_ID } from '../../data/virtues';
import { LOCATION_TEACHINGS, PERSON_TEACHINGS } from '../../data/teachings';
import { illustrationCandidates } from '../../data/illustrations';
import { formatYear } from '../../data/types';
import { useProgress } from '../../state/store';
import { useSettings } from '../../state/settingsStore';
import ReflectionCard from './ReflectionCard';

export default function LocationPage() {
  const { id } = useParams<{ id: string }>();
  const { t, L, locale } = useT();
  const navigate = useNavigate();
  const visitLocation = useProgress((s) => s.visitLocation);
  const markRead = useProgress((s) => s.markRead);
  const isRead = useProgress((s) => Boolean(id && s.read[id]));
  const younger = useSettings((s) => s.youngerExplorer);
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);
  const [imgIdx, setImgIdx] = useState(0);

  const loc = id ? LOCATION_BY_ID[id] : undefined;
  const teaching = id ? LOCATION_TEACHINGS[id] : undefined;
  const imgSrcs = loc ? illustrationCandidates(loc.id, loc.illustration) : [];
  const imgSrc = imgSrcs[imgIdx];

  useEffect(() => {
    if (loc) visitLocation(loc.id);
  }, [loc, visitLocation]);

  useEffect(() => {
    setImgIdx(0);
  }, [loc?.id]);

  if (!loc) {
    return (
      <div className="page">
        <p>Not found.</p>
        <Link to="/atlas" className="btn secondary">{t('back')}</Link>
      </div>
    );
  }

  const category = CATEGORY_BY_ID[loc.category];
  const periodLabel = loc.period.toYear
    ? `${formatYear(loc.period.fromYear, locale)} – ${formatYear(loc.period.toYear, locale)}`
    : `${formatYear(loc.period.fromYear, locale)} –`;

  return (
    <div>
      <div className={`loc-hero ${imgSrc ? 'has-illustration' : ''}`}>
        {imgSrc && (
          <img
            className="loc-hero-art"
            src={imgSrc}
            alt=""
            onError={() => setImgIdx((i) => i + 1)}
          />
        )}
        <div className="loc-hero-inner">
          <button className="btn subtle" style={{ padding: '6px 14px', marginBottom: 12 }} onClick={() => navigate(-1)}>
            ← {t('back')}
          </button>
          <div className="loc-hero-emoji">{category.emoji}</div>
          <h1>{L(loc.name)}</h1>
          <div className="loc-sub">
            {L(loc.country)} · {L(loc.region)}
          </div>
          <div className="meta-row">
            <span className="tag">{category.emoji} {L(category.name)}</span>
            {loc.traditions.map((tr) => (
              <span key={tr} className="tag">
                {TRADITION_BY_ID[tr].emoji} {L(TRADITION_BY_ID[tr].name)}
              </span>
            ))}
            {loc.unesco && (
              <span className="tag gold">
                🏵️ {t('locUnesco')} · {t('locUnescoSince')} {loc.unesco.year}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="page">
        <div className="section" style={{ marginTop: 6 }}>
          <h2>{t('locOverview')}</h2>
          <div className="fact-grid">
            <div className="fact">
              <div className="fact-label">{t('locPeriod')}</div>
              <div className="fact-value">{periodLabel}</div>
            </div>
            <div className="fact">
              <div className="fact-label">{t('locStatus')}</div>
              <div className="fact-value">{L(loc.status)}</div>
            </div>
            <div className="fact">
              <div className="fact-label">{t('locCountry')}</div>
              <div className="fact-value">{L(loc.country)}</div>
            </div>
            <div className="fact">
              <div className="fact-label">{t('locCoordinates')}</div>
              <div className="fact-value">
                {loc.coords[1].toFixed(2)}°, {loc.coords[0].toFixed(2)}°
              </div>
            </div>
          </div>
        </div>

        <div className="section story">
          <h2>{t('locWhyItMatters')}</h2>
          {(younger ? L(loc.whyItMatters).slice(0, 1) : L(loc.whyItMatters)).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {teaching && (
          <div className="section teaching-block">
            <h2>{t('locTeaching')}</h2>
            <blockquote className="teaching-quote">
              <p>{L(teaching.text)}</p>
              <footer>— {L(teaching.attribution)}</footer>
            </blockquote>
          </div>
        )}

        <div className="section">
          <h2>{t('locTimeline')}</h2>
          <div className="timeline">
            {loc.timeline.map((e, i) => (
              <div className="tl-item" key={i}>
                <div className="tl-year">{formatYear(e.year, locale)}</div>
                <div className="tl-event">{L(e.event)}</div>
              </div>
            ))}
          </div>
        </div>

        {loc.connectedPeople.length > 0 && (
          <div className="section">
            <h2>{t('locConnectedPeople')}</h2>
            <div className="people-row">
              {loc.connectedPeople.map((pid) => {
                const person = PERSON_BY_ID[pid];
                if (!person) return null;
                const open = expandedPerson === pid;
                const personTeaching = PERSON_TEACHINGS[pid];
                return (
                  <div key={pid} className="card" style={{ padding: 12 }}>
                    <button
                      onClick={() => setExpandedPerson(open ? null : pid)}
                      style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}
                    >
                      <span className="result-emoji">{person.emoji}</span>
                      <span>
                        <span className="result-name">{L(person.name)}</span>
                        <span className="result-sub" style={{ display: 'block' }}>{L(person.dates)}</span>
                      </span>
                      <span style={{ marginLeft: 'auto', color: 'var(--ink-soft)' }}>{open ? '▾' : '▸'}</span>
                    </button>
                    {open && (
                      <div className="reveal" style={{ marginTop: 10, fontSize: 14.5 }}>
                        <p style={{ margin: 0 }}>{L(person.bio)}</p>
                        {personTeaching && (
                          <blockquote className="teaching-quote compact">
                            <p>{L(personTeaching.text)}</p>
                            <footer>— {L(personTeaching.attribution)}</footer>
                          </blockquote>
                        )}
                        {person.locations.filter((l) => l !== loc.id).length > 0 && (
                          <div className="meta-row" style={{ marginTop: 8 }}>
                            <span className="result-sub">{t('personPlaces')}:</span>
                            {person.locations
                              .filter((l) => l !== loc.id && LOCATION_BY_ID[l])
                              .map((l) => (
                                <Link key={l} to={`/location/${l}`} className="tag" style={{ textDecoration: 'none' }}>
                                  {CATEGORY_BY_ID[LOCATION_BY_ID[l].category].emoji} {L(LOCATION_BY_ID[l].name)}
                                </Link>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="section">
          <h2>{t('locVirtues')}</h2>
          <div className="virtue-row">
            {loc.virtues.map((vid) => {
              const v = VIRTUE_BY_ID[vid];
              return (
                <div key={vid} className="virtue-chip">
                  <span className="virtue-emoji">{v.emoji}</span>
                  <span>
                    <span className="virtue-name">{L(v.name)}</span>
                    <span className="virtue-blurb">{L(v.blurb)}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {loc.funFact && (
          <div className="section">
            <h2>{t('locFunFact')}</h2>
            <div className="funfact">💡 {L(loc.funFact)}</div>
          </div>
        )}

        {isRead && <ReflectionCard location={loc} />}

        <div className="section" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {isRead ? (
            <span className="tag visited" style={{ alignSelf: 'flex-start' }}>✓ {t('locReadDone')}</span>
          ) : (
            <button className="btn" onClick={() => markRead(loc.id)}>
              📖 {t('locMarkRead')}
            </button>
          )}
          <Link className="btn secondary" to={`/atlas?focus=${loc.id}`}>
            🗺️ {t('locShowOnMap')}
          </Link>
          {loc.wikipedia && (
            <a
              className="btn subtle"
              href={`https://en.wikipedia.org/wiki/${loc.wikipedia}`}
              target="_blank"
              rel="noreferrer"
            >
              {t('locLearnMore')} ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
