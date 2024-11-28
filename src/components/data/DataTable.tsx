import React from 'react';
import { MoreVertical, ArrowUpDown } from 'lucide-react';

interface Column {
  header: string;
  accessor: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
              ))}
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {row[column.accessor]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;