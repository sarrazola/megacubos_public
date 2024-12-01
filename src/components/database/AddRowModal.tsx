import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getAddRowSchema } from '../../services/api/database';

interface AddRowModalProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  tableName: string;
}

interface ColumnSchema {
  name: string;
  type: string;
  required: boolean;
  isIdentity: boolean;
}

const AddRowModal: React.FC<AddRowModalProps> = ({ onClose, onSubmit, tableName }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [schema, setSchema] = useState<ColumnSchema[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTableSchema();
  }, [tableName]);

  const loadTableSchema = async () => {
    try {
      const schemaData = await getAddRowSchema(tableName);
      setSchema(schemaData);
      
      // Initialize form data with null values
      const initialData = schemaData.reduce((acc, col) => {
        // Don't initialize id field since it's auto-generated
        if (col.name === 'id') {
          acc[col.name] = 'Auto-generated';
        } else {
          acc[col.name] = col.required ? '' : null;
        }
        return acc;
      }, {} as Record<string, any>);
      setFormData(initialData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading table schema:', error);
      alert('Failed to load table schema');
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error adding row:', error);
      alert('Failed to add row');
    }
  };

  const handleInputChange = (columnName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [columnName]: value
    }));
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add Row - {tableName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {schema.map((column) => (
              <div key={column.name}>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    {column.name}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{column.type}</span>
                    {!column.required && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Null</span>
                        <input
                          type="checkbox"
                          checked={formData[column.name] === null}
                          onChange={(e) => 
                            handleInputChange(column.name, e.target.checked ? null : '')
                          }
                          className="rounded border-gray-300"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <input
                  type={getInputType(column.type)}
                  value={formData[column.name] || ''}
                  onChange={(e) => handleInputChange(column.name, e.target.value)}
                  disabled={formData[column.name] === null}
                  required={column.required && formData[column.name] !== null}
                  className="mt-1 w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
                />
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const getInputType = (dataType: string): string => {
  switch (dataType) {
    case 'integer':
    case 'numeric':
      return 'number';
    case 'timestamp':
    case 'date':
      return 'datetime-local';
    case 'boolean':
      return 'checkbox';
    default:
      return 'text';
  }
};

export default AddRowModal; 