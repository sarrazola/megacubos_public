import { create } from 'zustand';
import { useCanvasStore } from './useCanvasStore';

export interface Canvas {
  id: string;
  name: string;
}

interface CanvasesStore {
  canvases: Canvas[];
  currentCanvasId: string;
  addCanvas: () => void;
  deleteCanvas: (id: string) => void;
  duplicateCanvas: (id: string) => void;
  renameCanvas: (id: string, name: string) => void;
  setCurrentCanvas: (id: string) => void;
}

export const useCanvasesStore = create<CanvasesStore>((set, get) => ({
  canvases: [
    { id: 'canvas-01', name: 'Canvas 01' },
    { id: 'canvas-02', name: 'Canvas 02' },
  ],
  currentCanvasId: 'canvas-01',
  addCanvas: () =>
    set((state) => {
      const newCanvasNumber = state.canvases.length + 1;
      const newCanvas = {
        id: `canvas-${String(newCanvasNumber).padStart(2, '0')}`,
        name: `Canvas ${String(newCanvasNumber).padStart(2, '0')}`,
      };
      return {
        canvases: [...state.canvases, newCanvas],
        currentCanvasId: newCanvas.id,
      };
    }),
  deleteCanvas: (id) =>
    set((state) => {
      if (state.canvases.length <= 1) {
        return state;
      }
      const newCanvases = state.canvases.filter(canvas => canvas.id !== id);
      const canvasStore = useCanvasStore.getState();
      const newComponents = { ...canvasStore.components };
      delete newComponents[id];
      canvasStore.setComponents(newComponents);
      
      return {
        canvases: newCanvases,
        currentCanvasId: state.currentCanvasId === id ? newCanvases[0].id : state.currentCanvasId,
      };
    }),
  duplicateCanvas: (id) =>
    set((state) => {
      const canvasToDuplicate = state.canvases.find(canvas => canvas.id === id);
      if (!canvasToDuplicate) return state;

      const newCanvasNumber = state.canvases.length + 1;
      const newCanvasId = `canvas-${String(newCanvasNumber).padStart(2, '0')}`;
      const newCanvas = {
        id: newCanvasId,
        name: `${canvasToDuplicate.name} (Copy)`,
      };

      // Duplicate components
      const canvasStore = useCanvasStore.getState();
      const componentsToClone = canvasStore.components[id] || [];
      const clonedComponents = componentsToClone.map(comp => ({
        ...comp,
        id: `${comp.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }));
      
      canvasStore.setComponents({
        ...canvasStore.components,
        [newCanvasId]: clonedComponents,
      });

      return {
        canvases: [...state.canvases, newCanvas],
        currentCanvasId: newCanvas.id,
      };
    }),
  renameCanvas: (id, name) =>
    set((state) => ({
      canvases: state.canvases.map((canvas) =>
        canvas.id === id ? { ...canvas, name } : canvas
      ),
    })),
  setCurrentCanvas: (id) =>
    set({ currentCanvasId: id }),
}));