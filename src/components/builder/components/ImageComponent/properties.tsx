import React from 'react';
import { useCanvasStore } from '../../../../store/useCanvasStore';
import { useCanvasesStore } from '../../../../store/useCanvasesStore';

interface ImagePropertiesProps {
  component: any;
}

const ImageProperties: React.FC<ImagePropertiesProps> = ({ component }) => {
  const { selectedComponent, updateComponentProperties } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          type="url"
          value={component.properties.url || ''}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            url: e.target.value,
          })}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alt Text
        </label>
        <input
          type="text"
          value={component.properties.alt || ''}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            alt: e.target.value,
          })}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Image description"
        />
      </div>
    </div>
  );
};

export default ImageProperties;