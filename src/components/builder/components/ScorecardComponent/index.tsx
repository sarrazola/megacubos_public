import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ScorecardComponentProps {
  label: string;
  value: string;
  showComparison?: boolean;
  change?: number;
  icon?: React.ReactNode;
  iconBackground?: string;
  isEditorMode?: boolean;
}

const ScorecardComponent: React.FC<ScorecardComponentProps> = ({
  label,
  value,
  showComparison = false,
  change = 0,
  icon,
  iconBackground = '#EBF5FF',
  isEditorMode = false,
}) => {
  const isPositive = change >= 0;

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
      {icon && (
        <div 
          style={{ 
            backgroundColor: iconBackground,
            padding: '0.5rem',
            borderRadius: '0.5rem',
            color: '#3B82F6'
          }}
        >
          {icon}
        </div>
      )}
    </div>
  );
};

export default ScorecardComponent;