import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { createDatabaseTable } from '../../services/api/database';

interface TableBuilderProps {
  onClose: () => void;
  onSubmit: (tableName: string, fields: any[]) => void;
  onTableCreated?: () => void;
}

const TableBuilder: React.FC<TableBuilderProps> = ({ onClose, onSubmit, onTableCreated }) => {
  const [tableName, setTableName] = useState('');
  const [fields, setFields] = useState([
    { name: '', type: 'text', required: false }
  ]);
  const [error, setError] = useState<string | null>(null);

  const fieldTypes = [
    'text',
    'number',
    'boolean',
    'date',
    'timestamp',
    'email',
    'url'
  ];

  const addField = () => {
    setFields([...fields, { name: '', type: 'text', required: false }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, field: any) => {
    const newFields = [...fields];
    newFields[index] = field;
    setFields(newFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCreateTable(tableName, fields);
    onClose();
  };

  const handleCreateTable = async (tableName: string, fields: any[]) => {
    try {
      setError(null);
      await createDatabaseTable(tableName, fields);
      onTableCreated?.();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('already exists')) {
          setError('A table with this name already exists. Please choose a different name.');
        } else {
          setError('Failed to create table. Please try again.');
        }
      }
    }
  };

  const handleTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(' ')) {
      alert('Spaces are not allowed in table names');
      return;
    }
    setTableName(value);
  };

  const handleFieldNameChange = (index: number, value: string) => {
    if (value.includes(' ')) {
      alert('Spaces are not allowed in field names');
      return;
    }
    updateField(index, { ...fields[index], name: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Create New Table</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="text-red-500 mb-4 p-2 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Table Name
            </label>
            <input
              type="text"
              value={tableName}
              onChange={handleTableNameChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Fields</h3>
              <button
                type="button"
                onClick={addField}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Field
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => handleFieldNameChange(index, e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2"
                  placeholder="Field name"
                  required
                />
                <select
                  value={field.type}
                  onChange={(e) =>
                    updateField(index, { ...field, type: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-32"
                >
                  {fieldTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      updateField(index, { ...field, required: e.target.checked })
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Required</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableBuilder;
