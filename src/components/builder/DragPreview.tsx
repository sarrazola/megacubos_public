import React from 'react';
import DraggableComponent from './DraggableComponent';

interface DragPreviewProps {
  component: any;
  currentOffset: { x: number; y: number };
  isDraggingExisting?: boolean;
}

const DragPreview: React.FC<DragPreviewProps> = ({ component, currentOffset, isDraggingExisting }) => {
  const previewComponent = isDraggingExisting 
    ? {
        ...component,
        position: { x: 0, y: 0 },
      }
    : {
        id: `preview-${component.type}`,
        type: component.type,
        position: { x: 0, y: 0 },
        size: {
          width: 400,
          height: component.type === 'scorecard' ? 120 : 300
        },
        properties: component.properties || {}
      };

  return (
    <div className="drag-preview" style={{ 
      width: previewComponent.size?.width,
      height: previewComponent.size?.height
    }}>
      <DraggableComponent
        component={previewComponent}
        isEditorMode={true}
        isPreview={true}
      />
    </div>
  );
};

export default DragPreview; 