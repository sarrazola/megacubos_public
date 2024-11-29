import React from 'react';
import { useDrag } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useCanvasesStore } from '../../store/useCanvasesStore';
import { GripVertical, TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  PieChart, Pie,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer
} from 'recharts';
import ComponentActions from './ComponentActions';
import PDFViewer from './PDFViewer';
import TableComponent from './TableComponent';
import ImageComponent from './ImageComponent';
import 'react-resizable/css/styles.css';

interface DraggableComponentProps {
  component: any;
  isEditorMode: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DraggableComponent: React.FC<DraggableComponentProps> = ({ component, isEditorMode }) => {
  const { selectComponent, selectedComponent, updateComponentSize, updateComponentPosition } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MOVE_COMPONENT',
    item: { id: component.id, type: component.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleDragStop = (e: React.DragEvent) => {
    const canvasRect = document.getElementById('canvas')?.getBoundingClientRect();
    if (canvasRect) {
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      updateComponentPosition(currentCanvasId, component.id, { x, y });
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const renderChart = () => {
    const { visualization = 'line', data = [], xAxis = 'name', yAxis = 'value', strokeWidth = 2 } = component.properties;
    const width = component.size.width - 32;
    const height = component.size.height - 64;

    const defaultData = [
      { name: 'Jan', value: 400 },
      { name: 'Feb', value: 300 },
      { name: 'Mar', value: 600 },
      { name: 'Apr', value: 800 },
      { name: 'May', value: 500 }
    ];

    const chartData = data.length > 0 ? data : defaultData;

    switch (visualization) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={yAxis}
                stroke="#8884d8"
                strokeWidth={strokeWidth}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yAxis} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'column':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey={xAxis} type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey={yAxis} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey={yAxis}
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey={yAxis}
                nameKey={xAxis}
                cx="50%"
                cy="50%"
                outerRadius={Math.min(width, height) / 3}
                fill="#8884d8"
                label
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (component.type) {
      case 'table':
        return (
          <TableComponent
            data={component.properties.data || []}
            showActions={component.properties.showActions}
            actionColumnLabel={component.properties.actionColumnLabel}
            actionButtonLabel={component.properties.actionButtonLabel}
            pageSize={component.properties.pageSize}
          />
        );

      case 'chart':
        return (
          <div style={{ width: '100%', height: component.size.height - 80 }}>
            {renderChart()}
          </div>
        );

      case 'text':
        return (
          <p
            style={{
              color: component.properties.color || '#000000',
              fontSize: `${component.properties.fontSize || 16}px`,
              fontWeight: component.properties.bold ? 'bold' : 'normal',
              fontFamily: component.properties.fontFamily || 'sans-serif',
            }}
          >
            {component.properties.content || 'Text Component'}
          </p>
        );

      case 'button':
        return (
          <a
            href={component.properties.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block px-4 py-2 rounded-lg ${
              isEditorMode ? 'hover:opacity-80' : ''
            }`}
            style={{
              backgroundColor: component.properties.backgroundColor || '#3b82f6',
              color: component.properties.textColor || '#ffffff',
            }}
          >
            {component.properties.label || 'Button'}
          </a>
        );

      case 'scorecard':
        const metricChange = parseFloat(component.properties.change || '0');
        const isPositive = metricChange >= 0;
        
        return (
          <div className={`flex items-center justify-between p-4 bg-white rounded-lg ${!isEditorMode ? 'shadow-lg' : ''}`}>
            <div>
              <p className="text-sm text-gray-500">{component.properties.label || 'Metric'}</p>
              <p className="text-2xl font-semibold mt-1">{component.properties.value || '0'}</p>
              {component.properties.showComparison && (
                <div className={`flex items-center gap-1 mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm font-medium">{Math.abs(metricChange)}%</span>
                </div>
              )}
            </div>
            {component.properties.icon && (
              <div className={`p-2 rounded-lg ${component.properties.iconBackground || 'bg-blue-100'}`}>
                {component.properties.icon}
              </div>
            )}
          </div>
        );

      case 'pdf':
        return (
          <PDFViewer url={component.properties.url || ''} />
        );

      case 'image':
        return (
          <ImageComponent
            url={component.properties.url}
            alt={component.properties.alt}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: component.position.x,
        top: component.position.y,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        opacity: isDragging ? 0.5 : 1,
        transition: 'transform 0.2s, opacity 0.2s',
      }}
      onDragEnd={handleDragStop}
      onClick={() => isEditorMode && selectComponent(component.id)}
    >
      <ResizableBox
        width={component.size.width}
        height={component.size.height}
        onResize={(e, { size }) => {
          e.stopPropagation();
          updateComponentSize(currentCanvasId, component.id, { width: size.width, height: size.height });
        }}
        minConstraints={[200, component.type === 'scorecard' ? 120 : 100]}
        maxConstraints={[800, 600]}
        className="canvas-component"
        handle={<div className="react-resizable-handle" />}
      >
        <div
          className={`relative w-full h-full ${
            isEditorMode ? 'bg-white rounded-lg shadow-lg' : ''
          } ${selectedComponent === component.id ? 'ring-2 ring-blue-500' : ''}`}
        >
          {isEditorMode && (
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-2 border-b">
              <div ref={drag} className="drag-handle flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 capitalize">{component.type}</span>
              </div>
              <ComponentActions componentId={component.id} stopPropagation={stopPropagation} />
            </div>
          )}
          <div className={`component-content ${isEditorMode ? 'p-4 pt-12' : 'p-4'}`}>
            {renderContent()}
          </div>
        </div>
      </ResizableBox>
    </div>
  );
};

export default DraggableComponent;