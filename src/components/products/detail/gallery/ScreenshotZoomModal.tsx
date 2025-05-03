
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";
import { ProductScreenshot } from '@/types/product';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [api, setApi] = React.useState<CarouselApi>();
  
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-lg w-full h-[90vh] p-0 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center bg-background/95">
          <div className="relative w-full h-full">
            <Carousel 
              className="w-full h-full" 
              setApi={setApi}
            >
              <CarouselContent>
                {screenshots.map((screenshot, index) => (
                  <CarouselItem key={screenshot.id} className="h-full flex items-center justify-center">
                    <div className="relative w-full h-full flex flex-col items-center justify-center py-8">
                      <div className="flex items-center justify-center flex-1 max-h-full">
                        <img
                          src={screenshot.image_url}
                          alt={screenshot.title || `Screenshot ${index + 1}`}
                          className="max-h-[calc(100%-3rem)] max-w-[90%] object-contain"
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
              
              {/* Navigation Controls for Modal */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-6 z-10">
                <button
                  className="relative h-9 w-9 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 flex items-center justify-center"
                  onClick={handlePrevious}
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Previous slide</span>
                </button>
                
                {/* Dot Indicators */}
                <div className="flex gap-2 items-center px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm">
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
                
                <button
                  className="relative h-9 w-9 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 flex items-center justify-center"
                  onClick={handleNext}
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">Next slide</span>
                </button>
              </div>
            </Carousel>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScreenshotZoomModal;
