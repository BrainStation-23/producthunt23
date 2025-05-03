
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
    setScale(1); // Reset scale when opening modal
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
              <CarouselItem key={screenshot.id || index}>
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
          
          <div className="absolute inset-y-0 left-2 flex items-center">
            <button 
              className="p-2 rounded-full border border-input bg-background/80 hover:bg-accent hover:text-accent-foreground h-9 w-9 flex items-center justify-center backdrop-blur-sm"
              onClick={handlePrevious}
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
          
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button 
              className="p-2 rounded-full border border-input bg-background/80 hover:bg-accent hover:text-accent-foreground h-9 w-9 flex items-center justify-center backdrop-blur-sm"
              onClick={handleNext}
              aria-label="Next screenshot"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </Carousel>

        {/* Image Counter */}
        <div className="absolute top-2 right-2 z-10">
          <ImageCounter current={currentImageIndex + 1} total={screenshots.length} />
        </div>
      </div>

      {/* Bottom Dot Indicators */}
      <div className="flex items-center justify-center gap-2">
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

      <ScreenshotZoomModal
        screenshots={screenshots}
        isOpen={isZoomModalOpen}
        onOpenChange={setIsZoomModalOpen}
        currentIndex={currentImageIndex}
        scale={scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        setCarouselApi={setModalApi}
      />
    </div>
  );
};

export default ProductScreenshotGallery;
