import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, MoreVertical, Plus } from 'lucide-react';
import { fetchProducts } from '../../../../services/api/products';
import Pagination from '../../../common/Pagination';
import ColumnMenu from '../../../database/ColumnMenu';
import { deleteColumn, updateTableCell } from '../../../../services/api/database';

interface TableComponentProps {
  data: any[];
  pageSize?: number;
  onAddColumn?: () => void;
  tableName?: string;
  onRefresh?: () => void;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface EditingCell {
  rowId: number;
  columnName: string;
  value: any;
}

const TableComponent: React.FC<TableComponentProps> = ({
  data: initialData,
  pageSize = 5,
  onAddColumn,
  tableName,
  onRefresh,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: '',
    direction: 'desc'
  });
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

  useEffect(() => {
    setData(initialData);
    if (initialData.length > 0) {
      setSortConfig(prev => ({
        ...prev,
        key: Object.keys(initialData[0])[0]
      }));
    }
  }, [initialData]);

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'desc' ? 'asc' : 'desc',
    }));
    setCurrentPage(1);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (a[sortConfig.key] === null) return 1;
    if (b[sortConfig.key] === null) return -1;
    
    const aValue = typeof a[sortConfig.key] === 'string' 
      ? a[sortConfig.key].toLowerCase() 
      : a[sortConfig.key];
    const bValue = typeof b[sortConfig.key] === 'string' 
      ? b[sortConfig.key].toLowerCase() 
      : b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = sortedData.slice(startIndex, endIndex);

  const getRowKey = (row: any, index: number) => {
    return row.id ? `row-${row.id}` : `row-${index}`;
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4" />;
    return sortConfig.direction === 'desc' ? (
      <ArrowDown className="h-4 w-4" />
    ) : (
      <ArrowUp className="h-4 w-4" />
    );
  };

  const handleDeleteColumn = async (columnName: string) => {
    if (!tableName) return;
    
    if (window.confirm(`Are you sure you want to delete "${columnName}" field? This action cannot be undone`)) {
      try {
        await deleteColumn(tableName, columnName);
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error deleting column:', error);
        alert('Failed to delete column');
      }
    }
  };

  const handleCellClick = (rowId: number, columnName: string, value: any) => {
    if (columnName === 'id') return; // Don't allow editing of ID column
    setEditingCell({ rowId, columnName, value });
  };

  const handleCellUpdate = async () => {
    if (!editingCell || !tableName) return;

    try {
      await updateTableCell(
        tableName,
        editingCell.rowId,
        editingCell.columnName,
        editingCell.value
      );
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Failed to update cell:', error);
      alert('Failed to update cell');
    } finally {
      setEditingCell(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellUpdate();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  if (!currentData.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto flex-grow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {Object.keys(currentData[0]).map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort(header)}>
                      <span>
                        {header
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())}
                      </span>
                      {getSortIcon(header)}
                    </div>
                    {header !== 'id' && (
                      <ColumnMenu
                        columnName={header}
                        onSort={(direction) => {
                          setSortConfig({ key: header, direction });
                        }}
                        onDelete={() => handleDeleteColumn(header)}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row, idx) => (
              <tr key={getRowKey(row, startIndex + idx)}>
                {Object.entries(row).map(([columnName, cellValue]) => (
                  <td
                    key={`${getRowKey(row, startIndex + idx)}-${columnName}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    onClick={() => handleCellClick(row.id, columnName, cellValue)}
                  >
                    {editingCell?.rowId === row.id && 
                     editingCell?.columnName === columnName ? (
                      <input
                        type="text"
                        value={editingCell.value}
                        onChange={(e) => 
                          setEditingCell({
                            ...editingCell,
                            value: e.target.value
                          })
                        }
                        onBlur={handleCellUpdate}
                        onKeyDown={handleKeyDown}
                        className="w-full px-2 py-1 border rounded"
                        autoFocus
                      />
                    ) : (
                      <div className="cursor-pointer hover:bg-gray-50 px-2 py-1 -mx-2 -my-1 rounded">
                        {cellValue}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default TableComponent;