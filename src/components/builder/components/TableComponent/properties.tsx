import React, { useState, useEffect } from 'react';
import { useCanvasStore } from '../../../../store/useCanvasStore';
import { useCanvasesStore } from '../../../../store/useCanvasesStore';
import { fetchTables } from '../../../../services/api/database';
import { getTableData } from '../../../../services/api/database';
import { Eye, EyeOff } from 'lucide-react';

interface TablePropertiesProps {
  component: any;
}

const TableProperties: React.FC<TablePropertiesProps> = ({ component }) => {
  const { selectedComponent, updateComponentProperties } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();
  const [dataSource, setDataSource] = useState(component.properties.dataSource || 'json');
  const [jsonData, setJsonData] = useState(component.properties.data || []);
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize column visibility from properties or default all to visible
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    if (component.properties.columnVisibility) {
      return component.properties.columnVisibility;
    }
    const initialVisibility: Record<string, boolean> = {};
    if (component.properties.data?.[0]) {
      Object.keys(component.properties.data[0]).forEach(column => {
        initialVisibility[column] = true;
      });
    }
    return initialVisibility;
  });

  useEffect(() => {
    loadAvailableTables();
  }, []);

  const loadAvailableTables = async () => {
    try {
      const tables = await fetchTables();
      setAvailableTables(tables);
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  const updateProperties = (updates: Record<string, any>) => {
    if (!selectedComponent || !currentCanvasId) return;
    updateComponentProperties(currentCanvasId, selectedComponent, updates);
  };

  useEffect(() => {
    if (dataSource !== 'json') {
      loadTableData(dataSource);
    } else {
      updateProperties({
        data: jsonData,
        dataSource: 'json',
        columnVisibility
      });
    }
  }, [dataSource]);

  const loadTableData = async (tableName: string) => {
    try {
      setLoading(true);
      const tableData = await getTableData(tableName);
      
      // Initialize visibility for new columns
      const newColumnVisibility = { ...columnVisibility };
      Object.keys(tableData[0] || {}).forEach(column => {
        if (newColumnVisibility[column] === undefined) {
          newColumnVisibility[column] = true;
        }
      });
      setColumnVisibility(newColumnVisibility);

      updateProperties({
        data: tableData,
        dataSource: tableName,
        columnVisibility: newColumnVisibility
      });
    } catch (error) {
      console.error('Error loading table data:', error);
      setDataSource('json');
    } finally {
      setLoading(false);
    }
  };

  const handleJsonDataChange = (value: string) => {
    try {
      const data = JSON.parse(value);
      setJsonData(data);
      
      // Initialize visibility for new columns
      const newColumnVisibility = { ...columnVisibility };
      Object.keys(data[0] || {}).forEach(column => {
        if (newColumnVisibility[column] === undefined) {
          newColumnVisibility[column] = true;
        }
      });
      setColumnVisibility(newColumnVisibility);

      updateProperties({ 
        data,
        dataSource: 'json',
        columnVisibility: newColumnVisibility
      });
    } catch (error) {
      // Invalid JSON, ignore
    }
  };

  const toggleColumnVisibility = (columnName: string) => {
    const newColumnVisibility = {
      ...columnVisibility,
      [columnName]: !columnVisibility[columnName]
    };
    setColumnVisibility(newColumnVisibility);
    updateProperties({
      columnVisibility: newColumnVisibility
    });
  };

  const getColumnNames = () => {
    if (component.properties.data?.[0]) {
      return Object.keys(component.properties.data[0]);
    }
    return [];
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Page Size
        </label>
        <input
          type="number"
          value={component.properties.pageSize || 50}
          onChange={(e) => updateProperties({
            pageSize: parseInt(e.target.value),
          })}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Column Visibility
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {getColumnNames().map(columnName => (
            <div key={columnName} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">
                {columnName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <button
                onClick={() => toggleColumnVisibility(columnName)}
                className={`p-1 rounded-lg ${columnVisibility[columnName] ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400 hover:text-gray-500'}`}
              >
                {columnVisibility[columnName] ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data Source
        </label>
        <select
          value={dataSource}
          onChange={(e) => setDataSource(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="json">JSON Data</option>
          {availableTables.map(table => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>
      {dataSource === 'json' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data
          </label>
          <textarea
            value={JSON.stringify(jsonData, null, 2)}
            onChange={(e) => handleJsonDataChange(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
            rows={10}
          />
        </div>
      )}
      {loading && (
        <div className="text-sm text-gray-500">
          Loading table data...
        </div>
      )}
    </div>
  );
};

export default TableProperties;