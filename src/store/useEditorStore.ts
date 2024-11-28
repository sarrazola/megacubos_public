import { create } from 'zustand';

interface EditorStore {
  isEditorMode: boolean;
  toggleEditorMode: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  isEditorMode: true,
  toggleEditorMode: () => set((state) => ({ isEditorMode: !state.isEditorMode })),
}));