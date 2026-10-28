import { create } from 'zustand';
export const useStore = create((set) => ({
  reduced: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  loadPct: 0,
  status: 'loading', // loading | ready | error
  setLoadPct: (loadPct) => set({ loadPct }),
  setStatus: (status) => set({ status }),
}));
