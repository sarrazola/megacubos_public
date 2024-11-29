import React from 'react';

interface ButtonComponentProps {
  label: string;
  url: string;
  backgroundColor?: string;
  textColor?: string;
  isEditorMode?: boolean;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  label,
  url,
  backgroundColor = '#16a34a',
  textColor = '#ffffff',
  isEditorMode = false,
}) => {
  return (
    <a
      href={url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block px-4 py-2 rounded-lg ${
        isEditorMode ? 'hover:opacity-80' : ''
      }`}
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {label || 'Button'}
    </a>
  );
};

export default ButtonComponent;