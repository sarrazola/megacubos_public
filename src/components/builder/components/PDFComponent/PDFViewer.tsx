import React from 'react';

interface PDFViewerProps {
  url: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url }) => {
  if (!url) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-50 text-gray-400">
        Oh! ! Tehere's No PDF URL provided
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <iframe
        src={`${url}#toolbar=0`}
        style={{
          border: 'none',
          height: '100%',
          width: '100%',
          display: 'block'
        }}
        title="PDF Viewer"
      />
    </div>
  );
};

export default PDFViewer;