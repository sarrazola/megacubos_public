import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Eye, Trash2 } from 'lucide-react';
import Pagination from '../common/Pagination';
import RowDetailsPanel from './components/TableComponent/RowDetailsPanel';
import { useRowDetailsStore } from '../../store/useRowDetailsStore';

interface TableComponentProps {
  data: any[];
  pageSize?: number;
  columnVisibility?: Record<string, boolean>;
  showActions?: boolean;
  actionColumnLabel?: string;
  actionButtonLabel?: string;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const TableComponent: React.FC<TableComponentProps> = ({
  data,
  pageSize = 50,
  columnVisibility = {},
  showActions = true,
  actionColumnLabel = 'Actions',
  actionButtonLabel = 'View',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: Object.keys(data[0] || {})[0],
    direction: 'desc'
  });
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const { setSelectedRow } = useRowDetailsStore();

  // Get visible columns
  const getVisibleColumns = () => {
    if (!data[0]) return [];
    return Object.keys(data[0]).filter(column => columnVisibility[column] !== false);
  };

  const visibleColumns = getVisibleColumns();

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'desc' ? 'asc' : 'desc',
    }));
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const sortedData = [...data].sort((a, b) => {
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
    if (row.id) return row.id;
    return `row-${index}`;
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4" />;
    return sortConfig.direction === 'desc' ? (
      <ArrowDown className="h-4 w-4" />
    ) : (
      <ArrowUp className="h-4 w-4" />
    );
  };

  const handleRowMouseEnter = (rowKey: string, rowData: any) => {
    setHoveredRow(rowKey);
  };

  const handleRowMouseLeave = () => {
    setHoveredRow(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto flex-grow rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="[&>th:first-child]:rounded-tl-lg [&>th:last-child]:rounded-tr-lg">
              {visibleColumns.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 border-x border-gray-200"
                  onClick={() => handleSort(header)}
                >
                  <div className="flex items-center gap-2">
                    <span>
                      {header
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase())}
                    </span>
                    {getSortIcon(header)}
                  </div>
                </th>
              ))}
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-x border-gray-200">
                  {actionColumnLabel}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row, idx) => {
              const rowKey = getRowKey(row, startIndex + idx);
              const isLastRow = idx === currentData.length - 1;
              return (
                <tr
                  key={rowKey}
                  className={`transition-colors duration-150 ${
                    hoveredRow === rowKey ? 'bg-blue-50' : 'hover:bg-gray-50'
                  } ${isLastRow ? '[&>td:first-child]:rounded-bl-lg [&>td:last-child]:rounded-br-lg' : ''}`}
                  onMouseEnter={() => handleRowMouseEnter(rowKey, row)}
                  onMouseLeave={handleRowMouseLeave}
                >
                  {visibleColumns.map((columnName) => (
                    <td 
                      key={`${rowKey}-col-${columnName}`} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {row[columnName]}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setSelectedRow(row);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => {
                            console.log('Delete clicked for row:', row);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
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