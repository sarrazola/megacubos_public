import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ComponentPalette from '../components/builder/ComponentPalette';
import Canvas from '../components/builder/Canvas';
import PropertiesPanel from '../components/builder/PropertiesPanel';
import { useCanvasStore } from '../store/useCanvasStore';
import { useEditorStore } from '../store/useEditorStore';

const Builder = () => {
  const selectedComponent = useCanvasStore((state) => state.selectedComponent);
  const { isEditorMode } = useEditorStore();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6">
        <div className="grid grid-cols-6 gap-6">
          {isEditorMode && (
            <div className="col-span-1">
              <ComponentPalette />
            </div>
          )}
          <div className={isEditorMode ? 'col-span-4' : 'col-span-6'}>
            <Canvas isEditorMode={isEditorMode} />
          </div>
          {isEditorMode && selectedComponent && (
            <div className="col-span-1">
              <PropertiesPanel />
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default Builder;