import React, { useState, useRef } from 'react';
import { MoreVertical, ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

interface ColumnMenuProps {
  columnName: string;
  onSort: (direction: 'asc' | 'desc') => void;
  onDelete: () => void;
}

const ColumnMenu: React.FC<ColumnMenuProps> = ({ columnName, onSort, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1">
          <button
            onClick={() => { onSort('asc'); setIsOpen(false); }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <ArrowUpCircle className="h-4 w-4" />
            Sort Ascending
          </button>
          <button
            onClick={() => { onSort('desc'); setIsOpen(false); }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <ArrowDownCircle className="h-4 w-4" />
            Sort Descending
          </button>
          <button
            onClick={() => { onDelete(); setIsOpen(false); }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete Column
          </button>
        </div>
      )}
    </div>
  );
};

export default ColumnMenu; 