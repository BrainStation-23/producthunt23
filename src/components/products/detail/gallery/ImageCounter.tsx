
import React from 'react';

interface ImageCounterProps {
  current: number;
  total: number;
}

const ImageCounter: React.FC<ImageCounterProps> = ({ current, total }) => {
  return (
    <div className="text-center text-sm font-medium bg-background/80 backdrop-blur-sm py-1 px-3 rounded-full border shadow-sm inline-block mx-auto">
      {current + 1} of {total}
    </div>
  );
};

export default ImageCounter;
