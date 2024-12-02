import { create } from 'zustand';
import { fetchUserCanvases, createCanvas, updateCanvasName, deleteCanvas } from '../services/api/canvas';

interface CanvasesStore {
  canvases: Canvas[];
  currentCanvasId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchCanvases: () => Promise<void>;
  addCanvas: (name: string) => Promise<void>;
  deleteCanvas: (id: string) => Promise<void>;
  renameCanvas: (id: string, name: string) => Promise<void>;
  setCurrentCanvas: (id: string) => void;
}

export const useCanvasesStore = create<CanvasesStore>((set) => ({
  canvases: [],
  currentCanvasId: null,
  isLoading: false,
  error: null,

  fetchCanvases: async () => {
    set({ isLoading: true });
    try {
      console.log('Fetching canvases...');
      const canvases = await fetchUserCanvases();
      console.log('Fetched canvases:', canvases);
      set({ 
        canvases,
        currentCanvasId: canvases[0]?.id || null,
        error: null 
      });
    } catch (error) {
      console.error('Error in fetchCanvases:', error);
      set({ error: 'Failed to fetch canvases' });
    } finally {
      set({ isLoading: false });
    }
  },

  addCanvas: async (name: string = 'New Canvas') => {
    try {
      const newCanvas = await createCanvas(name);
      set(state => ({
        canvases: [...state.canvases, newCanvas],
        currentCanvasId: newCanvas.id
      }));
    } catch (error) {
      set({ error: 'Failed to create canvas' });
    }
  },

  deleteCanvas: async (id) => {
    try {
      await deleteCanvas(id);
      set(state => ({
        canvases: state.canvases.filter(canvas => canvas.id !== id),
        currentCanvasId: state.currentCanvasId === id ? state.canvases[0]?.id || null : state.currentCanvasId
      }));
    } catch (error) {
      set({ error: 'Failed to delete canvas' });
    }
  },

  renameCanvas: async (id, name) => {
    try {
      const updatedCanvas = await updateCanvasName(id, name);
      set(state => ({
        canvases: state.canvases.map(canvas => 
          canvas.id === id ? updatedCanvas : canvas
        )
      }));
    } catch (error) {
      set({ error: 'Failed to rename canvas' });
    }
  },

  setCurrentCanvas: (id) => set({ currentCanvasId: id })
}));