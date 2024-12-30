import React, { useState } from 'react';
import { X, Database } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

interface PostgresConnectionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PostgresConnectionModal: React.FC<PostgresConnectionModalProps> = ({ onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    connection_name: '',
    host: '',
    port: '',
    db_name: '',
    db_username: '',
    db_password: ''
  });

  const validateHost = (host: string) => {
    // Remove any prefixes like 'host:', 'http://', 'https://'
    return host.replace(/^(host:|https?:\/\/)/i, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Clean the host value
      const cleanHost = validateHost(formData.host);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('Not authenticated');

      const { data: userAccount, error: accountError } = await supabase
        .from('user_accounts')
        .select('account_id')
        .eq('auth_user_id', user.id)
        .single();

      if (accountError) throw accountError;
      if (!userAccount) throw new Error('Account not found');

      const { error: insertError } = await supabase
        .from('database_auth_settings')
        .insert([{
          ...formData,
          host: cleanHost, // Use the cleaned host value
          port: formData.port || '5432',
          accounts_id: userAccount.account_id
        }]);

      if (insertError) throw insertError;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving connection:', err);
      setError(err instanceof Error ? err.message : 'Failed to save connection');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Add PostgreSQL Connection</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Connection Name
            </label>
            <input
              type="text"
              value={formData.connection_name}
              onChange={(e) => setFormData({ ...formData, connection_name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Host Name or IP
            </label>
            <input
              type="text"
              value={formData.host}
              onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Port (Optional)
            </label>
            <input
              type="text"
              value={formData.port}
              onChange={(e) => setFormData({ ...formData, port: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="5432"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Database Name
            </label>
            <input
              type="text"
              value={formData.db_name}
              onChange={(e) => setFormData({ ...formData, db_name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Database Username
            </label>
            <input
              type="text"
              value={formData.db_username}
              onChange={(e) => setFormData({ ...formData, db_username: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Database Password
            </label>
            <input
              type="password"
              value={formData.db_password}
              onChange={(e) => setFormData({ ...formData, db_password: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Connection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostgresConnectionModal;