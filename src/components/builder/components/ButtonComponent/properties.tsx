import React from 'react';
import { useCanvasStore } from '../../../../store/useCanvasStore';
import { useCanvasesStore } from '../../../../store/useCanvasesStore';
import ColorPicker from '../../../common/ColorPicker';

interface ButtonPropertiesProps {
  component: any;
}

const ButtonProperties: React.FC<ButtonPropertiesProps> = ({ component }) => {
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
          URL
        </label>
        <input
          type="url"
          value={component.properties.url || ''}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            url: e.target.value,
          })}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="https://example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Background Color
        </label>
        <ColorPicker
          color={component.properties.backgroundColor || '#3b82f6'}
          onChange={(color) => updateComponentProperties(currentCanvasId, selectedComponent, {
            backgroundColor: color,
          })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Text Color
        </label>
        <ColorPicker
          color={component.properties.textColor || '#ffffff'}
          onChange={(color) => updateComponentProperties(currentCanvasId, selectedComponent, {
            textColor: color,
          })}
        />
      </div>
    </div>
  );
};

export default ButtonProperties;