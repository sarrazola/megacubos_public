import { create } from 'zustand';

interface RowDetailsStore {
  selectedRow: Record<string, any> | null;
  setSelectedRow: (row: Record<string, any> | null) => void;
}

export const useRowDetailsStore = create<RowDetailsStore>((set) => ({
  selectedRow: null,
  setSelectedRow: (row) => set({ selectedRow: row }),
})); 