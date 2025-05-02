
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
import ThumbnailGallery from './gallery/ThumbnailGallery';
import ImageCounter from './gallery/ImageCounter';
import ImageCaption from './gallery/ImageCaption';
import ScreenshotZoomModal from './gallery/ScreenshotZoomModal';

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
      <div className="relative">
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
                <ImageCaption 
                  title={screenshot.title} 
                  description={screenshot.description} 
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      </div>

      <ImageCounter current={currentImageIndex} total={screenshots.length} />

      <ThumbnailGallery
        items={screenshots}
        currentIndex={currentImageIndex}
        onSelectItem={(index) => {
          setCurrentImageIndex(index);
          api?.scrollTo(index);
        }}
      />

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
