import { create } from 'zustand';
import type { Localized } from '../i18n/types';
import type { UiKey } from '../i18n/strings';

export interface Toast {
  id: number;
  /** UI-chrome label, e.g. "Achievement unlocked". */
  titleKey: UiKey;
  /** Optional content payload (rank/achievement/collection name). */
  body?: Localized<string>;
  emoji?: string;
  xp?: number;
}

interface ToastState {
  toasts: Toast[];
  push: (t: Omit<Toast, 'id'>) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

// Transient, deliberately not persisted.
export const useToasts = create<ToastState>((set) => ({
  toasts: [],
  push: (t) =>
    set((s) => ({ toasts: [...s.toasts, { ...t, id: nextId++ }].slice(-4) })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));
