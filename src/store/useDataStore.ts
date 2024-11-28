import { create } from 'zustand';

interface DataRow {
  id: number;
  [key: string]: any;
}

interface TableData {
  id: string;
  name: string;
  data: DataRow[];
}

interface DataStore {
  tables: TableData[];
  currentTableId: string;
  setCurrentTableId: (id: string) => void;
  updateCell: (id: number, key: string, value: any) => void;
  deleteRow: (id: number) => void;
  addRow: () => void;
}

export const useDataStore = create<DataStore>((set) => ({
  tables: [
    {
      id: 'products',
      name: 'Products',
      data: [],
    },
    {
      id: 'customers',
      name: 'Customers',
      data: [],
    },
  ],
  currentTableId: 'products',
  setCurrentTableId: (id) => set({ currentTableId: id }),
  updateCell: (id, key, value) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === state.currentTableId
          ? {
              ...table,
              data: table.data.map((row) =>
                row.id === id ? { ...row, [key]: value } : row
              ),
            }
          : table
      ),
    })),
  deleteRow: (id) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === state.currentTableId
          ? {
              ...table,
              data: table.data.filter((row) => row.id !== id),
            }
          : table
      ),
    })),
  addRow: () =>
    set((state) => {
      const currentTable = state.tables.find((t) => t.id === state.currentTableId);
      if (!currentTable) return state;

      const newId = Math.max(...currentTable.data.map((row) => row.id), 0) + 1;
      const defaultRow = { id: newId };

      return {
        tables: state.tables.map((table) =>
          table.id === state.currentTableId
            ? {
                ...table,
                data: [...table.data, defaultRow],
              }
            : table
        ),
      };
    }),
}));