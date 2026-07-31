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
  /** First-run preferences gate completed (after language). */
  prefsChosen: boolean;
  completePrefs: () => void;
  /** Re-show the preferences gate (e.g. after progress reset). */
  reopenPrefsGate: () => void;
}

// Persisted separately from exploration progress so "Reset progress" never
// wipes preferences (same pattern as atlas-locale).
export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      detailedMapWhenOnline: true,
      setDetailedMapWhenOnline: (detailedMapWhenOnline) => set({ detailedMapWhenOnline }),
      youngerExplorer: false,
      setYoungerExplorer: (youngerExplorer) => set({ youngerExplorer }),
      soundEnabled: false,
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      prefsChosen: false,
      completePrefs: () => set({ prefsChosen: true }),
      reopenPrefsGate: () => set({ prefsChosen: false }),
    }),
    {
      name: 'atlas-settings',
      version: 3,
      migrate: (persisted, version) => {
        const p = (persisted ?? {}) as Record<string, unknown>;
        // Existing installs already chose language — skip the new prefs gate.
        if (version < 2) {
          p.prefsChosen = true;
        }
        // Detailed online map is now on by default (was false for earlier installs).
        if (version < 3) {
          p.detailedMapWhenOnline = true;
        }
        return p;
      },
    },
  ),
);
