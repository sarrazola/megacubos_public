import { supabase } from '../supabaseClient';
import { User, NewUser } from '../../types/user';

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

  // Get all user accounts
  const { data: userAccounts, error } = await supabase
    .from('user_accounts')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

  // Get auth user data for email
  const { data: { user } } = await supabase.auth.getUser();
  
  // Map the data and include email from auth user
  return userAccounts.map((userAccount: any) => ({
    id: userAccount.id.toString(),
    name: userAccount.name,
    email: userAccount.auth_user_id === user?.id ? user.email : '',  // Use email from auth user
    phone: userAccount.phone || '',
    role: userAccount.role || 'user',
    createdAt: userAccount.created_at,
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