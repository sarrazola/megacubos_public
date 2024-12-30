import { create } from 'zustand';

interface GuidelinesStore {
  showGuidelines: boolean;
  setShowGuidelines: (show: boolean) => void;
  guidelines: {
    vertical: number[];
    horizontal: number[];
  };
  setGuidelines: (guidelines: { vertical: number[]; horizontal: number[] }) => void;
}

export const useGuidelinesStore = create<GuidelinesStore>((set) => ({
  showGuidelines: false,
  setShowGuidelines: (show) => set({ showGuidelines: show }),
  guidelines: {
    vertical: [],
    horizontal: [],
  },
  setGuidelines: (guidelines) => set({ guidelines }),
})); 