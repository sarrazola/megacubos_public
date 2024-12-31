import React from 'react';
import { X } from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useCanvasesStore } from '../../store/useCanvasesStore';

// Import all property components
import TableProperties from './components/TableComponent/properties';
import ChartProperties from './components/ChartComponent/properties';
import TextProperties from './components/TextComponent/properties';
import ButtonProperties from './components/ButtonComponent/properties';
import ScorecardProperties from './components/ScorecardComponent/properties';
import PDFProperties from './components/PDFComponent/properties';
import ImageProperties from './components/ImageComponent/properties';
import MapProperties from './components/MapComponent/properties';
import CalendarProperties from './components/CalendarComponent/properties';
import KanbanProperties from './components/KanbanComponent/properties';

const PropertiesPanel = () => {
  const { components, selectedComponent, selectComponent } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();

  const component = components[currentCanvasId]?.find(comp => comp.id === selectedComponent);
  if (!component) return null;

  const renderProperties = () => {
    switch (component.type) {
      case 'table':
        return <TableProperties component={component} />;
      case 'chart':
        return <ChartProperties component={component} />;
      case 'text':
        return <TextProperties component={component} />;
      case 'button':
        return <ButtonProperties component={component} />;
      case 'scorecard':
        return <ScorecardProperties component={component} />;
      case 'pdf':
        return <PDFProperties component={component} />;
      case 'calendar':
        return <CalendarProperties component={component} />;
      case 'image':
        return <ImageProperties component={component} />;
      case 'map':
        return <MapProperties component={component} />;
      case 'kanban':
        return <KanbanProperties component={component} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Properties</h3>
        <button
          onClick={() => selectComponent(null)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {renderProperties()}
    </div>
  );
};

export default PropertiesPanel;