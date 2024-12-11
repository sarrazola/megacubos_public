import React from 'react';
import { X } from 'lucide-react';

interface RowDetailsPanelProps {
  data: Record<string, any>;
  onClose: () => void;
}

const RowDetailsPanel: React.FC<RowDetailsPanelProps> = ({ data, onClose }) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-screen w-96 bg-white shadow-lg z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">Row Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="border-b pb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RowDetailsPanel;