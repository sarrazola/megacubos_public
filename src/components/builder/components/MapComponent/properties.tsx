import React from 'react';
import { useCanvasStore } from '../../../../store/useCanvasStore';
import { useCanvasesStore } from '../../../../store/useCanvasesStore';

interface MapPropertiesProps {
  component: any;
}

const MapProperties: React.FC<MapPropertiesProps> = ({ component }) => {
  const { selectedComponent, updateComponentProperties } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Latitude
        </label>
        <input
          type="number"
          step="0.000001"
          value={component.properties.latitude || 0}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            latitude: parseFloat(e.target.value),
          })}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Longitude
        </label>
        <input
          type="number"
          step="0.000001"
          value={component.properties.longitude || 0}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            longitude: parseFloat(e.target.value),
          })}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
    </div>
  );
};

export default MapProperties; 