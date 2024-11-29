import React from 'react';
import { useDragLayer } from 'react-dnd';
import DragPreview from './DragPreview';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useCanvasesStore } from '../../store/useCanvasesStore';

const CustomDragLayer = () => {
  const { itemType, isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  const { components } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();

  if (!isDragging || !currentOffset) {
    return null;
  }

  let previewComponent;
  const isDraggingExisting = itemType === 'MOVE_COMPONENT';

  if (isDraggingExisting) {
    const component = components[currentCanvasId]?.find(comp => comp.id === item.id);
    if (component) {
      previewComponent = {
        ...component,
        position: { x: 0, y: 0 },
      };
    }
  } else {
    previewComponent = {
      id: 'preview',
      type: item.type,
      position: { x: 0, y: 0 },
      size: { width: 400, height: item.type === 'scorecard' ? 120 : 300 },
      properties: {}
    };
  }

  if (!previewComponent) return null;

  return (
    <DragPreview
      component={previewComponent}
      currentOffset={currentOffset}
      isDraggingExisting={isDraggingExisting}
    />
  );
};

export default CustomDragLayer; 