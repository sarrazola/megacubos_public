import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useCanvasesStore } from '../../store/useCanvasesStore';
import DraggableComponent from './DraggableComponent';
import { getDefaultSize } from '../../utils/componentSizes';

const getDefaultProperties = (type: string) => {
  switch (type) {
    case 'chart':
      return {
        visualization: 'line',
        data: [
          { name: 'Jan', value: 400 },
          { name: 'Feb', value: 300 },
          { name: 'Mar', value: 600 },
          { name: 'Apr', value: 800 },
          { name: 'May', value: 500 }
        ],
        xAxis: 'name',
        yAxis: 'value',
        strokeWidth: 2
      };
    case 'scorecard':
      return {
        label: 'Total Revenue',
        value: '$50,000',
        change: '12.5',
        showComparison: true,
        selectedIcon: 'dollar',
        iconBackground: '#93C5FD'
      };
    case 'table':
      return {
        data: [
          { id: 1, name: 'Product A', price: 100 },
          { id: 2, name: 'Product B', price: 200 },
          { id: 3, name: 'Product C', price: 300 }
        ],
        dataSource: 'json'
      };
    case 'map':
      return {
        latitude: 19.427040,  // Angel de la Independencia latitude
        longitude: -99.167654 // Angel de la Independencia longitude
      };
    default:
      return {};
  }
};

const Canvas: React.FC<{ isEditorMode: boolean }> = ({ isEditorMode }) => {
  const { currentCanvasId } = useCanvasesStore();
  const components = useCanvasStore((state) => state.components[currentCanvasId] || []);
  const addComponent = useCanvasStore((state) => state.addComponent);
  const updateComponentPosition = useCanvasStore((state) => state.updateComponentPosition);
  const selectComponent = useCanvasStore((state) => state.selectComponent);
  const initializeCanvas = useCanvasStore((state) => state.initializeCanvas);

  useEffect(() => {
    if (currentCanvasId) {
      initializeCanvas(currentCanvasId);
    }
  }, [currentCanvasId, initializeCanvas]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['COMPONENT', 'MOVE_COMPONENT'],
    drop: (item: { type: string; id?: string }, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset || !currentCanvasId) return;

      const dropTarget = document.getElementById('canvas-drop-target');
      const dropTargetRect = dropTarget?.getBoundingClientRect();
      
      if (!dropTargetRect) return;

      const position = {
        x: offset.x - dropTargetRect.left,
        y: offset.y - dropTargetRect.top,
      };

      if (item.id) {
        // Moving existing component
        updateComponentPosition(currentCanvasId, item.id, position);
      } else {
        // Adding new component
        const newComponent = {
          id: crypto.randomUUID(),
          type: item.type,
          position,
          size: getDefaultSize(item.type),
          properties: getDefaultProperties(item.type),
        };
        addComponent(currentCanvasId, newComponent);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [currentCanvasId, addComponent, updateComponentPosition]);

  return (
    <div
      id="canvas-drop-target"
      ref={drop}
      className={`relative w-full h-[calc(100vh-4rem)] border-2 rounded-lg ${
        isOver ? 'border-blue-500' : 'border-gray-200'
      } bg-gray-50`}
    >
      {components.length === 0 && isEditorMode && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400 text-lg">
            Drag and drop components here to build your dashboard
          </p>
        </div>
      )}
      {components.map((component) => (
        <DraggableComponent
          key={component.id}
          component={component}
          isEditorMode={isEditorMode}
          onClick={() => selectComponent(component.id)}
        />
      ))}
    </div>
  );
};

export default Canvas;