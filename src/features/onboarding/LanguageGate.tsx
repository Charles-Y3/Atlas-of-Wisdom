import { useLocale } from '../../state/localeStore';
import { VISIBLE_LOCALES, LOCALE_LABELS, type Locale } from '../../i18n/types';
import { t } from '../../i18n/strings';

// Before a language is chosen there is no "current locale" to render in;
// preview text cycles through the offered locales (suite pattern —
// English + Traditional Chinese previews, Simplified offered as a choice).
const GATE_PREVIEW_LOCALES: Locale[] = ['en', 'zh-Hant'];

/**
 * Full-screen language picker shown once on a fresh install. Stored in
 * useLocale (separate from exploration progress); changeable in Explorer
 * settings later.
 */
export default function LanguageGate() {
  const setLocale = useLocale((s) => s.setLocale);

  return (
    <div className="gate">
      <div className="gate-card">
        <div className="gate-emoji">🗺️</div>
        <h1 className="gate-title gate-bilingual">
          {GATE_PREVIEW_LOCALES.map((l) => (
            <span key={l}>{t('gateWelcome', l)}</span>
          ))}
        </h1>
        <p className="gate-subtitle gate-bilingual">
          {GATE_PREVIEW_LOCALES.map((l) => (
            <span key={l}>{t('gateSubtitle', l)}</span>
          ))}
        </p>
        <div className="gate-options">
          {VISIBLE_LOCALES.map((locale) => (
            <button key={locale} className="gate-option" onClick={() => setLocale(locale)}>
              <span className="gate-flag">{LOCALE_LABELS[locale].flagEmoji}</span>
              <span className="gate-native">{LOCALE_LABELS[locale].native}</span>
            </button>
          ))}
        </div>
        <p className="gate-footnote gate-bilingual">
          {GATE_PREVIEW_LOCALES.map((l) => (
            <span key={l}>{t('gateChangeLater', l)}</span>
          ))}
        </p>
      </div>
    </div>
  );
}
