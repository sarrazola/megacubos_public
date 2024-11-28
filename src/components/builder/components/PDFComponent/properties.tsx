import React from 'react';
import { useCanvasStore } from '../../../../store/useCanvasStore';
import { useCanvasesStore } from '../../../../store/useCanvasesStore';

interface PDFPropertiesProps {
  component: any;
}

const PDFProperties: React.FC<PDFPropertiesProps> = ({ component }) => {
  const { selectedComponent, updateComponentProperties } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          PDF URL
        </label>
        <input
          type="url"
          value={component.properties.url || ''}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            url: e.target.value,
          })}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="https://example.com/document.pdf"
        />
      </div>
    </div>
  );
};

export default PDFProperties;