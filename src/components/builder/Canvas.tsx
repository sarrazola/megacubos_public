import React, { useEffect, useState } from 'react';
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
    case 'calendar':
      return {
        events: [],
        viewType: 'day'
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentCanvasId) {
      initializeCanvas(currentCanvasId).catch(err => {
        console.error('Failed to initialize canvas:', err);
        setError('Failed to load canvas components. Please try again later.');
      });
    }
  }, [currentCanvasId, initializeCanvas]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

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
          <div className="text-center space-y-6">
            {/* Animated Illustration */}
            <div className="relative w-48 h-48 mx-auto">
              {/* Component being dragged */}
              <div className="absolute w-24 h-24 bg-blue-100 rounded-lg border-2 border-blue-300 shadow-lg animate-floating">
                <div className="h-full flex items-center justify-center">
                  <div className="w-16 h-3 bg-blue-300 rounded" />
                </div>
              </div>
              
              {/* Mouse cursor */}
              <div className="absolute w-6 h-6 animate-cursor">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M4 4L12 20L15 13L22 10L4 4Z" 
                    fill="#4B5563"
                    stroke="#4B5563"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              
              {/* Target drop area indication */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-32 border-4 border-dashed border-gray-300 rounded-lg animate-pulse" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Start Building Your Dashboard
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Drag and drop components from the left panel to create your custom dashboard
              </p>
            </div>
          </div>
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