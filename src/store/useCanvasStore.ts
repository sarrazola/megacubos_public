import { create } from 'zustand';
import { saveCanvasComponents, fetchCanvasComponents } from '../services/api/canvasComponents';

interface ComponentPosition {
  x: number;
  y: number;
}

interface ComponentSize {
  width: number;
  height: number;
}

export interface CanvasComponent {
  id: string;
  type: string;
  position: ComponentPosition;
  size: ComponentSize;
  properties: Record<string, any>;
}

interface CanvasStore {
  components: Record<string, CanvasComponent[]>;
  selectedComponent: string | null;
  initializeCanvas: (canvasId: string) => Promise<void>;
  addComponent: (canvasId: string, component: CanvasComponent) => void;
  updateComponentPosition: (canvasId: string, id: string, position: ComponentPosition) => void;
  updateComponentSize: (canvasId: string, id: string, size: ComponentSize) => void;
  removeComponent: (canvasId: string, id: string) => void;
  selectComponent: (id: string | null) => void;
  updateComponentProperties: (canvasId: string, id: string, properties: Record<string, any>) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  components: {},
  selectedComponent: null,
  
  initializeCanvas: async (canvasId: string) => {
    try {
      const components = await fetchCanvasComponents(canvasId);
      set(state => ({
        components: {
          ...state.components,
          [canvasId]: components
        }
      }));
    } catch (error) {
      console.error('Error initializing canvas:', error);
    }
  },

  addComponent: async (canvasId, component) => {
    set((state) => {
      const newComponents = [...(state.components[canvasId] || []), component];
      const newState = {
        components: {
          ...state.components,
          [canvasId]: newComponents,
        },
        selectedComponent: component.id,
      };
      
      // Save to database
      saveCanvasComponents(canvasId, newComponents);
      
      return newState;
    });
  },

  updateComponentPosition: (canvasId, id, position) =>
    set((state) => {
      const newComponents = (state.components[canvasId] || []).map((comp) =>
        comp.id === id ? { ...comp, position } : comp
      );
      
      const newState = {
        components: {
          ...state.components,
          [canvasId]: newComponents,
        },
      };
      
      // Save to database
      saveCanvasComponents(canvasId, newComponents);
      
      return newState;
    }),

  updateComponentSize: (canvasId, id, size) =>
    set((state) => {
      const newComponents = (state.components[canvasId] || []).map((comp) =>
        comp.id === id ? { ...comp, size } : comp
      );
      
      const newState = {
        components: {
          ...state.components,
          [canvasId]: newComponents,
        },
      };
      
      saveCanvasComponents(canvasId, newComponents);
      
      return newState;
    }),

  removeComponent: (canvasId, id) =>
    set((state) => {
      const newComponents = (state.components[canvasId] || []).filter((comp) => comp.id !== id);
      
      const newState = {
        components: {
          ...state.components,
          [canvasId]: newComponents,
        },
        selectedComponent: state.selectedComponent === id ? null : state.selectedComponent,
      };
      
      saveCanvasComponents(canvasId, newComponents);
      
      return newState;
    }),

  selectComponent: (id) => set({ selectedComponent: id }),

  updateComponentProperties: (canvasId, id, properties) =>
    set((state) => {
      const newComponents = (state.components[canvasId] || []).map((comp) =>
        comp.id === id ? { ...comp, properties: { ...comp.properties, ...properties } } : comp
      );
      
      const newState = {
        components: {
          ...state.components,
          [canvasId]: newComponents,
        },
      };
      
      saveCanvasComponents(canvasId, newComponents);
      
      return newState;
    }),
}));