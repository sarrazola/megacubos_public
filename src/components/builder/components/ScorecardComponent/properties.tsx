import React from 'react';
import { useCanvasStore } from '../../../../store/useCanvasStore';
import { useCanvasesStore } from '../../../../store/useCanvasesStore';
import ColorPicker from '../../../common/ColorPicker';

interface ScorecardPropertiesProps {
  component: any;
}

const ScorecardProperties: React.FC<ScorecardPropertiesProps> = ({ component }) => {
  const { selectedComponent, updateComponentProperties } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Label
        </label>
        <input
          type="text"
          value={component.properties.label || ''}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            label: e.target.value,
          })}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Value
        </label>
        <input
          type="text"
          value={component.properties.value || ''}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            value: e.target.value,
          })}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Show Comparison
        </label>
        <input
          type="checkbox"
          checked={component.properties.showComparison || false}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            showComparison: e.target.checked,
          })}
          className="rounded border-gray-300"
        />
      </div>
      {component.properties.showComparison && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Change Percentage
          </label>
          <input
            type="number"
            value={component.properties.change || '0'}
            onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
              change: e.target.value,
            })}
            className="w-full border rounded-lg px-3 py-2"
            step="0.1"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Icon Background
        </label>
        <ColorPicker
          color={component.properties.iconBackground || '#EBF5FF'}
          onChange={(color) => updateComponentProperties(currentCanvasId, selectedComponent, {
            iconBackground: color,
          })}
        />
      </div>
    </div>
  );
};

export default ScorecardProperties;