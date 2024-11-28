import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DataCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

const DataCard: React.FC<DataCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-blue-100 rounded-lg">
          {icon}
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span className="text-sm font-medium">{Math.abs(change)}%</span>
        </div>
      </div>
      <h3 className="mt-4 text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
};

export default DataCard;