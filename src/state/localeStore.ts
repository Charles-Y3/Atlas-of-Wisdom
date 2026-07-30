import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '../i18n/types';

interface LocaleState {
  locale: Locale;
  hasChosen: boolean;
  setLocale: (locale: Locale) => void;
}

// Persisted separately from exploration progress so "Reset progress" never
// wipes the user's language choice (same pattern as Journey).
export const useLocale = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'en',
      hasChosen: false,
      setLocale: (locale) => set({ locale, hasChosen: true }),
    }),
    { name: 'atlas-locale', version: 1 },
  ),
);
