import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Pagination from '../common/Pagination';

interface TableComponentProps {
  data: any[];
  showActions?: boolean;
  actionColumnLabel?: string;
  actionButtonLabel?: string;
  pageSize?: number;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const TableComponent: React.FC<TableComponentProps> = ({
  data,
  showActions = true,
  actionColumnLabel = 'Actions',
  actionButtonLabel = 'View',
  pageSize = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: Object.keys(data[0] || {})[0],
    direction: 'desc'
  });

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

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto flex-grow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {currentData[0] && Object.keys(currentData[0]).map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {actionColumnLabel}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row, idx) => (
              <tr key={getRowKey(row, startIndex + idx)}>
                {Object.values(row).map((cell: any, i: number) => (
                  <td key={`${getRowKey(row, startIndex + idx)}-col-${i}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cell}
                  </td>
                ))}
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => {
                        console.log('Action clicked for row:', row);
                      }}
                    >
                      {actionButtonLabel}
                    </button>
                  </td>
                )}
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