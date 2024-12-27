import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, MoreVertical, Database, Plus, Trash2 } from 'lucide-react';
import { fetchProducts } from '../../../../services/api/products';
import Pagination from '../../../common/Pagination';
import ColumnMenu from '../../../database/ColumnMenu';
import { deleteColumn, updateTableCell } from '../../../../services/api/database';
import RowDetailsPanel from './RowDetailsPanel';
import { useRowDetailsStore } from '../../store/useRowDetailsStore';

interface TableComponentProps {
  data: any[];
  pageSize?: number;
  onAddColumn?: () => void;
  tableName?: string;
  onRefresh?: () => void;
  onDeleteRows?: (rows: any[]) => void;
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

interface DeleteModalProps {
  selectedCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ selectedCount, onConfirm, onCancel }) => (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex items-center gap-4 z-50">
    <span className="text-sm font-medium">{selectedCount} row(s) selected</span>
    <button
      onClick={onConfirm}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
    >
      <Trash2 className="h-4 w-4" />
      Delete Selected
    </button>
    <button
      onClick={onCancel}
      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
    >
      Cancel
    </button>
  </div>
);

const TableComponent: React.FC<TableComponentProps> = ({
  data: initialData,
  pageSize = 10,
  onAddColumn,
  tableName,
  onRefresh,
  onDeleteRows,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: '',
    direction: 'desc'
  });
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

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

  if (!currentData.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-gray-200 rounded-full animate-spin-slow">
            <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Database className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No data available</h3>
        <p className="text-base text-gray-500 text-center max-w-md">
          Get started by importing your data from a CSV file or add new rows manually to begin building your database.
        </p>
      </div>
    );
  }

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = currentData.map(row => getRowKey(row, 0));
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (rowKey: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowKey)) {
      newSelected.delete(rowKey);
    } else {
      newSelected.add(rowKey);
    }
    setSelectedRows(newSelected);
  };

  const handleDeleteSelected = () => {
    if (!onDeleteRows) return;
    const rowsToDelete = initialData.filter(row => selectedRows.has(getRowKey(row, 0)));
    onDeleteRows(rowsToDelete);
    setSelectedRows(new Set());
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto flex-grow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedRows.size === currentData.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300"
                />
              </th>
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
                    <ColumnMenu
                      columnName={header}
                      onSort={(direction) => {
                        setSortConfig({ key: header, direction });
                      }}
                      onDelete={() => handleDeleteColumn(header)}
                    />
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                <button
                  onClick={onAddColumn}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row, idx) => (
              <tr 
                key={getRowKey(row, startIndex + idx)}
                className={`${
                  selectedRows.has(getRowKey(row, startIndex + idx)) 
                    ? 'bg-gray-50' 
                    : ''
                } hover:bg-gray-50 transition-colors duration-150`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(getRowKey(row, startIndex + idx))}
                    onChange={() => handleSelectRow(getRowKey(row, startIndex + idx))}
                    className="rounded border-gray-300"
                  />
                </td>
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
      {selectedRows.size > 0 && (
        <DeleteModal
          selectedCount={selectedRows.size}
          onConfirm={handleDeleteSelected}
          onCancel={() => setSelectedRows(new Set())}
        />
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      {selectedRow && (
        <RowDetailsPanel
          data={selectedRow}
          onClose={() => setSelectedRow(null)}
        />
      )}
    </div>
  );
};

export default TableComponent;