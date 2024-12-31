import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
  Modifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical } from 'lucide-react';

/**
 * PROPS
 */
interface KanbanComponentProps {
  data: any[];
  columnField?: string;      // e.g. 'status'
  titleField?: string;       // e.g. 'name'
  descriptionField?: string; // e.g. 'description'
}

/**
 * This modifier uses a stored offset to position the drag preview exactly 
 * under the pointer, ignoring parent container offset issues. 
 * 
 * We read the user’s stored offset (dragOffset) from the outside 
 * via a closure or by passing it in. For simplicity, we'll define a function 
 * that returns a Modifier, capturing the offset from props.
 */
function createSnapToPointerModifier(dragOffset: { x: number; y: number } | null): Modifier {
  return ({ activatorEvent, transform }) => {
    if (!dragOffset || !(activatorEvent instanceof MouseEvent)) {
      // Use default transform if we have no offset or no mouse event
      return transform;
    }

    // The pointer’s absolute coordinates
    const mouseX = activatorEvent.clientX;
    const mouseY = activatorEvent.clientY;

    // We subtract the offset so the card is pinned exactly where the user clicked
    const x = mouseX - dragOffset.x;
    const y = mouseY - dragOffset.y;

    // Preserve scale, rotation if needed (usually 1,0)
    return {
      ...transform,
      x,
      y,
    };
  };
}

/**
 * SortableItem
 * - Represents a single card in a column.
 * - `useSortable` from dnd-kit handles the drag logic for us.
 * - We also accept `activeId` so if this item is active, we hide it in place.
 */
function SortableItem({
  item,
  titleField,
  descriptionField,
  activeId,
}: {
  item: any;
  titleField: string;
  descriptionField: string;
  activeId: string | null;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  // If this item is actively dragged, we hide the original in the list
  const isActive = activeId === String(item.id);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Hide the original if it's being dragged
    visibility: isActive ? 'hidden' : undefined,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white p-4 rounded-lg shadow-sm 
        hover:shadow-md
        ${isDragging ? 'ring-2 ring-blue-500 shadow-xl' : ''}
      `}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-gray-800">
          {item[titleField] ?? 'No Title'}
        </h4>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        {item[descriptionField] ?? ''}
      </p>
    </div>
  );
}

/**
 * KanbanComponent
 * - Groups items by column.
 * - Uses DndContext to manage drag state.
 * - SortableContext for each column.
 * - DragOverlay uses a custom "snap-to-pointer" approach 
 *   so the overlay is always right where the mouse is.
 */
const KanbanComponent: React.FC<KanbanComponentProps> = ({
  data,
  columnField = 'status',
  titleField = 'name',
  descriptionField = 'description',
}) => {
  // { 'Lead': [...], 'Proposal': [...], 'Closed-Won': [...], etc. }
  const [columns, setColumns] = useState<Record<string, any[]>>({});
  // Track which item ID is currently being dragged
  const [activeId, setActiveId] = useState<string | null>(null);
  // Convert ID -> the actual object, for quick lookups
  const [itemsById, setItemsById] = useState<Record<string, any>>({});
  // We'll store the pointer offset here: difference between 
  // pointer and the card's top-left corner
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Collect all unique column values
    const allColumns = new Set(
      data.map((item) => item[columnField] ?? 'No Status')
    );

    // Prepare columns object with empty arrays
    const initialColumns: Record<string, any[]> = {};
    for (const col of allColumns) {
      initialColumns[col] = [];
    }

    // Group items into the correct column + store them by ID
    const byId: Record<string, any> = {};
    data.forEach((item) => {
      const col = item[columnField] ?? 'No Status';
      initialColumns[col].push(item);
      byId[item.id] = item;
    });

    setColumns(initialColumns);
    setItemsById(byId);
  }, [data, columnField]);

  // Sensors to track pointer
  const sensors = useSensors(useSensor(PointerSensor));

  // When dragging starts, record the active item ID and the pointer offset
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(String(active.id));

    // If the item’s bounding rect is available, compute offset
    // active.rect.current.translated is where the item is on screen
    if (active.rect?.current?.translated && event.activatorEvent instanceof MouseEvent) {
      const { top, left } = active.rect.current.translated;
      const pointerX = event.activatorEvent.clientX;
      const pointerY = event.activatorEvent.clientY;

      // How far is the pointer from the card’s top-left?
      const offsetX = pointerX - left;
      const offsetY = pointerY - top;
      setDragOffset({ x: offsetX, y: offsetY });
    } else {
      // If we can't measure, fallback to no offset
      setDragOffset(null);
    }
  }

  // Optional advanced logic if you want to reorder columns on the fly, etc.
  function handleDragOver(event: DragOverEvent) {
    // No-op for this sample
  }

  // When drag ends, figure out where it was dropped & update state
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      // Dropped outside of any droppable
      setActiveId(null);
      return;
    }

    const activeColumn = findColumnOfItem(active.id);
    const overColumn = findColumnOfItem(over.id);

    // If we somehow didn’t find a column, bail
    if (!activeColumn || !overColumn) {
      setActiveId(null);
      return;
    }

    // If same column, reorder
    if (activeColumn === overColumn && active.id !== over.id) {
      reorderWithinColumn(activeColumn, active.id, over.id);
    }
    // If different column, move item
    else if (activeColumn !== overColumn) {
      moveBetweenColumns(activeColumn, overColumn, active.id, over.id);
    }

    // Clear active ID
    setActiveId(null);
  }

  // Identify which column an item belongs to
  function findColumnOfItem(itemId: string | number) {
    const idStr = String(itemId);
    for (const columnId of Object.keys(columns)) {
      if (columns[columnId].some((itm) => String(itm.id) === idStr)) {
        return columnId;
      }
    }
    return null;
  }

  // Reorder items within the same column
  function reorderWithinColumn(columnId: string, fromId: string, toId: string) {
    const columnItems = columns[columnId];
    const fromIndex = columnItems.findIndex((itm) => String(itm.id) === fromId);
    const toIndex = columnItems.findIndex((itm) => String(itm.id) === toId);
    if (fromIndex < 0 || toIndex < 0) return;

    const newItems = arrayMove(columnItems, fromIndex, toIndex);
    setColumns({
      ...columns,
      [columnId]: newItems,
    });
  }

  // Move item from one column to another
  function moveBetweenColumns(
    fromColumnId: string,
    toColumnId: string,
    itemId: string | number,
    overId: string | number
  ) {
    const fromItems = columns[fromColumnId];
    const toItems = columns[toColumnId];

    const fromIndex = fromItems.findIndex(
      (itm) => String(itm.id) === String(itemId)
    );
    if (fromIndex < 0) return;

    const [movedItem] = fromItems.splice(fromIndex, 1);

    // If dropping onto an existing item, insert at that item’s index
    const overIndex = toItems.findIndex((itm) => String(itm.id) === String(overId));
    let newIndex = overIndex >= 0 ? overIndex : toItems.length;
    toItems.splice(newIndex, 0, movedItem);

    setColumns({
      ...columns,
      [fromColumnId]: fromItems,
      [toColumnId]: toItems,
    });
  }

  // The item that is currently being dragged, for the overlay
  const activeItem = activeId ? itemsById[activeId] : null;

  if (!data || data.length === 0) {
    return <div className="p-4 text-gray-500">No data available</div>;
  }

  // Build our snap-to-pointer modifier with the current dragOffset
  const snapModifier = createSnapToPointerModifier(dragOffset);

  return (
    <div className="h-full overflow-x-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Columns layout */}
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
                {/* SortableContext for reordering within this column */}
                <SortableContext
                  items={items.map((itm) => String(itm.id))}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3 min-h-[100px] rounded-lg p-2">
                    {items.map((item) => (
                      <SortableItem
                        key={String(item.id)}
                        item={item}
                        titleField={titleField}
                        descriptionField={descriptionField}
                        activeId={activeId}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
            </div>
          ))}
        </div>

        {/*
          The “follow-the-mouse” overlay appended to <body>.
          We apply our snapModifier, which uses `dragOffset` to
          position the overlay exactly under the pointer.
        */}
        <DragOverlay modifiers={[snapModifier]}>
          {activeItem && (
            <div className="bg-white p-4 rounded-lg shadow-xl ring-2 ring-blue-500 cursor-grabbing">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">
                  {activeItem[titleField] ?? 'No Title'}
                </h4>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {activeItem[descriptionField]}
              </p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanComponent;
