import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ComponentPalette from '../components/builder/ComponentPalette';
import Canvas from '../components/builder/Canvas';
import { useEditorStore } from '../store/useEditorStore';
import { useCanvasStore } from '../store/useCanvasStore';
import CustomDragLayer from '../components/builder/CustomDragLayer';
import PropertiesPanel from '../components/builder/PropertiesPanel';

const Builder = () => {
  const isEditorMode = useEditorStore((state) => state.isEditorMode);
  const toggleEditorMode = useEditorStore((state) => state.toggleEditorMode);
  const selectedComponent = useCanvasStore((state) => state.selectedComponent);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isEditorMode) {
        toggleEditorMode();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isEditorMode, toggleEditorMode]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-[calc(100vh-4rem)]">
        <CustomDragLayer />
        {isEditorMode && (
          <div className="hidden md:block w-64 p-4">
            <ComponentPalette />
          </div>
        )}
        <div className="flex-1 p-6">
          <Canvas isEditorMode={isEditorMode && window.innerWidth >= 768} />
        </div>
        {isEditorMode && selectedComponent && (
          <div className="hidden md:block w-64 p-4 border-l">
            <PropertiesPanel />
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default Builder;