import React from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Table2, BarChart3, Type, Layout, Square, FileText, Image } from 'lucide-react';

interface DraggableComponentProps {
  type: string;
  icon: React.ReactNode;
  label: string;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ type, icon, label }) => {
  const getInitialData = (type: string) => {
    switch (type) {
      case 'table':
        return {
          data: [
            {
              "id": 1,
              "name": "John Doe",
              "email": "john@example.com",
              "status": "Active"
            },
            {
              "id": 2,
              "name": "Jane Smith",
              "email": "jane@example.com",
              "status": "Inactive"
            },
            {
              "id": 3,
              "name": "Bob Johnson",
              "email": "bob@example.com",
              "status": "Active"
            }
          ],
          showActions: true,
          actionColumnLabel: 'Actions',
          actionButtonLabel: 'View'
        };
      case 'chart':
        return {
          data: [
            {
              "name": "Jan",
              "value": 400
            },
            {
              "name": "Feb",
              "value": 300
            },
            {
              "name": "Mar",
              "value": 600
            },
            {
              "name": "Apr",
              "value": 800
            },
            {
              "name": "May",
              "value": 500
            }
          ],
          chartType: 'line'
        };
      case 'text':
        return { text: 'Sample text content' };
      case 'scorecard':
        return { 
          label: 'Total Revenue',
          value: '$50,000',
          comparison: 12.5
        };
      case 'button':
        return {
          label: 'Click me',
          url: '#',
          backgroundColor: '#3b82f6',
          textColor: '#ffffff'
        };
      case 'pdf':
        return { url: 'https://example.com/sample.pdf' };
      case 'image':
        return { 
          url: 'https://via.placeholder.com/400x300',
          alt: 'Sample image'
        };
      default:
        return {};
    }
  };

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'COMPONENT',
    item: {
      type,
      properties: getInitialData(type)
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