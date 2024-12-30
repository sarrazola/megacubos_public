import React, { useState, useEffect } from 'react';
import { Plus, Database, ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import PostgresConnectionModal from './PostgresConnectionModal';

interface PostgresConnectionsProps {
  onBack: () => void;
}

interface Connection {
  id: number;
  connection_name: string;
  host: string;
  db_name: string;
  db_username: string;
  created_at: string;
}

const PostgresConnections: React.FC<PostgresConnectionsProps> = ({ onBack }) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionToDelete, setConnectionToDelete] = useState<number | null>(null);

  const loadConnections = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userAccount } = await supabase
        .from('user_accounts')
        .select('account_id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userAccount) return;

      const { data, error } = await supabase
        .from('database_auth_settings')
        .select('id, connection_name, host, db_name, db_username, created_at')
        .eq('accounts_id', userAccount.account_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error loading connections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  const handleDeleteConnection = async (id: number) => {
    try {
      const { error } = await supabase
        .from('database_auth_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setConnections(connections.filter(conn => conn.id !== id));
      setConnectionToDelete(null);
    } catch (error) {
      console.error('Error deleting connection:', error);
      alert('Failed to delete connection');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-semibold">PostgreSQL Connections</h1>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Connection
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : connections.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Connections Yet</h2>
          <p className="text-gray-600 mb-4">
            Add your first PostgreSQL connection to get started
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
          >
            <Plus className="h-4 w-4" />
            Add Connection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">{connection.connection_name}</h3>
                </div>
                <button
                  onClick={() => setConnectionToDelete(connection.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Host: {connection.host}</p>
                <p>Database: {connection.db_name}</p>
                <p>Username: {connection.db_username}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <PostgresConnectionModal
          onClose={() => setShowAddModal(false)}
          onSuccess={loadConnections}
        />
      )}

      {connectionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 p-3 bg-red-50 text-red-600 rounded-lg mb-4">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm font-medium">Warning: This action cannot be undone</p>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this connection? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConnectionToDelete(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConnection(connectionToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostgresConnections; 