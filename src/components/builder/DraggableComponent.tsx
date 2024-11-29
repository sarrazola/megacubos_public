import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { ResizableBox } from 'react-resizable';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useCanvasesStore } from '../../store/useCanvasesStore';
import ComponentActions from './ComponentActions';
import PDFViewer from './PDFViewer';
import TableComponent from './TableComponent';
import ImageComponent from './ImageComponent';
import { GripVertical, TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';
import 'react-resizable/css/styles.css';

interface DraggableComponentProps {
  component: any;
  isEditorMode: boolean;
  isPreview?: boolean;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ component, isEditorMode, isPreview }) => {
  const { selectComponent, selectedComponent, updateComponentSize, updateComponentPosition } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();

  const isSelected = selectedComponent === component.id;

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'MOVE_COMPONENT',
    item: () => ({
      id: component.id,
      type: component.type,
      position: component.position,
      size: component.size,
      properties: component.properties,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [component.id, component.position, component.size, component.properties]);

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const handleResize = (e: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
    e.stopPropagation();
    if (isEditorMode && !isPreview) {
      updateComponentSize(currentCanvasId, component.id, {
        width: Math.round(size.width),
        height: Math.round(size.height)
      });
    }
  };

  const renderChart = (data: any[] = [], chartType: string = 'line') => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    const properties = component.properties || {};
    
    switch (component.type) {
      case 'table':
        return (
          <TableComponent
            data={properties.data || []}
            showActions={properties.showActions}
            actionColumnLabel={properties.actionColumnLabel}
            actionButtonLabel={properties.actionButtonLabel}
            pageSize={properties.pageSize}
          />
        );

      case 'chart':
        return (
          <div style={{ width: '100%', height: '100%' }}>
            {renderChart(properties.data || [], properties.chartType || 'line')}
          </div>
        );

      case 'text':
        return (
          <div className="p-4">
            <p>{properties.text || 'Text content'}</p>
          </div>
        );

      case 'scorecard':
        return (
          <div className="h-full flex items-center justify-between p-4 bg-white rounded-lg">
            <div>
              <h3 className="text-lg font-semibold">{properties.label || 'Metric'}</h3>
              <p className="text-3xl font-bold mt-1">{properties.value || '0'}</p>
            </div>
            {properties.comparison !== undefined && (
              <div className={`flex items-center ${
                properties.comparison >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {properties.comparison >= 0 ? <TrendingUp /> : <TrendingDown />}
                <span className="ml-1">{Math.abs(properties.comparison)}%</span>
              </div>
            )}
          </div>
        );

      case 'button':
        return (
          <a
            href={properties.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block px-4 py-2 rounded-lg ${
              isEditorMode ? 'pointer-events-none' : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: properties.backgroundColor || '#3b82f6',
              color: properties.textColor || '#ffffff',
            }}
            onClick={(e) => {
              if (isEditorMode) {
                e.preventDefault();
              }
            }}
          >
            {properties.label || 'Button'}
          </a>
        );

      case 'pdf':
        return (
          <PDFViewer url={properties.url || ''} />
        );

      case 'image':
        return (
          <ImageComponent
            url={properties.url || ''}
            alt={properties.alt || ''}
          />
        );

      default:
        return null;
    }
  };

  const dragHandleRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      className={`absolute ${isDragging ? 'opacity-0' : ''}`}
      style={{
        left: component.position.x,
        top: component.position.y,
        width: component.size.width,
        height: component.size.height,
        zIndex: isSelected ? 10 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (isEditorMode) {
          selectComponent(component.id);
        }
      }}
    >
      {isEditorMode && !isPreview ? (
        <ResizableBox
          width={component.size.width}
          height={component.size.height}
          onResize={handleResize}
          minConstraints={[100, 100]}
          maxConstraints={[2000, 2000]}
          resizeHandles={['se']}
          handle={<div className="react-resizable-handle react-resizable-handle-se" />}
          axis="both"
          draggableOpts={{ 
            enableUserSelectHack: false,
            grid: [1, 1]
          }}
        >
          <div
            className={`relative bg-white rounded-lg shadow-sm border ${
              isSelected ? 'border-blue-500' : 'border-gray-200'
            }`}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {isEditorMode && !isPreview && (
              <div 
                className="component-header absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-2 py-1 bg-gray-50 rounded-t-lg"
              >
                <div 
                  ref={drag} 
                  className="flex items-center gap-2 drag-handle"
                >
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{component.type}</span>
                </div>
                <ComponentActions
                  componentId={component.id}
                  stopPropagation={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <div className="component-content" style={{
              flex: 1,
              overflow: 'auto',
              height: '100%',
              position: 'relative',
              marginTop: isEditorMode && !isPreview ? '32px' : '0',
              paddingTop: '4px'
            }}>
              {renderContent()}
            </div>
          </div>
        </ResizableBox>
      ) : (
        <div
          className="relative bg-white rounded-lg shadow-sm border border-gray-200"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="component-content" style={{
            flex: 1,
            overflow: 'auto',
            height: '100%',
            position: 'relative',
            marginTop: isEditorMode && !isPreview ? '32px' : '0',
            paddingTop: '4px'
          }}>
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DraggableComponent;