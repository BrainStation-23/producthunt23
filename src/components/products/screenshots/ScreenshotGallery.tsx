
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Screenshot } from '@/types/product';
import ScreenshotThumbnail from './ScreenshotThumbnail';
import ScreenshotDetails from './ScreenshotDetails';
import ScreenshotEmptyState from './ScreenshotEmptyState';
import { useIsMobile } from '@/hooks/use-mobile';

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
    <div className={`min-h-[300px] ${isMobile ? 'flex flex-col gap-4' : 'grid grid-cols-1 md:grid-cols-3 gap-4'}`}>
      <div className={isMobile ? 'order-2' : 'col-span-1 md:col-span-1 h-fit'}>
        <ScrollArea className={`${isMobile ? 'max-h-[200px]' : 'max-h-[600px]'} pr-4`}>
          <div className={isMobile ? 'flex gap-2 overflow-x-auto pb-2' : ''}>
            {screenshots.map((screenshot, index) => (
              <ScreenshotThumbnail
                key={index}
                screenshot={screenshot}
                index={index}
                isSelected={selectedScreenshotIndex === index}
                onClick={() => onSelectScreenshot(index)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className={isMobile ? 'order-1' : 'col-span-1 md:col-span-2'}>
        {selectedScreenshotIndex !== null ? (
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
        )}
      </div>
    </div>
  );
};

export default ScreenshotGallery;
