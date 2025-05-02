
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { ZoomIn, ZoomOut } from "lucide-react";
import { ProductScreenshot } from '@/types/product';
import { cn } from "@/lib/utils";

interface ProductScreenshotGalleryProps {
  screenshots: ProductScreenshot[];
}

const ProductScreenshotGallery: React.FC<ProductScreenshotGalleryProps> = ({ screenshots }) => {
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [api, setApi] = useState<CarouselApi>();
  const [modalApi, setModalApi] = useState<CarouselApi>();

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 1));
  };

  const openZoomModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsZoomModalOpen(true);
    setScale(1);
  };

  useEffect(() => {
    if (!api || !modalApi) return;

    api.scrollTo(currentImageIndex);
    modalApi.scrollTo(currentImageIndex);
  }, [api, modalApi, currentImageIndex]);

  useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      setCurrentImageIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full space-y-4">
      <Carousel 
        className="w-full max-w-full"
        setApi={setApi}
      >
        <CarouselContent>
          {screenshots.map((screenshot, index) => (
            <CarouselItem key={screenshot.id}>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={screenshot.image_url}
                  alt={screenshot.title || `Screenshot ${index + 1}`}
                  className="h-full w-full object-contain cursor-zoom-in"
                  onClick={() => openZoomModal(index)}
                />
              </div>
              <div className="mt-2 space-y-1">
                {screenshot.title && (
                  <p className="text-sm font-medium text-center">
                    {screenshot.title}
                  </p>
                )}
                {screenshot.description && (
                  <p className="text-sm text-center text-muted-foreground">
                    {screenshot.description}
                  </p>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
      </Carousel>

      {/* Image counter */}
      <div className="text-center text-sm text-muted-foreground">
        {currentImageIndex + 1} of {screenshots.length}
      </div>

      {/* Thumbnail strip */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-4">
          {screenshots.map((screenshot, index) => (
            <button
              key={screenshot.id}
              onClick={() => {
                setCurrentImageIndex(index);
                api?.scrollTo(index);
              }}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 overflow-hidden rounded border-2 transition-all",
                currentImageIndex === index 
                  ? "border-primary" 
                  : "border-transparent hover:border-primary/50"
              )}
            >
              <img
                src={screenshot.image_url}
                alt={screenshot.title || `Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={isZoomModalOpen} onOpenChange={setIsZoomModalOpen}>
        <DialogContent className="max-w-screen-lg w-full h-[90vh] p-0">
          <div className="relative w-full h-full flex items-center justify-center bg-background/95 p-4">
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                disabled={scale >= 3}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                disabled={scale <= 1}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
            
            <Carousel 
              className="w-full h-full" 
              setApi={setModalApi}
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
    </div>
  );
};

export default ProductScreenshotGallery;
