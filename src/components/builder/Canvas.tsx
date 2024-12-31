import React, { useEffect, useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useCanvasesStore } from '../../store/useCanvasesStore';
import DraggableComponent from './DraggableComponent';
import { getDefaultSize } from '../../utils/componentSizes';
import { useGuidelinesStore } from '../../store/useGuidelinesStore';
import Guidelines from './Guidelines';

const getDefaultProperties = (type: string) => {
  switch (type) {
    case 'pdf':
      return {
        url: 'https://pdfobject.com/pdf/sample.pdf'
      };
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
    case 'kanban':
      return {
        data: [
          {
            id: 1,
            name: 'Acme Corp Deal',
            description: 'Enterprise software license',
            status: 'Lead',
            value: 50000,
            contact: 'John Doe'
          },
          {
            id: 2,
            name: 'TechStart Project',
            description: 'Custom development project',
            status: 'Negotiation',
            value: 25000,
            contact: 'Jane Smith'
          },
          {
            id: 3,
            name: 'Global Systems Contract',
            description: 'Annual maintenance contract',
            status: 'Proposal',
            value: 75000,
            contact: 'Mike Johnson'
          }
        ],
        columnField: 'status',
        titleField: 'name',
        descriptionField: 'description'
      };
    default:
      return {};
  }
};

const Canvas: React.FC<{ isEditorMode: boolean }> = ({ isEditorMode }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { currentCanvasId } = useCanvasesStore();
  const components = useCanvasStore((state) => state.components[currentCanvasId] || []);
  const addComponent = useCanvasStore((state) => state.addComponent);
  const updateComponentPosition = useCanvasStore((state) => state.updateComponentPosition);
  const selectComponent = useCanvasStore((state) => state.selectComponent);
  const initializeCanvas = useCanvasStore((state) => state.initializeCanvas);
  const [error, setError] = useState<string | null>(null);

  // Function to constrain position within canvas bounds
  const constrainPosition = (position: { x: number; y: number }, componentSize: { width: number; height: number }) => {
    if (!canvasRef.current) return position;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const maxX = canvasRect.width - componentSize.width;
    const maxY = canvasRect.height - componentSize.height;

    return {
      x: Math.max(0, Math.min(position.x, maxX)),
      y: Math.max(0, Math.min(position.y, maxY))
    };
  };

  const calculateGuidelines = (currentPosition: { x: number; y: number }) => {
    const { setGuidelines } = useGuidelinesStore.getState();
    const verticalLines: number[] = [];
    const horizontalLines: number[] = [];
    
    // Get all component positions
    components.forEach((comp) => {
      // Vertical alignments
      verticalLines.push(comp.position.x); // Left edge
      verticalLines.push(comp.position.x + comp.size.width); // Right edge
      verticalLines.push(comp.position.x + comp.size.width / 2); // Center

      // Horizontal alignments
      horizontalLines.push(comp.position.y); // Top edge
      horizontalLines.push(comp.position.y + comp.size.height); // Bottom edge
      horizontalLines.push(comp.position.y + comp.size.height / 2); // Center
    });

    // Add canvas edges as guidelines
    if (canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      verticalLines.push(0);
      verticalLines.push(canvasRect.width);
      verticalLines.push(canvasRect.width / 2);
      horizontalLines.push(0);
      horizontalLines.push(canvasRect.height);
      horizontalLines.push(canvasRect.height / 2);
    }

    // Consolidate nearby guidelines (within 5px of each other)
    const consolidateLines = (lines: number[]): number[] => {
      const sortedLines = [...new Set(lines)].sort((a, b) => a - b);
      const consolidated: number[] = [];
      let currentGroup: number[] = [];

      sortedLines.forEach((line) => {
        if (currentGroup.length === 0) {
          currentGroup.push(line);
        } else {
          const lastLine = currentGroup[currentGroup.length - 1];
          if (Math.abs(line - lastLine) <= 5) {
            currentGroup.push(line);
          } else {
            // Average the current group and start a new one
            consolidated.push(currentGroup.reduce((a, b) => a + b) / currentGroup.length);
            currentGroup = [line];
          }
        }
      });

      // Don't forget the last group
      if (currentGroup.length > 0) {
        consolidated.push(currentGroup.reduce((a, b) => a + b) / currentGroup.length);
      }

      return consolidated;
    };

    const consolidatedVertical = consolidateLines(verticalLines);
    const consolidatedHorizontal = consolidateLines(horizontalLines);

    // Filter guidelines within snap range (e.g., 10px)
    const snapRange = 10;
    const filteredVertical = consolidatedVertical.filter(
      (line) => Math.abs(line - currentPosition.x) <= snapRange
    );
    const filteredHorizontal = consolidatedHorizontal.filter(
      (line) => Math.abs(line - currentPosition.y) <= snapRange
    );

    console.log('Setting guidelines:', { vertical: filteredVertical, horizontal: filteredHorizontal });
    setGuidelines({ vertical: filteredVertical, horizontal: filteredHorizontal });
  };

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
    hover: (item: { type: string; id?: string }, monitor) => {
      console.log('Hovering with item:', item);
      const offset = monitor.getClientOffset();
      if (!offset || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const currentPosition = {
        x: offset.x - canvasRect.left,
        y: offset.y - canvasRect.top,
      };
      console.log('Current position:', currentPosition);
      calculateGuidelines(currentPosition);
    },
    drop: (item: { type: string; id?: string }, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset || !currentCanvasId || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: offset.x - canvasRect.left,
        y: offset.y - canvasRect.top,
      };

      if (item.id) {
        // Moving existing component
        const component = components.find(c => c.id === item.id);
        if (component) {
          const constrainedPosition = constrainPosition(position, component.size);
          updateComponentPosition(currentCanvasId, item.id, constrainedPosition);
        }
      } else {
        // Adding new component
        const size = getDefaultSize(item.type);
        const constrainedPosition = constrainPosition(position, size);
        const newComponent = {
          id: crypto.randomUUID(),
          type: item.type,
          position: constrainedPosition,
          size,
          properties: getDefaultProperties(item.type),
        };
        addComponent(currentCanvasId, newComponent);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [currentCanvasId, addComponent, updateComponentPosition, components]);

  return (
    <div
      id="canvas-drop-target"
      ref={(node) => {
        canvasRef.current = node;
        drop(node);
      }}
      className={`relative w-full h-[calc(100vh-4rem)] border-2 rounded-lg overflow-hidden ${
        isOver ? 'border-blue-500' : 'border-gray-200'
      } bg-gray-50`}
    >
      {isEditorMode && <Guidelines />}
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