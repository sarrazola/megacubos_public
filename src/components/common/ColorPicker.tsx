import React from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const colors = [
    '#000000', '#4B5563', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899',
    '#FFFFFF', '#9CA3AF', '#FCA5A5', '#FCD34D', '#6EE7B7', '#93C5FD', '#A5B4FC', '#C4B5FD', '#F9A8D4',
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`w-6 h-6 rounded-full border-2 ${
            color === c ? 'border-blue-500' : 'border-gray-200'
          }`}
          style={{ backgroundColor: c }}
          title={c}
        />
      ))}
    </div>
  );
};

export default ColorPicker;