import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  /** When true, Atlas may swap to online vector tiles after a successful probe. */
  detailedMapWhenOnline: boolean;
  setDetailedMapWhenOnline: (value: boolean) => void;
}

// Persisted separately from exploration progress so "Reset progress" never
// wipes map preferences (same pattern as atlas-locale).
export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      detailedMapWhenOnline: false,
      setDetailedMapWhenOnline: (detailedMapWhenOnline) => set({ detailedMapWhenOnline }),
    }),
    { name: 'atlas-settings', version: 1 },
  ),
);
