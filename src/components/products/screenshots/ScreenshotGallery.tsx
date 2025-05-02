
import React, { useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Screenshot } from '@/types/product';
import ScreenshotThumbnail from './ScreenshotThumbnail';
import ScreenshotDetails from './ScreenshotDetails';
import ScreenshotEmptyState from './ScreenshotEmptyState';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (!thumbnailScrollRef.current) return;
    
    const scrollAmount = 100; // Adjust scroll amount as needed
    const currentScroll = thumbnailScrollRef.current.scrollLeft;
    
    thumbnailScrollRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };

  if (screenshots.length === 0) {
    return <ScreenshotEmptyState type="gallery" onAddClick={onAddClick} />;
  }

  return (
    <div className={`min-h-[400px] ${isMobile ? 'flex flex-col gap-4' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}`}>
      {/* Main carousel view */}
      <div className={isMobile ? 'order-1' : ''}>
        <div className="space-y-4">
          <Carousel className="w-full">
            <CarouselContent>
              {screenshots.map((screenshot, index) => (
                <CarouselItem key={index} className="basis-full">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border">
                    <img
                      src={screenshot.image_url}
                      alt={screenshot.title || `Screenshot ${index + 1}`}
                      className="object-cover w-full h-full cursor-pointer"
                      onClick={() => onSelectScreenshot(index)}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious 
              className="left-2" 
              type="button"
            />
            <CarouselNext 
              className="right-2" 
              type="button"
            />
          </Carousel>

          {/* Image counter */}
          <div className="text-center text-sm text-muted-foreground">
            {selectedScreenshotIndex !== null ? (
              `${selectedScreenshotIndex + 1} of ${screenshots.length}`
            ) : (
              `${screenshots.length} screenshots`
            )}
          </div>

          {/* Thumbnail strip with navigation */}
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={() => scrollThumbnails('left')}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Scroll left</span>
            </Button>

            <ScrollArea className="w-full">
              <div 
                ref={thumbnailScrollRef}
                className="flex gap-2 pb-4 px-10 overflow-x-auto scrollbar-hide"
                style={{ scrollBehavior: 'smooth' }}
              >
                {screenshots.map((screenshot, index) => (
                  <div 
                    key={index}
                    className={`relative flex-shrink-0 w-20 h-20 overflow-hidden rounded border-2 cursor-pointer
                      ${selectedScreenshotIndex === index ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                    onClick={() => onSelectScreenshot(index)}
                  >
                    <img
                      src={screenshot.image_url}
                      alt={screenshot.title || `Screenshot ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={() => scrollThumbnails('right')}
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Scroll right</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Details/Edit panel */}
      <div className={isMobile ? 'order-2' : ''}>
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
