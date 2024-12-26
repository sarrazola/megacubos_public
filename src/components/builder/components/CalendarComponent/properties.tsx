import React from 'react';
import { useCanvasStore } from '../../../../store/useCanvasStore';
import { useCanvasesStore } from '../../../../store/useCanvasesStore';

interface CalendarPropertiesProps {
  component: any;
}

const CalendarProperties: React.FC<CalendarPropertiesProps> = ({ component }) => {
  const { selectedComponent, updateComponentProperties } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          View Type
        </label>
        <select
          value={component.properties.viewType || 'day'}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            viewType: e.target.value,
          })}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="day">Day View</option>
          <option value="week">Week View</option>
          <option value="month">Month View</option>
        </select>
      </div>
    </div>
  );
};

export default CalendarProperties; 