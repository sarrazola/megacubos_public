import React from 'react';
import { useDragLayer } from 'react-dnd';
import DragPreview from './DragPreview';

const CustomDragLayer = () => {
  const { itemType, isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 100,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%'
    }}>
      <div style={{
        position: 'absolute',
        left: currentOffset.x,
        top: currentOffset.y,
        transform: 'none',
        opacity: 0.8,
      }}>
        <DragPreview
          component={item}
          currentOffset={currentOffset}
          isDraggingExisting={itemType === 'MOVE_COMPONENT'}
        />
      </div>
    </div>
  );
};

export default CustomDragLayer; 