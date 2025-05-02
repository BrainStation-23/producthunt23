
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { ProductScreenshot } from '@/types/product';
import ZoomControls from './ZoomControls';

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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-lg w-full h-[90vh] p-0">
        <div className="relative w-full h-full flex items-center justify-center bg-background/95 p-4">
          <ZoomControls 
            scale={scale}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
          />
          
          <Carousel 
            className="w-full h-full" 
            setApi={setCarouselApi}
          >
            <CarouselContent>
              {screenshots.map((screenshot, index) => (
                <CarouselItem key={screenshot.id} className="h-full flex items-center justify-center">
                  <div className="relative w-full h-full flex flex-col items-center justify-between py-8">
                    <div 
                      className="flex items-center justify-center transition-transform duration-200 flex-1"
                      style={{ transform: `scale(${scale})` }}
                    >
                      <img
                        src={screenshot.image_url}
                        alt={screenshot.title || `Screenshot ${index + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    
                    {(screenshot.title || screenshot.description) && (
                      <div className="w-full mt-4 max-w-2xl bg-background/80 backdrop-blur-sm p-3 rounded-md">
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
            <CarouselPrevious className="absolute left-4" />
            <CarouselNext className="absolute right-4" />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScreenshotZoomModal;
