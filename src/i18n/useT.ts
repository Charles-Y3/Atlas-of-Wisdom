import { useLocale } from '../state/localeStore';
import type { Locale, Localized } from './types';
import { L } from './L';
import { t as tRaw, type UiKey } from './strings';

/** Convenience hook: current locale, a UI-string lookup, and a data-field resolver. */
export function useT() {
  const locale = useLocale((s) => s.locale);
  return {
    locale,
    t: (key: UiKey) => tRaw(key, locale),
    L: <T,>(loc: Localized<T>) => L(loc, locale),
  };
}

export type { Locale };
