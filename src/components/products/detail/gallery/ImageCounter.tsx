
import React from 'react';

interface ImageCounterProps {
  current: number;
  total: number;
}

const ImageCounter: React.FC<ImageCounterProps> = ({ current, total }) => {
  return (
    <div className="inline-flex items-center justify-center px-2 py-1 bg-background/80 backdrop-blur-sm text-xs font-medium rounded-md">
      {current} / {total}
    </div>
  );
};

export default ImageCounter;
