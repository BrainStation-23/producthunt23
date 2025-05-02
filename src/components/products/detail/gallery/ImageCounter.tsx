
import React from 'react';

interface ImageCounterProps {
  current: number;
  total: number;
}

const ImageCounter: React.FC<ImageCounterProps> = ({ current, total }) => {
  return (
    <div className="text-center text-sm text-muted-foreground">
      {current + 1} of {total}
    </div>
  );
};

export default ImageCounter;
