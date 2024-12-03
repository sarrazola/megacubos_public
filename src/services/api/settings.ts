import { supabase } from '../supabaseClient';

export interface CompanySettings {
  id: number;
  company_name: string;
  plan: string;
  seats_total: number;
  seats_used: number;
}

// First get the current user's account_id
const getCurrentUserAccount = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_accounts')
    .select('account_id')
    .eq('auth_user_id', user.id)
    .single();

  if (error) throw error;
  return data.account_id;
};

export const fetchCompanySettings = async (): Promise<CompanySettings> => {
  try {
    const accountId = await getCurrentUserAccount();
    console.log('Got account ID:', accountId);

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (error) {
      console.log('No existing account found, creating new one...');
      if (error.code === 'PGRST116') {
        // No data found, create default settings
        const { data: { user } } = await supabase.auth.getUser();
        const defaultSettings = {
          id: accountId,
          company_name: 'My Company',
          plan: 'basic',
          seats_total: 8,
          seats_used: 1,
          owner_id: user.id,
          status: true
        };

        // First create the account
        const { data: newData, error: insertError } = await supabase
          .from('accounts')
          .insert([defaultSettings])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating account:', insertError);
          throw insertError;
        }

        console.log('Created new account:', newData);

        // Create the default canvas directly instead of using RPC
        const { data: canvasData, error: canvasError } = await supabase
          .from('canvas')
          .insert([{
            name: 'My first canvas',
            company_id: accountId,
            status: true,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (canvasError) {
          console.error('Error creating default canvas:', canvasError);
          throw canvasError;
        }

        console.log('Created default canvas:', canvasData);

        return newData;
      }
      console.error('Unexpected error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchCompanySettings:', error);
    throw error;
  }
};

export const updateCompanyName = async (id: number, company_name: string): Promise<CompanySettings> => {
  const { data, error } = await supabase
    .from('accounts')
    .update({ company_name })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating company name:', error);
    throw error;
  }

  return {
    id: data.id,
    company_name: data.company_name,
    plan: data.plan,
    seats_total: data.seats_total,
    seats_used: data.seats_used
  };
};