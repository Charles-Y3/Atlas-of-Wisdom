import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  /** When true, Atlas may swap to online vector tiles after a successful probe. */
  detailedMapWhenOnline: boolean;
  setDetailedMapWhenOnline: (value: boolean) => void;
  /** Shorter stories and simpler reflection prompts. */
  youngerExplorer: boolean;
  setYoungerExplorer: (value: boolean) => void;
  /** Soft chime on rank-up / achievement toasts. Default off. */
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
}

// Persisted separately from exploration progress so "Reset progress" never
// wipes preferences (same pattern as atlas-locale).
export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      detailedMapWhenOnline: false,
      setDetailedMapWhenOnline: (detailedMapWhenOnline) => set({ detailedMapWhenOnline }),
      youngerExplorer: false,
      setYoungerExplorer: (youngerExplorer) => set({ youngerExplorer }),
      soundEnabled: false,
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
    }),
    { name: 'atlas-settings', version: 1 },
  ),
);
