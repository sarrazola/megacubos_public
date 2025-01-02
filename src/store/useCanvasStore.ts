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
  canvases: Record<string, { components: CanvasComponent[] }>;
  setSelectedComponent: (id: string | null) => void;
  selectComponent: (id: string | null) => void;
  updateComponentProperties: (canvasId: string, id: string, properties: Record<string, any>) => void;
  updateComponentPosition: (canvasId: string, id: string, position: ComponentPosition) => void;
  updateComponentSize: (canvasId: string, id: string, size: ComponentSize) => void;
  addComponent: (canvasId: string, component: CanvasComponent) => void;
  clearState: () => void;
  getComponentProperties: (canvasId: string, componentId: string) => Record<string, any> | null;
  removeComponent: (canvasId: string, id: string) => void;
  duplicateComponent: (canvasId: string, id: string) => void;
  initializeCanvas: (canvasId: string) => Promise<void>;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  components: {},
  selectedComponent: null,
  canvases: {},

  initializeCanvas: async (canvasId: string) => {
    try {
      // Clear existing components for this canvas
      set(state => ({
        components: {
          ...state.components,
          [canvasId]: [] // Reset components for this specific canvas
        }
      }));
      
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

  updateComponentPosition: (canvasId, id, position) =>
    set((state) => {
      const newComponents = (state.components[canvasId] || []).map((comp: CanvasComponent) =>
        comp.id === id ? { ...comp, position } : comp
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

  setSelectedComponent: (id) => set({
    selectedComponent: id
  }),

  selectComponent: (id) => set({
    selectedComponent: id
  }),

  removeComponent: (canvasId, id) =>
    set((state) => {
      const newComponents = (state.components[canvasId] || []).filter((comp: CanvasComponent) => comp.id !== id);
      
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

  duplicateComponent: (canvasId, id) =>
    set((state) => {
      const componentToDuplicate = state.components[canvasId]?.find((comp: CanvasComponent) => comp.id === id);
      if (!componentToDuplicate) return state;

      const newComponent = {
        ...componentToDuplicate,
        id: crypto.randomUUID(),
        position: {
          x: componentToDuplicate.position.x + 20,
          y: componentToDuplicate.position.y + 20,
        },
      };

      const newComponents = [...(state.components[canvasId] || []), newComponent];
      
      const newState = {
        components: {
          ...state.components,
          [canvasId]: newComponents,
        },
        selectedComponent: newComponent.id,
      };
      
      saveCanvasComponents(canvasId, newComponents);
      
      return newState;
    }),

  updateComponentProperties: (canvasId, id, properties) => {
    set((state) => {
      const newComponents = (state.components[canvasId] || []).map((comp: CanvasComponent) =>
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
    });
  },

  clearState: () => set({
    components: {},
    selectedComponent: null
  }),

  getComponentProperties: (canvasId: string, componentId: string) => {
    console.log('Getting properties for:', { canvasId, componentId });
    const state = get();
    console.log('Current state:', state);
    
    const canvasComponents = state.components[canvasId];
    console.log('Canvas components:', canvasComponents);
    
    if (!canvasComponents) {
      console.log('No components found for canvas:', canvasId);
      return null;
    }
    
    const component = canvasComponents.find((c: CanvasComponent) => c.id === componentId);
    console.log('Found component:', component);
    
    if (!component) {
      console.log('Component not found:', componentId);
      return null;
    }
    
    console.log('Returning properties:', component.properties);
    return component.properties;
  },

  updateComponentSize: (canvasId, id, size) =>
    set((state) => {
      const newComponents = (state.components[canvasId] || []).map((comp: CanvasComponent) =>
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

  addComponent: (canvasId, component) =>
    set((state) => {
      const newComponents = [...(state.components[canvasId] || []), component];
      
      const newState = {
        components: {
          ...state.components,
          [canvasId]: newComponents,
        },
        selectedComponent: component.id,
      };
      
      saveCanvasComponents(canvasId, newComponents);
      
      return newState;
    }),
}));