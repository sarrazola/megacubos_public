import React, { useState } from 'react';
import { X } from 'lucide-react';

interface RenameTableModalProps {
  tableName: string;
  onClose: () => void;
  onConfirm: (oldName: string, newName: string) => Promise<void>;
}

const RenameTableModal: React.FC<RenameTableModalProps> = ({
  tableName,
  onClose,
  onConfirm,
}) => {
  const [newName, setNewName] = useState(tableName);
  const [isRenaming, setIsRenaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    // Validate table name format
    const tableNameRegex = /^[a-z][a-z0-9_]*$/;
    if (!tableNameRegex.test(newName.trim())) {
      alert('Table name must start with a letter and can only contain lowercase letters, numbers, and underscores');
      return;
    }

    try {
      setIsRenaming(true);
      setError(null);
      await onConfirm(tableName, newName.trim());
    } catch (error) {
      console.error('Error renaming table:', error);
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          setError('A table with this name already exists. Please choose a different name.');
        } else {
          setError('Failed to rename table. Please try again.');
        }
      }
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Rename Table</h2>
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Table Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new table name"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={isRenaming}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newName.trim() || newName === tableName || isRenaming}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isRenaming ? 'Renaming...' : 'Rename Table'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameTableModal;