import { useEffect, useState } from 'react';
import { useT } from '../i18n/useT';
import { applyPwaUpdate, subscribePwaNeedRefresh } from '../pwa/pwaUpdate';

/** Top banner when a new service-worker build is waiting (WoS pattern). */
export default function UpdateBanner() {
  const { t } = useT();
  const [available, setAvailable] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => subscribePwaNeedRefresh(setAvailable), []);

  if (!available || dismissed) return null;

  return (
    <div className="update-banner" role="status">
      <span className="update-banner-body">{t('updateAvailable')}</span>
      <div className="update-banner-actions">
        <button type="button" className="btn" onClick={() => applyPwaUpdate()}>
          {t('updateReload')}
        </button>
        <button type="button" className="btn subtle" onClick={() => setDismissed(true)}>
          {t('updateLater')}
        </button>
      </div>
    </div>
  );
}
