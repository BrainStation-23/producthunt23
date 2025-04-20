
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ZoomIn, ZoomOut } from "lucide-react";
import { ProductScreenshot } from '@/types/product';

interface ProductScreenshotGalleryProps {
  screenshots: ProductScreenshot[];
}

const ProductScreenshotGallery: React.FC<ProductScreenshotGalleryProps> = ({ screenshots }) => {
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scale, setScale] = useState(1);

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

  return (
    <div className="relative w-full">
      <Carousel className="w-full max-w-full">
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
              {screenshot.title && (
                <p className="mt-2 text-sm text-center text-muted-foreground">
                  {screenshot.title}
                </p>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
      </Carousel>

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
            
            <Carousel className="w-full h-full" defaultIndex={currentImageIndex}>
              <CarouselContent>
                {screenshots.map((screenshot, index) => (
                  <CarouselItem key={screenshot.id} className="h-full flex items-center justify-center">
                    <div 
                      className="relative w-full h-full flex items-center justify-center transition-transform duration-200"
                      style={{ transform: `scale(${scale})` }}
                    >
                      <img
                        src={screenshot.image_url}
                        alt={screenshot.title || `Screenshot ${index + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
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
