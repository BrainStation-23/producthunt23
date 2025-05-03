
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";
import { ProductScreenshot } from '@/types/product';
import ZoomControls from './ZoomControls';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';

interface ScreenshotZoomModalProps {
  screenshots: ProductScreenshot[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentIndex: number;
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  setCarouselApi: (api: CarouselApi) => void;
}

const ScreenshotZoomModal: React.FC<ScreenshotZoomModalProps> = ({
  screenshots,
  isOpen,
  onOpenChange,
  currentIndex,
  scale,
  onZoomIn,
  onZoomOut,
  setCarouselApi
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Handle API reference
  React.useEffect(() => {
    if (!api) return;
    setCarouselApi(api);
    
    // Sync with current index
    api.scrollTo(currentIndex);
  }, [api, setCarouselApi, currentIndex]);
  
  const handlePrevious = () => {
    api?.scrollPrev();
  };

  const handleNext = () => {
    api?.scrollNext();
  };
  
  // Handle keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, api]);
  
  // Reset drag position when image changes or modal closes
  React.useEffect(() => {
    setDragPosition({ x: 0, y: 0 });
  }, [currentIndex, isOpen]);
  
  // Mouse drag handlers for zoomed images
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setDragPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[1200px] h-[90vh] p-0 gap-0 border-none bg-background/95 backdrop-blur-sm">
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4 z-50 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
        
        <ZoomControls 
          scale={scale}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
        />
        
        <div className="relative w-full h-full flex items-center justify-center">
          <Carousel 
            className="w-full h-full px-12" 
            setApi={setApi}
          >
            <CarouselContent>
              {screenshots.map((screenshot, index) => (
                <CarouselItem key={screenshot.id} className="h-full flex items-center justify-center">
                  <div className="relative w-full h-full flex flex-col items-center justify-center py-8">
                    <div 
                      className={cn(
                        "flex items-center justify-center transition-transform duration-200 flex-1",
                        isDragging ? "cursor-grabbing" : scale > 1 ? "cursor-grab" : "cursor-default"
                      )}
                      style={{ 
                        transform: `scale(${scale}) translate(${dragPosition.x / scale}px, ${dragPosition.y / scale}px)` 
                      }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    >
                      <img
                        src={screenshot.image_url}
                        alt={screenshot.title || `Screenshot ${index + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    
                    {(screenshot.title || screenshot.description) && (
                      <div className="absolute bottom-8 left-0 right-0 mx-auto w-full max-w-2xl bg-background/80 backdrop-blur-sm p-3 rounded-md">
                        {screenshot.title && (
                          <h3 className="text-center font-medium">
                            {screenshot.title}
                          </h3>
                        )}
                        {screenshot.description && (
                          <p className="text-center text-muted-foreground mt-1">
                            {screenshot.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Controls */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous slide</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next slide</span>
            </Button>
            
            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 z-10">
              <div className="flex gap-2 items-center px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      currentIndex === index 
                        ? "bg-primary w-3 h-3" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Go to screenshot ${index + 1}`}
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
