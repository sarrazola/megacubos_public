import { supabase } from '../supabaseClient';

export const fetchUserCanvases = async () => {
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

    // Fetch active canvases for this company
    const { data, error } = await supabase
      .from('canvas')
      .select('id, name, created_at, status')
      .eq('company_id', userAccount.account_id)
      .eq('status', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching canvases:', error);
    throw error;
  }
};

export const createCanvas = async (name: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: userAccount } = await supabase
      .from('user_accounts')
      .select('account_id')
      .eq('auth_user_id', user.id)
      .single();

    if (!userAccount) throw new Error('No associated company found');

    const { data, error } = await supabase
      .from('canvas')
      .insert([{
        name,
        company_id: userAccount.account_id,
        status: true
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating canvas:', error);
    throw error;
  }
};

export const updateCanvasName = async (id: string, name: string) => {
  try {
    const { data, error } = await supabase
      .from('canvas')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating canvas name:', error);
    throw error;
  }
};

export const deleteCanvas = async (id: string) => {
  try {
    const { error } = await supabase
      .from('canvas')
      .update({ status: false })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting canvas:', error);
    throw error;
  }
}; 