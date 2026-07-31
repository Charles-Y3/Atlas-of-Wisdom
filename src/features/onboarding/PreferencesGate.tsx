import { useEffect, useState } from 'react';
import { useT } from '../../i18n/useT';
import { useSettings } from '../../state/settingsStore';
import {
  getDeferredInstallPrompt,
  installGuideKind,
  isStandaloneDisplay,
  promptPwaInstall,
  subscribePwaInstall,
} from '../../pwa/pwaInstall';

/** Second gate after language: explorer prefs + optional install (WoS-style). */
export default function PreferencesGate() {
  const { t } = useT();
  const detailedMap = useSettings((s) => s.detailedMapWhenOnline);
  const setDetailedMap = useSettings((s) => s.setDetailedMapWhenOnline);
  const younger = useSettings((s) => s.youngerExplorer);
  const setYounger = useSettings((s) => s.setYoungerExplorer);
  const sound = useSettings((s) => s.soundEnabled);
  const setSound = useSettings((s) => s.setSoundEnabled);
  const completePrefs = useSettings((s) => s.completePrefs);

  const [canInstall, setCanInstall] = useState(() => getDeferredInstallPrompt() !== null);
  const [installed, setInstalled] = useState(() =>
    typeof window !== 'undefined' ? isStandaloneDisplay() : false,
  );

  useEffect(() => {
    return subscribePwaInstall(() => {
      setCanInstall(getDeferredInstallPrompt() !== null);
      setInstalled(isStandaloneDisplay());
    });
  }, []);

  const guideKey =
    installGuideKind() === 'ios'
      ? 'installGuideIos'
      : installGuideKind() === 'android'
        ? 'installGuideAndroid'
        : 'installGuideDesktop';

  async function handleInstall() {
    if (installed) return;
    const outcome = await promptPwaInstall();
    if (outcome === 'accepted') setInstalled(true);
    setCanInstall(getDeferredInstallPrompt() !== null);
  }

  return (
    <div className="gate">
      <div className="gate-card prefs-gate-card">
        <div className="gate-emoji">🧭</div>
        <h1 className="gate-title">{t('prefsGateTitle')}</h1>
        <p className="gate-subtitle">{t('prefsGateSubtitle')}</p>

        <div className="prefs-gate-toggles">
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={younger}
              onChange={(e) => setYounger(e.target.checked)}
            />
            <span>{t('settingsYounger')}</span>
          </label>
          <p className="prefs-gate-hint">{t('settingsYoungerHint')}</p>

          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={detailedMap}
              onChange={(e) => setDetailedMap(e.target.checked)}
            />
            <span>{t('settingsDetailedMap')}</span>
          </label>
          <p className="prefs-gate-hint">{t('settingsDetailedMapHint')}</p>

          <label className="settings-toggle">
            <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} />
            <span>{t('settingsSound')}</span>
          </label>
          <p className="prefs-gate-hint">{t('settingsSoundHint')}</p>
        </div>

        <div className="prefs-gate-install">
          <h2 className="prefs-gate-install-title">{t('installTitle')}</h2>
          {installed ? (
            <p className="prefs-gate-hint">{t('installDone')}</p>
          ) : (
            <>
              <p className="prefs-gate-hint">{t(guideKey)}</p>
              {canInstall && (
                <button type="button" className="btn secondary" onClick={() => void handleInstall()}>
                  ⬇️ {t('installButton')}
                </button>
              )}
            </>
          )}
        </div>

        <button type="button" className="btn" style={{ marginTop: 16, width: '100%' }} onClick={completePrefs}>
          {t('prefsGateContinue')}
        </button>
        <p className="gate-footnote">{t('prefsGateChangeLater')}</p>
      </div>
    </div>
  );
}
