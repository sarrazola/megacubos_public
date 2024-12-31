import React, { useState } from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Table2, BarChart3, Type, Layout, Square, FileText, Image, Map, ChevronRight, Calendar } from 'lucide-react';

interface DraggableComponentProps {
  type: string;
  icon: React.ReactNode;
  label: string;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ type, icon, label }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'COMPONENT',
    item: (monitor) => {
      const offset = monitor.getClientOffset();
      return {
        type,
        initialOffset: offset,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <div
      ref={drag}
      className={`flex items-center gap-1.5 p-3 bg-white rounded-lg cursor-move border text-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </div>
  );
};

const ComponentPalette = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const components = [
    { type: 'table', icon: <Table2 className="h-4 w-4" />, label: 'Table' },
    { type: 'chart', icon: <BarChart3 className="h-4 w-4" />, label: 'Chart' },
    { type: 'text', icon: <Type className="h-4 w-4" />, label: 'Text' },
    { type: 'scorecard', icon: <Layout className="h-4 w-4" />, label: 'Scorecard' },
    { type: 'button', icon: <Square className="h-4 w-4" />, label: 'Button' },
    { type: 'pdf', icon: <FileText className="h-4 w-4" />, label: 'PDF' },
    { type: 'image', icon: <Image className="h-4 w-4" />, label: 'Image' },
    { type: 'map', icon: <Map className="h-4 w-4" />, label: 'Map' },
    { type: 'calendar', icon: <Calendar className="h-4 w-4" />, label: 'Calendar' },
  ];

  return (
    <>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="md:hidden fixed top-4 right-4 z-30 p-2 bg-white rounded-lg shadow-lg"
      >
        <ChevronRight className={`h-4 w-4 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      <div className={`
        fixed right-0 top-0 h-screen bg-gray-50 z-20
        transition-transform duration-300 ease-in-out
        ${isCollapsed ? 'translate-x-full' : 'translate-x-0'}
        md:translate-x-0 md:relative md:h-auto md:shadow-none
        w-32
      `}>
        <div className="p-0">
          <h2 className="text-lg font-semibold mb-3 px-1">Components</h2>
          <div className="space-y-1">
            {components.map((component) => (
              <DraggableComponent key={component.type} {...component} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ComponentPalette;