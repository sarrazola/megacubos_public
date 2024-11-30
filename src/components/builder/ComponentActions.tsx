import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Trash2, Copy } from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useCanvasesStore } from '../../store/useCanvasesStore';

interface ComponentActionsProps {
  componentId: string;
  stopPropagation: (e: React.MouseEvent) => void;
}

const ComponentActions: React.FC<ComponentActionsProps> = ({ componentId, stopPropagation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { removeComponent, duplicateComponent } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          stopPropagation(e);
          setIsOpen(!isOpen);
        }}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 component-actions-menu" 
          style={{ zIndex: 1000 }}
        >
          <div className="py-1">
            <button
              onClick={(e) => {
                stopPropagation(e);
                duplicateComponent(currentCanvasId, componentId);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Duplicate
            </button>
            <button
              onClick={(e) => {
                stopPropagation(e);
                removeComponent(currentCanvasId, componentId);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentActions;