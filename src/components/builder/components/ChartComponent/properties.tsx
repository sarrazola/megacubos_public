import React from 'react';
import { useCanvasStore } from '../../../../store/useCanvasStore';
import { useCanvasesStore } from '../../../../store/useCanvasesStore';

interface ChartPropertiesProps {
  component: any;
}

const ChartProperties: React.FC<ChartPropertiesProps> = ({ component }) => {
  const { selectedComponent, updateComponentProperties } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Visualization
        </label>
        <select
          value={component.properties.visualization || 'line'}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            visualization: e.target.value,
          })}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="column">Column Chart</option>
          <option value="area">Area Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          X-Axis Field
        </label>
        <input
          type="text"
          value={component.properties.xAxis || 'name'}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            xAxis: e.target.value,
          })}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Y-Axis Field
        </label>
        <input
          type="text"
          value={component.properties.yAxis || 'value'}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            yAxis: e.target.value,
          })}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stroke Width
        </label>
        <input
          type="number"
          value={component.properties.strokeWidth || 2}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            strokeWidth: parseInt(e.target.value),
          })}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
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
    </div>
  );
};

export default ChartProperties;