import React, { useState } from 'react';
import { X, Save, Edit2 } from 'lucide-react';
import { useRowDetailsStore } from '../../store/useRowDetailsStore';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useCanvasesStore } from '../../store/useCanvasesStore';
import { saveCanvasComponents } from '../../services/api/canvasComponents';

const RowDetailsPanel = () => {
  const { selectedRow, setSelectedRow } = useRowDetailsStore();
  const { updateComponentProperties, components } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Record<string, any>>({});

  if (!selectedRow) return null;

  const handleEdit = () => {
    setEditedData(selectedRow);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Find the table component
      const tableComponent = components[currentCanvasId]?.find(comp => comp.type === 'table');
      if (tableComponent) {
        // Update the data in the specific row
        const updatedData = tableComponent.properties.data.map((row: any) => 
          row.id === selectedRow.id ? editedData : row
        );

        // Update local state
        updateComponentProperties(currentCanvasId, tableComponent.id, {
          data: updatedData
        });

        // Save to database
        const updatedComponents = components[currentCanvasId].map(comp =>
          comp.id === tableComponent.id 
            ? { ...comp, properties: { ...comp.properties, data: updatedData } }
            : comp
        );

        await saveCanvasComponents(currentCanvasId, updatedComponents);
        console.log('Successfully updated row data in database');

        setSelectedRow(editedData);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving row changes:', error);
      alert('Failed to save changes');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelectedRow(null)} />
      <div className="fixed top-0 right-0 h-screen w-96 bg-white shadow-lg z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">Row Details</h2>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                >
                  <Save className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setSelectedRow(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {Object.entries(isEditing ? editedData : selectedRow).map(([key, value]) => (
            <div key={key} className="border-b pb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={value as string}
                  onChange={(e) => setEditedData(prev => ({
                    ...prev,
                    [key]: e.target.value
                  }))}
                  className="w-full text-sm text-gray-900 border rounded-lg p-2"
                />
              ) : (
                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {value}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RowDetailsPanel; 