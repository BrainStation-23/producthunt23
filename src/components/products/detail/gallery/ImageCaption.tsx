
import React from 'react';

interface ImageCaptionProps {
  title?: string | null;
  description?: string | null;
}

const ImageCaption: React.FC<ImageCaptionProps> = ({ title, description }) => {
  if (!title && !description) return null;
  
  return (
    <div className="mt-2 space-y-1">
      {title && (
        <p className="text-sm font-medium text-center">
          {title}
        </p>
      )}
      {description && (
        <p className="text-sm text-center text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
};

export default ImageCaption;
