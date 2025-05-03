
import React, { useState, useEffect } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { ProductScreenshot } from '@/types/product';
import ImageCounter from './gallery/ImageCounter';
import ImageCaption from './gallery/ImageCaption';
import ScreenshotZoomModal from './gallery/ScreenshotZoomModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ProductScreenshotGalleryProps {
  screenshots: ProductScreenshot[];
}

const ProductScreenshotGallery: React.FC<ProductScreenshotGalleryProps> = ({ screenshots }) => {
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [modalApi, setModalApi] = useState<CarouselApi>();

  const openZoomModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsZoomModalOpen(true);
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

  const handlePrevious = () => {
    api?.scrollPrev();
  };

  const handleNext = () => {
    api?.scrollNext();
  };

  return (
    <div className="relative w-full space-y-4">
      <div className="relative rounded-lg overflow-hidden">
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
                    className="h-full w-full object-contain cursor-zoom-in transition-transform hover:scale-105"
                    onClick={() => openZoomModal(index)}
                  />
                </div>
                <ImageCaption 
                  title={screenshot.title} 
                  description={screenshot.description} 
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Bottom Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button 
              className="p-2 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 flex items-center justify-center"
              onClick={handlePrevious}
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {/* Dot Indicators */}
            <div className="flex gap-2 items-center">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    currentImageIndex === index 
                      ? "bg-primary w-3 h-3" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  onClick={() => {
                    api?.scrollTo(index);
                    setCurrentImageIndex(index);
                  }}
                  aria-label={`Go to screenshot ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              className="p-2 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 flex items-center justify-center"
              onClick={handleNext}
              aria-label="Next screenshot"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </Carousel>

        {/* Image Counter */}
        <div className="absolute top-2 right-2 z-10">
          <ImageCounter current={currentImageIndex} total={screenshots.length} />
        </div>
      </div>

      {/* Improved ZoomModal */}
      <ScreenshotZoomModal
        screenshots={screenshots}
        isOpen={isZoomModalOpen}
        onOpenChange={setIsZoomModalOpen}
        currentIndex={currentImageIndex}
        setCarouselApi={setModalApi}
      />
    </div>
  );
};

export default ProductScreenshotGallery;
