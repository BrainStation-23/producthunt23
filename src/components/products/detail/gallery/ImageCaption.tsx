
import React from 'react';

interface ImageCaptionProps {
  title?: string;
  description?: string;
}

const ImageCaption: React.FC<ImageCaptionProps> = ({ title, description }) => {
  if (!title && !description) return null;
  
  return (
    <div className="mt-2 text-center">
      {title && <h4 className="font-medium text-sm">{title}</h4>}
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  );
};

export default ImageCaption;
