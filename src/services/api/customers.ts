import { supabase } from '../supabaseClient';

export const fetchCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }

  return data;
};

export const updateCustomer = async (customerId: number, updates: any) => {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', customerId)
    .select()
    .single();

  if (error) {
    console.error('Error updating customer:', error);
    throw error;
  }

  return data;
};

export const deleteCustomer = async (customerId: number) => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', customerId);

  if (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};