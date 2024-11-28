import { create } from 'zustand';

export interface CanvasComponent {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  properties: {
    [key: string]: any;
  };
}

interface CanvasStore {
  components: Record<string, CanvasComponent[]>;
  selectedComponent: string | null;
  addComponent: (canvasId: string, component: CanvasComponent) => void;
  updateComponentPosition: (canvasId: string, id: string, position: { x: number; y: number }) => void;
  updateComponentSize: (canvasId: string, id: string, size: { width: number; height: number }) => void;
  removeComponent: (canvasId: string, id: string) => void;
  selectComponent: (id: string | null) => void;
  updateComponentProperties: (canvasId: string, id: string, properties: { [key: string]: any }) => void;
  duplicateComponent: (canvasId: string, id: string) => void;
  setComponents: (components: Record<string, CanvasComponent[]>) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  components: {
    'canvas-01': [],
    'canvas-02': []
  },
  selectedComponent: null,
  addComponent: (canvasId, component) =>
    set((state) => ({
      components: {
        ...state.components,
        [canvasId]: [...(state.components[canvasId] || []), component],
      },
      selectedComponent: component.id,
    })),
  updateComponentPosition: (canvasId, id, position) =>
    set((state) => ({
      components: {
        ...state.components,
        [canvasId]: (state.components[canvasId] || []).map((comp) =>
          comp.id === id ? { ...comp, position } : comp
        ),
      },
    })),
  updateComponentSize: (canvasId, id, size) =>
    set((state) => ({
      components: {
        ...state.components,
        [canvasId]: (state.components[canvasId] || []).map((comp) =>
          comp.id === id ? { ...comp, size } : comp
        ),
      },
    })),
  removeComponent: (canvasId, id) =>
    set((state) => ({
      components: {
        ...state.components,
        [canvasId]: (state.components[canvasId] || []).filter((comp) => comp.id !== id),
      },
      selectedComponent: state.selectedComponent === id ? null : state.selectedComponent,
    })),
  selectComponent: (id) =>
    set({ selectedComponent: id }),
  updateComponentProperties: (canvasId, id, properties) =>
    set((state) => ({
      components: {
        ...state.components,
        [canvasId]: (state.components[canvasId] || []).map((comp) =>
          comp.id === id ? { ...comp, properties: { ...comp.properties, ...properties } } : comp
        ),
      },
    })),
  duplicateComponent: (canvasId, id) =>
    set((state) => {
      const componentToDuplicate = (state.components[canvasId] || []).find((comp) => comp.id === id);
      if (!componentToDuplicate) return state;

      const newComponent = {
        ...componentToDuplicate,
        id: `${componentToDuplicate.type}-${Date.now()}`,
        position: {
          x: componentToDuplicate.position.x + 20,
          y: componentToDuplicate.position.y + 20,
        },
      };

      return {
        components: {
          ...state.components,
          [canvasId]: [...(state.components[canvasId] || []), newComponent],
        },
        selectedComponent: newComponent.id,
      };
    }),
  setComponents: (components) =>
    set({ components }),
}));