
import React, { useState, useEffect } from 'react';
import { Screenshot } from '@/types/product';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";

interface ScreenshotCarouselProps {
  screenshots: Screenshot[];
  selectedScreenshotIndex: number | null;
  onSelectScreenshot: (index: number) => void;
}

const ScreenshotCarousel: React.FC<ScreenshotCarouselProps> = ({
  screenshots,
  selectedScreenshotIndex,
  onSelectScreenshot
}) => {
  const [api, setApi] = useState<CarouselApi>();

  // Effect to handle carousel change events
  useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      const current = api.selectedScrollSnap();
      if (selectedScreenshotIndex !== current) {
        onSelectScreenshot(current);
      }
    });
  }, [api, selectedScreenshotIndex, onSelectScreenshot]);

  // Effect to sync the selected thumbnail with the carousel
  useEffect(() => {
    if (!api || selectedScreenshotIndex === null) return;
    api.scrollTo(selectedScreenshotIndex);
  }, [api, selectedScreenshotIndex]);

  return (
    <div className="space-y-4">
      <Carousel 
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent>
          {screenshots.map((screenshot, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <img
                  src={screenshot.image_url}
                  alt={screenshot.title || `Screenshot ${index + 1}`}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
      </Carousel>

      {/* Screenshot Counter */}
      <div className="text-center text-sm text-muted-foreground">
        {selectedScreenshotIndex !== null && screenshots.length > 0 ? 
          `${selectedScreenshotIndex + 1} of ${screenshots.length}` : 
          `${screenshots.length} screenshots`}
      </div>
    </div>
  );
};

export default ScreenshotCarousel;
