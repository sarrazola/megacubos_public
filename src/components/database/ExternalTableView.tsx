import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import TableComponent from '../builder/components/TableComponent';

interface ExternalTableViewProps {
  connection: {
    id: number;
    connection_name: string;
    host: string;
    port: string;
    db_name: string;
    db_username: string;
    db_password: string;
  };
  tableName: string;
  onBack: () => void;
}

const ExternalTableView: React.FC<ExternalTableViewProps> = ({ connection, tableName, onBack }) => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTableData();
  }, [connection, tableName]);

  const loadTableData = async () => {
    try {
      setIsLoading(true);
      
      const functionUrl = `${supabase.supabaseUrl}/functions/v1/getTableData`;
      const anonKey = supabase.supabaseKey;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify({ 
          connection,
          tableName 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch table data');
      }

      const data = await response.json();
      setTableData(data.rows || []);
    } catch (err) {
      console.error('Error loading table data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load table data');
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
          <h1 className="text-2xl font-semibold">{tableName}</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <TableComponent
          data={tableData}
          pageSize={50}
          tableName={tableName}
          onRefresh={loadTableData}
        />
      )}
    </div>
  );
};

export default ExternalTableView; 