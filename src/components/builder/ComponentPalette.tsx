import React from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Table2, BarChart3, Type, Layout, Square, FileText, Image, Map } from 'lucide-react';

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
      className={`flex items-center gap-2 p-3 bg-white rounded-lg cursor-move border ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

const ComponentPalette = () => {
  const components = [
    { type: 'table', icon: <Table2 className="h-5 w-5" />, label: 'Table' },
    { type: 'chart', icon: <BarChart3 className="h-5 w-5" />, label: 'Chart' },
    { type: 'text', icon: <Type className="h-5 w-5" />, label: 'Text' },
    { type: 'scorecard', icon: <Layout className="h-5 w-5" />, label: 'Scorecard' },
    { type: 'button', icon: <Square className="h-5 w-5" />, label: 'Button' },
    { type: 'pdf', icon: <FileText className="h-5 w-5" />, label: 'PDF Viewer' },
    { type: 'image', icon: <Image className="h-5 w-5" />, label: 'Image' },
    { type: 'map', icon: <Map className="h-5 w-5" />, label: 'Map' },
  ];

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      <div className="space-y-2">
        {components.map((component) => (
          <DraggableComponent key={component.type} {...component} />
        ))}
      </div>
    </div>
  );
};

export default ComponentPalette;