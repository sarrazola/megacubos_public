import React, { useState } from 'react';
import { useCanvasStore } from '../../../../store/useCanvasStore';
import { useCanvasesStore } from '../../../../store/useCanvasesStore';
import ColorPicker from '../../../common/ColorPicker';
import {
  Activity, AlertCircle, BarChart2, Box, DollarSign,
  Heart, LineChart, Package, ShoppingBag, ShoppingCart,
  Star, Truck, Users, Zap
} from 'lucide-react';

const iconOptions = [
  { icon: Activity, value: 'activity' },
  { icon: AlertCircle, value: 'alert-circle' },
  { icon: BarChart2, value: 'bar-chart' },
  { icon: Box, value: 'box' },
  { icon: DollarSign, value: 'dollar' },
  { icon: Heart, value: 'heart' },
  { icon: LineChart, value: 'line-chart' },
  { icon: Package, value: 'package' },
  { icon: ShoppingBag, value: 'shopping-bag' },
  { icon: ShoppingCart, value: 'shopping-cart' },
  { icon: Star, value: 'star' },
  { icon: Truck, value: 'truck' },
  { icon: Users, value: 'users' },
  { icon: Zap, value: 'zap' },
];

interface ScorecardPropertiesProps {
  component: any;
}

const ScorecardProperties: React.FC<ScorecardPropertiesProps> = ({ component }) => {
  const { selectedComponent, updateComponentProperties } = useCanvasStore();
  const { currentCanvasId } = useCanvasesStore();
  const [showIconPicker, setShowIconPicker] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Label
        </label>
        <input
          type="text"
          value={component.properties.label || ''}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            label: e.target.value,
          })}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Value
        </label>
        <input
          type="text"
          value={component.properties.value || ''}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            value: e.target.value,
          })}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Icon
        </label>
        <div className="relative">
          <button
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="w-full flex items-center justify-between border rounded-lg px-3 py-2 bg-white hover:bg-gray-50"
          >
            <span className="flex items-center gap-2">
              {component.properties.selectedIcon ? (
                <>
                  {React.createElement(
                    iconOptions.find(i => i.value === component.properties.selectedIcon)?.icon || DollarSign,
                    { className: "h-4 w-4" }
                  )}
                  <span>{component.properties.selectedIcon}</span>
                </>
              ) : (
                'Select an icon'
              )}
            </span>
          </button>
          
          {showIconPicker && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg p-2">
              <div className="grid grid-cols-5 gap-1">
                {iconOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      updateComponentProperties(currentCanvasId, selectedComponent, {
                        selectedIcon: option.value,
                      });
                      setShowIconPicker(false);
                    }}
                    className={`p-2 rounded hover:bg-gray-100 ${
                      component.properties.selectedIcon === option.value
                        ? 'bg-blue-50 text-blue-600'
                        : ''
                    }`}
                    title={option.value}
                  >
                    {React.createElement(option.icon, { className: "h-4 w-4" })}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Icon Background
        </label>
        <ColorPicker
          color={component.properties.iconBackground || '#EBF5FF'}
          onChange={(color) => updateComponentProperties(currentCanvasId, selectedComponent, {
            iconBackground: color,
          })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Show Comparison
        </label>
        <input
          type="checkbox"
          checked={component.properties.showComparison || false}
          onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
            showComparison: e.target.checked,
          })}
          className="rounded border-gray-300"
        />
      </div>
      {component.properties.showComparison && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Change Percentage
          </label>
          <input
            type="number"
            value={component.properties.change || '0'}
            onChange={(e) => updateComponentProperties(currentCanvasId, selectedComponent, {
              change: e.target.value,
            })}
            className="w-full border rounded-lg px-3 py-2"
            step="0.1"
          />
        </div>
      )}
    </div>
  );
};

export default ScorecardProperties;