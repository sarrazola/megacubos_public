import React, { useState, useEffect } from 'react';
import { Database, ArrowLeft, Plus, Table2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

interface ExternalPostgresTablesProps {
  connection: {
    id: number;
    connection_name: string;
    host: string;
    port: string;
    db_name: string;
    db_username: string;
    db_password: string;
  };
  onBack: () => void;
}

const ExternalPostgresTables: React.FC<ExternalPostgresTablesProps> = ({ connection, onBack }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTables();
  }, [connection]);

  const loadTables = async () => {
    try {
      setIsLoading(true);
      
      // Get the function URL from Supabase
      const functionUrl = `${supabase.supabaseUrl}/functions/v1/listPostgresTables`;
      
      // Get the anonymous key
      const anonKey = supabase.supabaseKey;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify({ connection }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch tables');
      }

      const data = await response.json();
      setTables(data.tables.map((t: any) => t.table_name));
    } catch (err) {
      console.error('Error loading tables:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tables');
    } finally {
      setIsLoading(false);
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
            <h1 className="text-2xl font-semibold">{connection.connection_name} Tables</h1>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      ) : tables.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Table2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Tables Found</h2>
          <p className="text-gray-600">
            This database has no tables or you don't have permission to view them
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table) => (
            <div
              key={table}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center gap-3">
                <Table2 className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">{table}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExternalPostgresTables; 