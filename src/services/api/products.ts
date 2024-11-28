import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data;
};

export const updateProduct = async (productId: number, updates: any) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return data;
};

export const deleteProduct = async (productId: number) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};