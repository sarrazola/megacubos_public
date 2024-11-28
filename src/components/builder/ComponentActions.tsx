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
        className="text-gray-400 hover:text-gray-600 p-1"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={(e) => {
              stopPropagation(e);
              duplicateComponent(currentCanvasId, componentId);
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
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
            className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ComponentActions;