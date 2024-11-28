import React from 'react';
import { useCanvasStore } from '../../../../store/useCanvasStore';
import { useCanvasesStore } from '../../../../store/useCanvasesStore';
import ColorPicker from '../../../common/ColorPicker';

interface TextPropertiesProps {
  component: any;
}

const TextProperties: React.FC<TextPropertiesProps> = ({ component }) => {
  const { selectedComponent, updateComponentProperties } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          value={component.properties.content || ''}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            content: e.target.value,
          })}
          className="w-full border rounded-lg px-3 py-2"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Size (px)
        </label>
        <input
          type="number"
          value={component.properties.fontSize || 16}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            fontSize: parseInt(e.target.value),
          })}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Family
        </label>
        <select
          value={component.properties.fontFamily || 'sans-serif'}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            fontFamily: e.target.value,
          })}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="sans-serif">Sans Serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bold
        </label>
        <input
          type="checkbox"
          checked={component.properties.bold || false}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            bold: e.target.checked,
          })}
          className="rounded border-gray-300"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <ColorPicker
          color={component.properties.color || '#000000'}
          onChange={(color) => updateComponentProperties(currentCanvasId, selectedComponent, {
            color,
          })}
        />
      </div>
    </div>
  );
};

export default TextProperties;