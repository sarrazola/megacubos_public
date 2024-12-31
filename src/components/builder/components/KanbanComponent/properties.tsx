import React, { useState, useEffect } from 'react';
import { useCanvasStore } from '../../../../store/useCanvasStore';
import { useCanvasesStore } from '../../../../store/useCanvasesStore';
import { fetchTables } from '../../../../services/api/database';

interface KanbanPropertiesProps {
  component: any;
}

const KanbanProperties: React.FC<KanbanPropertiesProps> = ({ component }) => {
  const { selectedComponent, updateComponentProperties } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();
  const [dataSource, setDataSource] = useState(component.properties.dataSource || 'json');
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);

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

  // Example default data for a sales pipeline
  const defaultData = [
    {
      id: 1,
      name: 'Acme Corp Deal',
      description: 'Enterprise software license',
      status: 'Lead',
      value: 50000,
      contact: 'John Doe'
    },
    {
      id: 2,
      name: 'TechStart Project',
      description: 'Custom development project',
      status: 'Negotiation',
      value: 25000,
      contact: 'Jane Smith'
    },
    {
      id: 3,
      name: 'Global Systems Contract',
      description: 'Annual maintenance contract',
      status: 'Proposal',
      value: 75000,
      contact: 'Mike Johnson'
    }
  ];

  return (
    <div className="space-y-4">
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Column Field (Status)
        </label>
        <select
          value={component.properties.columnField || 'status'}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            columnField: e.target.value
          })}
          className="w-full border rounded-lg px-3 py-2"
        >
          {Object.keys(defaultData[0]).map(field => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title Field
        </label>
        <select
          value={component.properties.titleField || 'name'}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            titleField: e.target.value
          })}
          className="w-full border rounded-lg px-3 py-2"
        >
          {Object.keys(defaultData[0]).map(field => (
            <option key={field} value={field}>
              {field}
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
            value={JSON.stringify(component.properties.data || defaultData, null, 2)}
            onChange={(e) => {
              try {
                const data = JSON.parse(e.target.value);
                updateComponentProperties(currentCanvasId, selectedComponent, { data });
              } catch (error) {
                // Invalid JSON, ignore
              }
            }}
            className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
            rows={10}
          />
        </div>
      )}
    </div>
  );
};

export default KanbanProperties; 