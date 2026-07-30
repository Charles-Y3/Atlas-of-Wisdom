import { useState } from 'react';
import { useT } from '../../i18n/useT';
import { VIRTUE_BY_ID } from '../../data/virtues';
import type { AtlasLocation } from '../../data/types';
import { useProgress, MIN_REFLECTION_CHARS } from '../../state/store';

/**
 * Shown once a place's story has been read: one open question drawn from
 * the place's primary virtue. This is the app's quiet turn from collecting
 * facts to reflecting on them — the "spiritual journey" thread. Answers are
 * private, stored locally, and never scored.
 */
export default function ReflectionCard({ location }: { location: AtlasLocation }) {
  const { t, L } = useT();
  const existing = useProgress((s) => s.reflections?.[location.id]);
  const submitReflection = useProgress((s) => s.submitReflection);
  const [text, setText] = useState('');
  const [dismissed, setDismissed] = useState(false);

  const virtue = VIRTUE_BY_ID[location.virtues[0]];
  if (!virtue) return null;

  if (existing) {
    const shown = VIRTUE_BY_ID[existing.virtue] ?? virtue;
    return (
      <div className="section">
        <h2>{t('reflectYours')}</h2>
        <div className="reflection-saved">
          <div className="reflection-q">
            {shown.emoji} {L(shown.reflection)}
          </div>
          <p className="reflection-text">{existing.text}</p>
        </div>
      </div>
    );
  }

  if (dismissed) return null;

  const remaining = MIN_REFLECTION_CHARS - text.trim().length;

  return (
    <div className="section">
      <h2>{t('reflectTitle')}</h2>
      <div className="reflection-card">
        <p className="reflection-intro">{t('reflectIntro')}</p>
        <div className="reflection-q">
          {virtue.emoji} {L(virtue.reflection)}
        </div>
        <textarea
          className="reflection-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('reflectPlaceholder')}
          rows={4}
        />
        <div className="reflection-actions">
          <button
            className="btn"
            disabled={remaining > 0}
            onClick={() => submitReflection(location.id, virtue.id, text)}
          >
            {remaining > 0 ? t('reflectMinHint') : `🪞 ${t('reflectSave')}`}
          </button>
          <button className="btn subtle" onClick={() => setDismissed(true)}>
            {t('reflectSkip')}
          </button>
        </div>
      </div>
    </div>
  );
}
