
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Screenshot } from '@/types/product';

interface ScreenshotThumbnailProps {
  screenshot: Screenshot;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

const ScreenshotThumbnail: React.FC<ScreenshotThumbnailProps> = ({ 
  screenshot, 
  index, 
  isSelected, 
  onClick 
}) => {
  return (
    <Card 
      className={cn(
        "mb-2 cursor-pointer overflow-hidden transition-all", 
        isSelected ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/50"
      )}
      onClick={onClick}
    >
      <div className="relative aspect-video">
        <img
          src={screenshot.image_url}
          alt={screenshot.title || `Screenshot ${index + 1}`}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      </div>
      <CardContent className="p-2">
        <p className="text-xs font-medium truncate">
          {screenshot.title || `Screenshot ${index + 1}`}
        </p>
      </CardContent>
    </Card>
  );
};

export default ScreenshotThumbnail;
