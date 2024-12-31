import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, MoreVertical } from 'lucide-react';

interface KanbanComponentProps {
  data: any[];
  columnField?: string;
  titleField?: string;
  descriptionField?: string;
}

const KanbanComponent: React.FC<KanbanComponentProps> = ({
  data,
  columnField = 'status',
  titleField = 'name',
  descriptionField = 'description'
}) => {
  const [columns, setColumns] = useState<Record<string, any[]>>({});

  useEffect(() => {
    console.log('KanbanComponent - Received data:', data);
    console.log('KanbanComponent - Column field:', columnField);

    // Group data by column field
    const groupedData = data.reduce((acc, item) => {
      const columnValue = item[columnField] || 'No Status';
      if (!acc[columnValue]) {
        acc[columnValue] = [];
      }
      acc[columnValue].push(item);
      return acc;
    }, {});
    
    console.log('KanbanComponent - Grouped data:', groupedData);
    setColumns(groupedData);
  }, [data, columnField]);

  const onDragEnd = (result: any) => {
    console.log('KanbanComponent - Drag ended:', result);
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = [...columns[source.droppableId]];
    const destColumn = [...columns[destination.droppableId]];
    const [removed] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    });
  };

  // Add debug rendering
  if (!data || data.length === 0) {
    console.log('KanbanComponent - No data available');
    return <div className="p-4 text-gray-500">No data available</div>;
  }

  return (
    <div className="h-full overflow-x-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 p-4 min-h-[500px]">
          {Object.entries(columns).map(([columnId, items]) => (
            <div key={columnId} className="w-72 flex-shrink-0">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">{columnId}</h3>
                  <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-sm">
                    {items.length}
                  </span>
                </div>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3"
                    >
                      {items.map((item, index) => (
                        <Draggable
                          key={item.id.toString()}
                          draggableId={item.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-4 rounded-lg shadow-sm"
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-800">
                                  {item[titleField]}
                                </h4>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                {item[descriptionField]}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanComponent; 