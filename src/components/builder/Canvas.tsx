import React from 'react';
import { useDrop } from 'react-dnd';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useCanvasesStore } from '../../store/useCanvasesStore';
import DraggableComponent from './DraggableComponent';

const Canvas: React.FC<{ isEditorMode: boolean }> = ({ isEditorMode }) => {
  const { currentCanvasId } = useCanvasesStore();
  const { components, addComponent, updateComponentPosition } = useCanvasStore();
  const currentComponents = components[currentCanvasId] || [];

  const getDefaultProperties = (type: string) => {
    switch (type) {
      case 'table':
        return {
          data: [
            { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' }
          ],
          showActions: true,
          actionButtonLabel: 'View',
          actionColumnLabel: 'Actions',
          pageSize: 5
        };
      case 'chart':
        return {
          data: [
            { name: 'Jan', value: 400 },
            { name: 'Feb', value: 300 },
            { name: 'Mar', value: 600 },
            { name: 'Apr', value: 800 },
            { name: 'May', value: 500 }
          ],
          xAxis: 'name',
          yAxis: 'value',
          strokeWidth: 2,
          visualization: 'line'
        };
      case 'text':
        return {
          content: 'Sample Text',
          fontSize: 16,
          color: '#000000',
          fontFamily: 'sans-serif',
          bold: false
        };
      case 'button':
        return {
          label: 'Click Me',
          url: '#',
          backgroundColor: '#3b82f6',
          textColor: '#ffffff'
        };
      case 'scorecard':
        return {
          label: 'Total Revenue',
          value: '$12,345',
          showComparison: true,
          change: '+12.5',
          iconBackground: '#EBF5FF',
          selectedIcon: 'dollar'
        };
      case 'pdf':
        return {
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        };
      case 'image':
        return {
          url: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?ixid=2yJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1200&h=800&q=80',
          alt: 'Sample Image'
        };
      default:
        return {};
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['COMPONENT', 'MOVE_COMPONENT'],
    drop: (item: { id?: string; type: string }, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        const canvasRect = document.getElementById('canvas')?.getBoundingClientRect();
        if (canvasRect) {
          const x = offset.x - canvasRect.left;
          const y = offset.y - canvasRect.top;
          
          if (item.id) {
            updateComponentPosition(currentCanvasId, item.id, { x, y });
          } else {
            addComponent(currentCanvasId, {
              id: `${item.type}-${Date.now()}`,
              type: item.type,
              position: { x, y },
              size: { width: 400, height: item.type === 'scorecard' ? 120 : 300 },
              properties: getDefaultProperties(item.type)
            });
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [currentCanvasId]);

  return (
    <div
      id="canvas"
      ref={drop}
      className={`relative bg-gray-100 rounded-lg overflow-auto ${
        isOver ? 'border-2 border-blue-400' : 'border-2 border-transparent'
      } ${isEditorMode ? 'editor-mode' : ''}`}
      style={{ height: 'calc(100vh - 6rem)' }}
    >
      {currentComponents.map((component) => (
        <DraggableComponent key={component.id} component={component} isEditorMode={isEditorMode} />
      ))}
      {currentComponents.length === 0 && isEditorMode && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Drag and drop components here
        </div>
      )}
    </div>
  );
};

export default Canvas;