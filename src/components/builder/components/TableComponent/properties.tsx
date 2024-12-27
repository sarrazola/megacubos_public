import React, { useState, useEffect } from 'react';
import { useCanvasStore } from '../../../../store/useCanvasStore';
import { useCanvasesStore } from '../../../../store/useCanvasesStore';
import { fetchTables } from '../../../../services/api/database';
import { getTableData } from '../../../../services/api/database';

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

  useEffect(() => {
    if (dataSource !== 'json') {
      loadTableData(dataSource);
    } else {
      updateComponentProperties(currentCanvasId, selectedComponent, {
        data: jsonData,
        dataSource: 'json'
      });
    }
  }, [dataSource]);

  const loadTableData = async (tableName: string) => {
    try {
      setLoading(true);
      const tableData = await getTableData(tableName);
      updateComponentProperties(currentCanvasId, selectedComponent, {
        data: tableData,
        dataSource: tableName
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
      updateComponentProperties(currentCanvasId, selectedComponent, { 
        data,
        dataSource: 'json'
      });
    } catch (error) {
      // Invalid JSON, ignore
    }
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
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            pageSize: parseInt(e.target.value),
          })}
          className="w-full border rounded-lg px-3 py-2"
        />
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