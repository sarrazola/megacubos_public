import React from 'react';
import { Eye, Edit2, Plus } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { usePageStore } from '../../store/usePageStore';
import { useCanvasesStore } from '../../store/useCanvasesStore';

const Header = () => {
  const { isEditorMode, toggleEditorMode } = useEditorStore();
  const { currentPage } = usePageStore();
  const { addCanvas } = useCanvasesStore();

  if (currentPage !== 'dashboard') {
    return (
      <header className="h-16 bg-white border-b fixed top-0 right-0 left-64 px-6 flex items-center justify-between z-10" />
    );
  }

  return (
    <header className="h-16 bg-white border-b fixed top-0 right-0 left-64 px-6 flex items-center justify-between z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={addCanvas}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          Create New Canvas
        </button>

        <div className="flex-1" />

        <button
          onClick={toggleEditorMode}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          {isEditorMode ? (
            <>
              <Eye className="h-4 w-4" />
              <span>Switch to Live Mode</span>
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4" />
              <span>Switch to Editor Mode</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;