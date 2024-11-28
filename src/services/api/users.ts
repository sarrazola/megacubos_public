import { createClient } from '@supabase/supabase-js';
import { User, NewUser } from '../../types/user';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('user_accounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

  return data.map((user: any) => ({
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role || 'user',
    createdAt: user.created_at,
  }));
};

export const createUser = async (user: NewUser): Promise<User> => {
  const timestamp = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('user_accounts')
    .insert([{
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      created_at: timestamp,
      password: 'default-password' // You should implement proper password handling
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }

  return {
    id: data.id.toString(),
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    role: data.role || 'user',
    createdAt: data.created_at,
  };
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
  const { data, error } = await supabase
    .from('user_accounts')
    .update({
      name: updates.name,
      email: updates.email,
      phone: updates.phone,
    })
    .eq('id', parseInt(id))
    .select()
    .single();

  if (error) {
    console.error('Error updating user:', error);
    throw error;
  }

  return {
    id: data.id.toString(),
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    role: data.role || 'user',
    createdAt: data.created_at,
  };
};

export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('user_accounts')
    .delete()
    .eq('id', parseInt(id));

  if (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};