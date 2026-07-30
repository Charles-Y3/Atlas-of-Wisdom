import { useT } from '../../i18n/useT';

/** Parchment streak banner — Home and Profile. */
export default function StreakRitual({ count }: { count: number }) {
  const { t } = useT();
  if (count < 1) return null;

  let milestone = t('streakRitual').replace('{n}', String(count));
  if (count >= 30) milestone = t('streakRitual30');
  else if (count >= 7) milestone = t('streakRitual7');
  else if (count >= 3) milestone = t('streakRitual3');

  return (
    <div className="streak-ritual" role="status">
      <span className="streak-ritual-flame" aria-hidden>
        🔥
      </span>
      <div>
        <div className="streak-ritual-title">{milestone}</div>
        <div className="streak-ritual-sub">
          {count} {t('profileStreak')}
        </div>
      </div>
    </div>
  );
}
