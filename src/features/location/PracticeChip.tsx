import { useT } from '../../i18n/useT';
import { VIRTUE_BY_ID } from '../../data/virtues';
import type { AtlasLocation } from '../../data/types';
import { useProgress } from '../../state/store';
import { useSettings } from '../../state/settingsStore';

/** Optional virtue practice — also ticks the place on the Virtue Compass. */
export default function PracticeChip({ location }: { location: AtlasLocation }) {
  const { t, L } = useT();
  const existing = useProgress((s) => s.practices?.[location.id]);
  const acceptPractice = useProgress((s) => s.acceptPractice);
  const younger = useSettings((s) => s.youngerExplorer);

  const virtue = VIRTUE_BY_ID[location.virtues[0]];
  if (!virtue) return null;

  const prompt = L(younger ? virtue.practiceYoung : virtue.practice);

  if (existing) {
    const shown = VIRTUE_BY_ID[existing.virtue] ?? virtue;
    return (
      <div className="section">
        <h2>🌱 {t('practiceYours')}</h2>
        <div className="practice-saved">
          <div className="reflection-q">
            {shown.emoji} {L(younger ? shown.practiceYoung : shown.practice)}
          </div>
          <p className="feature-sub" style={{ margin: 0 }}>
            ✓ {t('practiceDone')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <h2>🌱 {t('practiceTitle')}</h2>
      <div className="practice-card">
        <p className="reflection-intro">{t('practiceIntro')}</p>
        <div className="reflection-q">
          {virtue.emoji} {prompt}
        </div>
        <button type="button" className="btn" onClick={() => acceptPractice(location.id, virtue.id)}>
          🌱 {t('practiceAccept')}
        </button>
      </div>
    </div>
  );
}
