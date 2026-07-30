import { useEffect, useRef } from 'react';
import { useToasts } from '../state/toastStore';
import { useSettings } from '../state/settingsStore';
import { useT } from '../i18n/useT';
import { playCelebrationChime } from '../engine/chime';

const CHIME_KEYS = new Set(['rankUp', 'achievementUnlocked']);

export default function Toasts() {
  const { toasts, dismiss } = useToasts();
  const soundEnabled = useSettings((s) => s.soundEnabled);
  const { t, L } = useT();
  const chimed = useRef(new Set<number>());

  // Auto-dismiss the oldest toast.
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => dismiss(toasts[0].id), 3200);
    return () => clearTimeout(timer);
  }, [toasts, dismiss]);

  useEffect(() => {
    if (!soundEnabled) return;
    for (const toast of toasts) {
      if (chimed.current.has(toast.id)) continue;
      chimed.current.add(toast.id);
      if (CHIME_KEYS.has(toast.titleKey)) playCelebrationChime();
    }
  }, [toasts, soundEnabled]);

  if (toasts.length === 0) return null;
  return (
    <div className="toasts">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast" onClick={() => dismiss(toast.id)}>
          {toast.emoji && <span className="toast-emoji">{toast.emoji}</span>}
          <div>
            <div className="toast-title">{t(toast.titleKey)}</div>
            {toast.body && <div className="toast-body">{L(toast.body)}</div>}
          </div>
          {toast.xp ? <span className="toast-xp">+{toast.xp} {t('xpGained')}</span> : null}
        </div>
      ))}
    </div>
  );
}
