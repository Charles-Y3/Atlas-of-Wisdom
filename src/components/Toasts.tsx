import { useEffect } from 'react';
import { useToasts } from '../state/toastStore';
import { useT } from '../i18n/useT';

export default function Toasts() {
  const { toasts, dismiss } = useToasts();
  const { t, L } = useT();

  // Auto-dismiss the oldest toast.
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => dismiss(toasts[0].id), 3200);
    return () => clearTimeout(timer);
  }, [toasts, dismiss]);

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
