import { supabase } from '../supabaseClient';
import { CanvasComponent } from '../../store/useCanvasStore';

export const saveCanvasComponents = async (canvasId: string, components: CanvasComponent[]) => {
  try {
    // First delete existing components for this canvas
    await supabase
      .from('canvas_components')
      .delete()
      .eq('canvas', canvasId);

    // Then insert the new components
    const { data, error } = await supabase
      .from('canvas_components')
      .insert(
        components.map(comp => ({
          canvas: canvasId,
          component_type: comp.type,
          position_x: comp.position.x,
          position_y: comp.position.y,
          width: comp.size.width,
          height: comp.size.height,
          properties: comp.properties
        }))
      );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving canvas components:', error);
    throw error;
  }
};

export const fetchCanvasComponents = async (canvasId: string) => {
  try {
    const { data, error } = await supabase
      .from('canvas_components')
      .select('*')
      .eq('canvas', canvasId);

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      type: item.component_type,
      position: { x: item.position_x, y: item.position_y },
      size: { width: item.width, height: item.height },
      properties: item.properties || {}
    }));
  } catch (error) {
    console.error('Error fetching canvas components:', error);
    throw error;
  }
}; 