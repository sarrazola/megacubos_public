import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { deleteTable } from '../../services/api/database';

interface DeleteTableModalProps {
  tableName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteTableModal: React.FC<DeleteTableModalProps> = ({
  tableName,
  onClose,
  onConfirm,
}) => {
  const [confirmName, setConfirmName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmName !== tableName) return;

    try {
      setIsDeleting(true);
      setError(null);
      await onConfirm();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete table. Please try again.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {error && (
          <div className="text-red-500 mb-4 p-2 bg-red-100 rounded">
            {error}
          </div>
        )}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-red-600">Delete Table</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 p-3 bg-red-50 text-red-600 rounded-lg mb-4">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm font-medium">Warning: This action cannot be undone</p>
          </div>

          <p className="text-gray-600 mb-4">
            This will permanently delete the table "<strong>{tableName}</strong>" and all its data.
            Please type the table name to confirm.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder="Enter table name"
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={confirmName !== tableName || isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Table'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteTableModal;