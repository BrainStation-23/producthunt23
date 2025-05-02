
import React, { useState } from 'react';
import { Screenshot } from '@/types/product';
import ScreenshotDetails from './ScreenshotDetails';
import ScreenshotEmptyState from './ScreenshotEmptyState';
import { useIsMobile } from '@/hooks/use-mobile';
import ScreenshotCarousel from './ScreenshotCarousel';
import ThumbnailStrip from '../videos/ThumbnailStrip';

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
  selectedScreenshotIndex: number | null;
  onSelectScreenshot: (index: number) => void;
  onUpdateScreenshotField: (index: number, field: keyof Screenshot, value: string) => void;
  onMoveScreenshot: (index: number, direction: 'up' | 'down') => void;
  onRemoveScreenshot: (index: number) => void;
  onAddClick: () => void;
}

const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({
  screenshots,
  selectedScreenshotIndex,
  onSelectScreenshot,
  onUpdateScreenshotField,
  onMoveScreenshot,
  onRemoveScreenshot,
  onAddClick
}) => {
  const isMobile = useIsMobile();

  if (screenshots.length === 0) {
    return <ScreenshotEmptyState type="gallery" onAddClick={onAddClick} />;
  }

  return (
    <div className="space-y-8">
      {/* Media section - full width at top */}
      <div className="w-full space-y-4">
        {/* Main screenshot carousel */}
        <ScreenshotCarousel 
          screenshots={screenshots}
          selectedScreenshotIndex={selectedScreenshotIndex}
          onSelectScreenshot={onSelectScreenshot}
        />
        
        {/* Thumbnails strip with navigation */}
        <ThumbnailStrip
          items={screenshots.map((screenshot, index) => ({
            id: index.toString(),
            url: screenshot.image_url,
            title: screenshot.title || `Screenshot ${index + 1}`,
            subtitle: 'Screenshot',
          }))}
          selectedItemIndex={selectedScreenshotIndex}
          onSelectItem={onSelectScreenshot}
        />
      </div>

      {/* Screenshot Details Form - full width at bottom */}
      <div className="w-full">
        {selectedScreenshotIndex !== null ? (
          screenshots.length > 0 ? (
            <ScreenshotDetails
              screenshot={screenshots[selectedScreenshotIndex]}
              index={selectedScreenshotIndex}
              totalScreenshots={screenshots.length}
              onUpdateField={(field, value) => onUpdateScreenshotField(selectedScreenshotIndex, field, value)}
              onMoveScreenshot={(direction) => onMoveScreenshot(selectedScreenshotIndex, direction)}
              onRemoveScreenshot={() => onRemoveScreenshot(selectedScreenshotIndex)}
            />
          ) : (
            <ScreenshotEmptyState type="details" />
          )
        ) : (
          <ScreenshotEmptyState type="details" />
        )}
      </div>
    </div>
  );
};

export default ScreenshotGallery;
