import React from 'react';

interface PDFComponentProps {
  url: string;
}

const PDFComponent: React.FC<PDFComponentProps> = ({ url }) => {
  if (!url) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-50 text-gray-400">
        No PDF
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <iframe
        src={`${url}#toolbar=0`}
        style={{
          border: 'none',
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        title="PDF Viewer"
      />
    </div>
  );
};

export default PDFComponent;