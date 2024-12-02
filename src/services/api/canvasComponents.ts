import { supabase } from '../supabaseClient';
import { CanvasComponent } from '../../store/useCanvasStore';

export const saveCanvasComponents = async (canvasId: string, components: CanvasComponent[]) => {
  try {
    // Get the current user's account/company ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get user's company ID
    const { data: userAccount } = await supabase
      .from('user_accounts')
      .select('account_id')
      .eq('auth_user_id', user.id)
      .single();

    if (!userAccount) throw new Error('No associated company found');

    // First delete existing components for this canvas and company
    await supabase
      .from('canvas_components')
      .delete()
      .eq('canvas_id', canvasId)
      .eq('company_id', userAccount.account_id);

    // Then insert the new components with company_id
    const { data, error } = await supabase
      .from('canvas_components')
      .insert(
        components.map(comp => ({
          canvas_id: canvasId,
          component_type: comp.type,
          position_x: comp.position.x,
          position_y: comp.position.y,
          width: comp.size.width,
          height: comp.size.height,
          properties: comp.properties,
          company_id: userAccount.account_id
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
    // Get the current user's account/company ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // First get the user's company ID
    const { data: userAccount } = await supabase
      .from('user_accounts')
      .select('account_id')
      .eq('auth_user_id', user.id)
      .single();

    if (!userAccount) throw new Error('No associated company found');

    // Now fetch components filtered by both canvas_id and company_id
    const { data, error } = await supabase
      .from('canvas_components')
      .select('*')
      .eq('canvas_id', canvasId)
      .eq('company_id', userAccount.account_id);

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      type: item.component_type,
      position: { x: item.position_x, y: item.position_y },
      size: { width: item.width, height: item.height },
      properties: item.properties
    }));
  } catch (error) {
    console.error('Error fetching canvas components:', error);
    throw error;
  }
}; 