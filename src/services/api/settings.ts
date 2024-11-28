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

export const fetchCompanySettings = async (): Promise<CompanySettings> => {
  const { data, error } = await supabase
    .from('company_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching company settings:', error);
    throw error;
  }

  // If no settings exist, return default values
  if (!data) {
    return {
      id: 1,
      company_name: 'Colchones Estelar',
      plan: 'Básico',
      seats_total: 8,
      seats_used: 2
    };
  }

  return data;
};

export const updateCompanyName = async (id: number, company_name: string): Promise<CompanySettings> => {
  const { data, error } = await supabase
    .from('company_settings')
    .upsert({ 
      id,
      company_name,
      plan: 'Básico',
      seats_total: 8,
      seats_used: 2
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating company name:', error);
    throw error;
  }

  return data;
};