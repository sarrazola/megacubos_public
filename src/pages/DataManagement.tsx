import React, { useState, useEffect } from 'react';
import { useDataStore } from '../store/useDataStore';
import { Search, Plus, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { fetchProducts, updateProduct, deleteProduct } from '../services/api/products';
import { fetchCustomers, updateCustomer, deleteCustomer } from '../services/api/customers';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface EditingCell {
  rowId: number;
  key: string;
  value: any;
}

const DataManagement = () => {
  const { tables, currentTableId, setCurrentTableId } = useDataStore();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: currentTableId === 'products' ? 'id' : 'id',
    direction: 'desc'
  });

  useEffect(() => {
    if (currentTableId === 'products') {
      loadProducts();
    } else if (currentTableId === 'customers') {
      loadCustomers();
    }
  }, [currentTableId]);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCell = async (id: number, key: string, value: any) => {
    setEditingCell({ rowId: id, key, value });
  };

  const handleCellBlur = async () => {
    if (!editingCell) return;

    const { rowId, key, value } = editingCell;
    
    if (currentTableId === 'products') {
      try {
        await updateProduct(rowId, { [key]: value });
        loadProducts();
      } catch (error) {
        console.error('Failed to update product:', error);
      }
    } else if (currentTableId === 'customers') {
      try {
        await updateCustomer(rowId, { [key]: value });
        loadCustomers();
      } catch (error) {
        console.error('Failed to update customer:', error);
      }
    }
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellBlur();
    }
  };

  const handleDeleteRow = async (id: number) => {
    if (currentTableId === 'products') {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    } else if (currentTableId === 'customers') {
      try {
        await deleteCustomer(id);
        loadCustomers();
      } catch (error) {
        console.error('Failed to delete customer:', error);
      }
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4" />;
    return sortConfig.direction === 'desc' ? (
      <ArrowDown className="h-4 w-4" />
    ) : (
      <ArrowUp className="h-4 w-4" />
    );
  };

  const getCurrentData = () => {
    switch (currentTableId) {
      case 'products':
        return products;
      case 'customers':
        return customers;
      default:
        return [];
    }
  };

  const currentData = getCurrentData();

  const filteredData = currentData.filter((row: any) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a: any, b: any) => {
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

  const getRowKey = (row: any) => {
    return `${currentTableId}-${row.id}`;
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex gap-2">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => setCurrentTableId(table.id)}
              className={`px-4 py-2 rounded-lg ${
                currentTableId === table.id
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {table.name}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {sortedData[0] && Object.keys(sortedData[0]).map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((row: any) => (
                <tr key={getRowKey(row)}>
                  {Object.entries(row).map(([key, value]) => (
                    <td
                      key={`${getRowKey(row)}-${key}`}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {key === 'status' ? (
                        <select
                          value={String(value)}
                          onChange={(e) => handleUpdateCell(row.id, key, e.target.value)}
                          onBlur={handleCellBlur}
                          className="w-full bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="In Stock">In Stock</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </select>
                      ) : typeof value === 'number' ? (
                        <input
                          type="number"
                          value={editingCell?.rowId === row.id && editingCell?.key === key ? editingCell.value : value}
                          onChange={(e) => handleUpdateCell(row.id, key, parseFloat(e.target.value) || 0)}
                          onBlur={handleCellBlur}
                          onKeyDown={handleKeyDown}
                          className="w-full bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                        />
                      ) : (
                        <input
                          type="text"
                          value={editingCell?.rowId === row.id && editingCell?.key === key ? editingCell.value : String(value)}
                          onChange={(e) => handleUpdateCell(row.id, key, e.target.value)}
                          onBlur={handleCellBlur}
                          onKeyDown={handleKeyDown}
                          className="w-full bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                        />
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;