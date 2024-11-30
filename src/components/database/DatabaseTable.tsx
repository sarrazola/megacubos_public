import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Plus, Search, Filter, Loader2, Upload } from 'lucide-react';
import { getTableData, addColumnToTable, importCSVData } from '../../services/api/database';
import TableComponent from '../builder/components/TableComponent';
import AddColumnModal from './AddColumnModal';
import ImportCSVModal from './ImportCSVModal';

interface DatabaseTableProps {
  tableName: string;
  onClose: () => void;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const DatabaseTable: React.FC<DatabaseTableProps> = ({ tableName, onClose }) => {
  const [search, setSearch] = useState('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'id',
    direction: 'desc'
  });
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showImportCSV, setShowImportCSV] = useState(false);
  const [tableColumns, setTableColumns] = useState<string[]>([]);

  useEffect(() => {
    loadTableData();
  }, [tableName]);

  const loadTableData = async () => {
    try {
      setIsLoading(true);
      const data = await getTableData(tableName);
      setTableData(data);
    } catch (error) {
      console.error('Error loading table data:', error);
      alert('Failed to load table data');
      setTableData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = tableData.filter(row => 
    Object.values(row).some(value => 
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] === null) return 1;
    if (b[sortConfig.key] === null) return -1;
    
    const aValue = typeof a[sortConfig.key] === 'string' 
      ? a[sortConfig.key].toLowerCase() 
      : a[sortConfig.key];
    const bValue = typeof b[sortConfig.key] === 'string' 
      ? b[sortConfig.key].toLowerCase() 
      : b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleAddColumn = async (columnName: string, columnType: string) => {
    try {
      await addColumnToTable(tableName, columnName, columnType);
      setShowAddColumn(false);
      loadTableData();
    } catch (error) {
      console.error('Error adding column:', error);
      alert('Failed to add column');
    }
  };

  const handleImportCSV = async (mappedData: any[]) => {
    try {
      if (!mappedData.length) {
        throw new Error('No data to import');
      }

      // Validate data before import
      const invalidRows = mappedData.filter(row => 
        Object.values(row).every(value => value === null || value === undefined)
      );

      if (invalidRows.length === mappedData.length) {
        throw new Error('All rows are empty or invalid');
      }

      await importCSVData(tableName, mappedData);
      loadTableData();
    } catch (error: any) {
      console.error('Error importing CSV:', {
        error,
        details: error.details,
        message: error.message,
        hint: error.hint
      });
      
      let errorMessage = 'Failed to import CSV data: ';
      if (error.details) {
        errorMessage += error.details;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Unknown error occurred';
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-10">
      <div className="h-full flex flex-col">
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{tableName}</h2>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Close
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add Row
            </button>
            <button 
              onClick={() => setShowImportCSV(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
            >
              <Upload className="h-4 w-4" />
              Import CSV
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <TableComponent
              data={sortedData}
              showActions={true}
              actionButtonLabel="Edit"
              pageSize={10}
              onAddColumn={() => setShowAddColumn(true)}
              tableName={tableName}
              onRefresh={loadTableData}
            />
          )}
        </div>

        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <button
            onClick={() => setShowAddColumn(true)}
            className="text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </th>
      </div>

      {showAddColumn && (
        <AddColumnModal
          onClose={() => setShowAddColumn(false)}
          onSubmit={handleAddColumn}
        />
      )}

      {showImportCSV && (
        <ImportCSVModal
          onClose={() => setShowImportCSV(false)}
          tableName={tableName}
          onImport={handleImportCSV}
          tableColumns={Object.keys(sortedData[0] || {})}
        />
      )}
    </div>
  );
};

export default DatabaseTable;
