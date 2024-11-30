import React from 'react';
import { TrendingUp, TrendingDown, Activity, AlertCircle, BarChart2, Box, 
  DollarSign, Heart, LineChart, Package, ShoppingBag, ShoppingCart, 
  Star, Truck, Users, Zap } from 'lucide-react';

const iconMap = {
  'activity': Activity,
  'alert-circle': AlertCircle,
  'bar-chart': BarChart2,
  'box': Box,
  'dollar': DollarSign,
  'heart': Heart,
  'line-chart': LineChart,
  'package': Package,
  'shopping-bag': ShoppingBag,
  'shopping-cart': ShoppingCart,
  'star': Star,
  'truck': Truck,
  'users': Users,
  'zap': Zap,
};

interface ScorecardComponentProps {
  label: string;
  value: string;
  showComparison?: boolean;
  change?: number;
  selectedIcon?: keyof typeof iconMap;
  iconBackground?: string;
  isEditorMode?: boolean;
}

const ScorecardComponent: React.FC<ScorecardComponentProps> = ({
  label,
  value,
  showComparison = false,
  change = 0,
  selectedIcon = 'dollar',
  iconBackground = '#93C5FD',
  isEditorMode = false,
}) => {
  const isPositive = change >= 0;
  const IconComponent = iconMap[selectedIcon];

  return (
    <div className={`flex items-center justify-between p-4 bg-white rounded-lg ${!isEditorMode ? 'shadow-lg' : ''}`}>
      <div>
        <p className="text-sm text-gray-500">{label || 'Metric'}</p>
        <p className="text-2xl font-semibold mt-1">{value || '0'}</p>
        {showComparison && (
          <div className={`flex items-center gap-1 mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      {IconComponent && (
        <div 
          className="p-2 rounded-lg"
          style={{
            backgroundColor: iconBackground,
            transition: 'background-color 0.2s ease'
          }}
        >
          <IconComponent className="h-5 w-5 text-black-600" />
        </div>
      )}
    </div>
  );
};

export default ScorecardComponent;