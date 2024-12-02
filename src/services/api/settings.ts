import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

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
  const accountId = await getCurrentUserAccount();

  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', accountId)
    .single();

  if (error) {
    console.error('Error fetching company settings:', error);
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