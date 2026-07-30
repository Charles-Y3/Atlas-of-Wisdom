import { useT } from '../../i18n/useT';
import { STREAK_XP_MILESTONES } from '../../engine/progression';

const MILESTONE_DAYS = Object.keys(STREAK_XP_MILESTONES)
  .map(Number)
  .sort((a, b) => a - b);

/** Parchment streak banner — Home and Profile. */
export default function StreakRitual({ count }: { count: number }) {
  const { t } = useT();
  if (count < 1) return null;

  let milestone = t('streakRitual').replace('{n}', String(count));
  if (count >= 30) milestone = t('streakRitual30');
  else if (count >= 7) milestone = t('streakRitual7');
  else if (count >= 3) milestone = t('streakRitual3');

  const nextDay = MILESTONE_DAYS.find((d) => d > count);
  const nextXp = nextDay ? STREAK_XP_MILESTONES[nextDay] : null;

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
        <div className="streak-ritual-hint">
          {nextDay && nextXp
            ? t('streakRitualNext')
                .replace('{n}', String(nextDay))
                .replace('{xp}', String(nextXp))
            : t('streakRitualHint')}
        </div>
      </div>
    </div>
  );
}
