import React from 'react';

interface TextComponentProps {
  content: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  bold?: boolean;
}

const TextComponent: React.FC<TextComponentProps> = ({
  content,
  fontSize = 16,
  color = '#000000',
  fontFamily = 'sans-serif',
  bold = false,
}) => {
  return (
    <p
      style={{
        color,
        fontSize: `${fontSize}px`,
        fontWeight: bold ? 'bold' : 'normal',
        fontFamily,
      }}
    >
      {content || 'Text Component'}
    </p>
  );
};

export default TextComponent;