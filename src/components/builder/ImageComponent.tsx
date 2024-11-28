import React from 'react';

interface ImageComponentProps {
  url: string;
  alt?: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ url, alt }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?ixid=2yJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1200&h=800&q=80';

  return (
    <div className="w-full h-full">
      <img
        src={url || defaultImage}
        alt={alt || 'Image'}
        className="w-full h-full object-cover"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = defaultImage;
        }}
      />
    </div>
  );
};

export default ImageComponent;