import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export interface AccountSettings {
  id: number;
  company_name: string;
  plan: string;
  seats_total: number;
  seats_used: number;
  owner_id: string;
}

export const fetchAccountSettings = async (): Promise<AccountSettings> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user?.id) {
      throw new Error('No authenticated user found');
    }

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('owner_id', session.session.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, create default settings
        const defaultSettings = {
          company_name: 'My Company',
          plan: 'basic',
          seats_total: 8,
          seats_used: 1,
          owner_id: session.session.user.id
        };

        const { data: newData, error: insertError } = await supabase
          .from('accounts')
          .insert([defaultSettings])
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        return newData;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchAccountSettings:', error);
    throw error;
  }
};

export const updateCompanyName = async (id: number, company_name: string): Promise<AccountSettings> => {
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

  return data;
};