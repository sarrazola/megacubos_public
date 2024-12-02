import { createClient } from '@supabase/supabase-js';
import { User, NewUser } from '../../types/user';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

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

export const fetchUsers = async (): Promise<User[]> => {
  const accountId = await getCurrentUserAccount();

  const { data, error } = await supabase
    .from('user_accounts')
    .select('*')
    .eq('account_id', accountId)
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
  const accountId = await getCurrentUserAccount();
  const timestamp = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('user_accounts')
    .insert([{
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      created_at: timestamp,
      account_id: accountId
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