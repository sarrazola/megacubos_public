import { loadUsetifulScript, setUsetifulTags } from 'usetiful-sdk';
import { supabase } from '../services/supabaseClient';

export const initializeUsetiful = async () => {
  // Load the Usetiful script
  loadUsetifulScript('0a469bd4f36c230d30be268e612e0f71');

  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get user account details
    const { data: userAccount } = await supabase
      .from('user_accounts')
      .select(`
        id,
        name,
        role,
        account_id,
        accounts (
          id,
          company_name
        )
      `)
      .eq('auth_user_id', user.id)
      .single();

    if (!userAccount) return;

    // Set Usetiful tags with user and company information
    setUsetifulTags({
      userId: userAccount.id.toString(),
      name: userAccount.name,
      role: userAccount.role,
      company_id: userAccount.account_id.toString(),
      company_name: userAccount.accounts.company_name
    });

  } catch (error) {
    console.error('Error initializing Usetiful:', error);
  }
}; 