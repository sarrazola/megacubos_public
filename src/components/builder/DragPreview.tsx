import React from 'react';
import DraggableComponent from './DraggableComponent';

interface DragPreviewProps {
  component: any;
  currentOffset: { x: number; y: number };
  isDraggingExisting?: boolean;
}

const DragPreview: React.FC<DragPreviewProps> = ({ component, currentOffset, isDraggingExisting }) => {
  const previewComponent = {
    ...component,
    isMoving: isDraggingExisting
  };

  return (
    <div
      className="drag-preview"
      data-is-moving={isDraggingExisting}
      style={{
        position: 'fixed',
        left: currentOffset.x,
        top: currentOffset.y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <DraggableComponent
        component={previewComponent}
        isEditorMode={true}
        isPreview={true}
      />
    </div>
  );
};

export default DragPreview; 