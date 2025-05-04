
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";
import { ProductScreenshot } from '@/types/product';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ScreenshotZoomModalProps {
  screenshots: ProductScreenshot[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentIndex: number;
  setCarouselApi: (api: CarouselApi) => void;
}

const ScreenshotZoomModal: React.FC<ScreenshotZoomModalProps> = ({
  screenshots,
  isOpen,
  onOpenChange,
  currentIndex,
  setCarouselApi
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentScreenshot, setCurrentScreenshot] = useState<number>(currentIndex);
  
  // Handle API reference
  useEffect(() => {
    if (!api) return;
    setCarouselApi(api);
    
    // Sync with current index
    api.scrollTo(currentIndex);
    
    // Add event listener for keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') api.scrollPrev();
      if (e.key === 'ArrowRight') api.scrollNext();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [api, setCarouselApi, currentIndex]);
  
  // Update current slide index when carousel changes
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCurrentScreenshot(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Set initial index
  useEffect(() => {
    if (api) {
      api.scrollTo(currentIndex);
      setCurrentScreenshot(currentIndex);
    }
  }, [currentIndex, api, isOpen]);

  const handlePrevious = () => {
    api?.scrollPrev();
  };

  const handleNext = () => {
    api?.scrollNext();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[1200px] h-[90vh] p-0 flex items-center justify-center border-none bg-background/95 backdrop-blur-sm">
        <DialogTitle className="sr-only">
          {screenshots[currentScreenshot]?.title || 'Screenshot'}
        </DialogTitle>
        
        {/* Close button with improved position and visibility */}
        <button 
          onClick={() => onOpenChange(false)} 
          type="button" /* Added explicit button type */
          className="absolute right-4 top-4 z-50 rounded-full bg-background/70 hover:bg-background p-2 shadow-md transition-all"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="relative w-full h-full flex items-center justify-center">
          <Carousel className="w-full h-full" setApi={setApi}>
            <CarouselContent>
              {screenshots.map((screenshot, index) => (
                <CarouselItem key={screenshot.id} className="h-full flex items-center justify-center">
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center flex-1 w-full overflow-hidden">
                      <img
                        src={screenshot.image_url}
                        alt={screenshot.title || `Screenshot ${index + 1}`}
                        className="max-h-[calc(100vh-12rem)] max-w-[90%] object-contain transition-all duration-200 select-none"
                      />
                    </div>
                    
                    {/* Caption area with improved styling */}
                    {(screenshot.title || screenshot.description) && (
                      <div className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none">
                        <div className="bg-background/80 backdrop-blur-sm py-3 px-6 rounded-lg shadow-md max-w-2xl transition-opacity">
                          {screenshot.title && (
                            <h3 className="text-center font-medium text-base md:text-lg">
                              {screenshot.title}
                            </h3>
                          )}
                          {screenshot.description && (
                            <p className="text-center text-muted-foreground text-sm mt-1">
                              {screenshot.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Improved navigation buttons on the sides */}
            <button
              onClick={handlePrevious}
              type="button" /* Added explicit button type */
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-background/70 hover:bg-background p-3 shadow-md transition-all hidden md:flex"
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={handleNext}
              type="button" /* Added explicit button type */
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-background/70 hover:bg-background p-3 shadow-md transition-all hidden md:flex"
              aria-label="Next screenshot"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Mobile-optimized bottom navigation */}
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 z-30">
              <div className="flex gap-2 items-center px-4 py-2 rounded-full bg-background/70 backdrop-blur-sm">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    type="button" /* Added explicit button type */
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      currentScreenshot === index 
                        ? "bg-primary w-3 h-3" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Go to screenshot ${index + 1}`}
                    aria-current={currentScreenshot === index ? "true" : "false"}
                  />
                ))}
              </div>
            </div>
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScreenshotZoomModal;
