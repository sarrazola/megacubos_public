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

export const createUser = async (user: NewUser & { password: string }): Promise<User> => {
  try {
    const accountId = await getCurrentUserAccount();
    
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          name: user.name
        }
      }
    });

    if (authError) {
      // Check specifically for user exists error
      if (authError.message.includes('User already registered')) {
        throw new Error('A user with this email already exists');
      }
      throw authError;
    }

    // 2. Create user_account
    const { data, error } = await supabase
      .from('user_accounts')
      .insert([{
        auth_user_id: authData.user.id,
        account_id: accountId,
        name: user.name,
        phone: user.phone,
        role: user.role,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      // If user_account creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw error;
    }

    return {
      id: data.id.toString(),
      name: data.name,
      email: user.email,
      phone: data.phone || '',
      role: data.role || 'user',
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
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