import { create } from 'zustand';

interface PageStore {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const usePageStore = create<PageStore>((set) => ({
  currentPage: 'dashboard',
  setCurrentPage: (page) => set({ currentPage: page }),
}));