import React, { useState, useEffect } from 'react';
import { useCanvasStore } from '../../../../store/useCanvasStore';
import { useCanvasesStore } from '../../../../store/useCanvasesStore';
import { fetchProducts } from '../../../../services/api/products';

interface TablePropertiesProps {
  component: any;
}

const TableProperties: React.FC<TablePropertiesProps> = ({ component }) => {
  const { selectedComponent, updateComponentProperties } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();
  const [dataSource, setDataSource] = useState('json');

  useEffect(() => {
    if (dataSource === 'products') {
      loadProducts();
    }
  }, [dataSource]);

  const loadProducts = async () => {
    try {
      const productsData = await fetchProducts();
      updateComponentProperties(currentCanvasId, selectedComponent, {
        data: productsData
      });
    } catch (error) {
      console.error('Error loading products:', error);
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
          value={component.properties.pageSize || 5}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            pageSize: parseInt(e.target.value),
          })}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Show Actions Column
        </label>
        <input
          type="checkbox"
          checked={component.properties.showActions ?? true}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            showActions: e.target.checked,
          })}
          className="rounded border-gray-300"
        />
      </div>
      {component.properties.showActions && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action Button Label
            </label>
            <input
              type="text"
              value={component.properties.actionButtonLabel || 'View'}
              onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
                actionButtonLabel: e.target.value,
              })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="e.g., View, Edit, Delete"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action Column Label
            </label>
            <input
              type="text"
              value={component.properties.actionColumnLabel || 'Actions'}
              onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
                actionColumnLabel: e.target.value,
              })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="e.g., Actions, Options"
            />
          </div>
        </>
      )}
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
          <option value="products">Products</option>
        </select>
      </div>
      {dataSource === 'json' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data
          </label>
          <textarea
            value={JSON.stringify(component.properties.data || [], null, 2)}
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

export default TableProperties;