import { create } from 'zustand';

interface EditorStore {
  isEditorMode: boolean;
  toggleEditorMode: () => void;
  setEditorMode: (mode: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  isEditorMode: false,
  toggleEditorMode: () => set((state) => ({ isEditorMode: !state.isEditorMode })),
  setEditorMode: (mode: boolean) => set({ isEditorMode: mode }),
}));