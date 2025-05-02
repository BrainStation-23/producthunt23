
import React, { useState } from 'react';
import { ProductVideo } from '@/types/product';
import { getEmbedUrl, getVideoInfo } from '@/utils/videoUtils';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProductVideosProps {
  videos: ProductVideo[];
}

const ProductVideos: React.FC<ProductVideosProps> = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const thumbnailScrollRef = React.useRef<HTMLDivElement>(null);

  // Check if scrolling is possible
  const checkScrollability = () => {
    if (!thumbnailScrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = thumbnailScrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
  };

  // Effect to check scrollability on mount and when videos change
  React.useEffect(() => {
    checkScrollability();
    // Add resize observer to check scrollability when window resizes
    const resizeObserver = new ResizeObserver(checkScrollability);
    if (thumbnailScrollRef.current) {
      resizeObserver.observe(thumbnailScrollRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [videos]);

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (!thumbnailScrollRef.current) return;
    
    const scrollAmount = 250;
    const currentScroll = thumbnailScrollRef.current.scrollLeft;
    
    thumbnailScrollRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
    
    // Update scroll buttons state after scrolling
    setTimeout(checkScrollability, 300);
  };

  // Handle carousel changes - updated to match the expected type
  const handleCarouselChange = (event: React.SyntheticEvent<HTMLDivElement>) => {
    // Find the current slide index from the carousel
    const carousel = event.currentTarget;
    if (!carousel) return;
    
    // Get all slide elements
    const slides = carousel.querySelectorAll('[role="group"]');
    if (!slides.length) return;
    
    // Calculate the current index based on scroll position
    const viewportWidth = carousel.clientWidth;
    const scrollLeft = carousel.scrollLeft;
    const newIndex = Math.round(scrollLeft / viewportWidth);
    
    // Update state if the index changed
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentIndex(newIndex);
    }
  };

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Carousel className="w-full" onSelect={handleCarouselChange}>
        <CarouselContent>
          {videos.map((video, index) => (
            <CarouselItem key={video.id} className="basis-full">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border">
                <iframe
                  src={getEmbedUrl(video.video_url)}
                  title={video.title || `Video ${index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              {video.title && (
                <h4 className="font-medium text-center mt-2">{video.title}</h4>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      {/* Image counter */}
      <div className="text-center text-sm text-muted-foreground">
        {currentIndex + 1} of {videos.length}
      </div>

      {/* Thumbnail strip with navigation */}
      {videos.length > 1 && (
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm transition-opacity ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
            onClick={() => scrollThumbnails('left')}
            disabled={!canScrollLeft}
            type="button"
            aria-label="Scroll thumbnails left"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>

          {/* Native scrollable container */}
          <div className="relative px-10 overflow-hidden">
            <div 
              ref={thumbnailScrollRef}
              className="flex gap-2 pb-4 overflow-x-auto scrollbar-hide"
              style={{ scrollBehavior: 'smooth' }}
              onScroll={checkScrollability}
            >
              {videos.map((video, index) => {
                const videoInfo = getVideoInfo(video.video_url);
                return (
                  <TooltipProvider key={video.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className={`relative flex-shrink-0 w-20 h-20 overflow-hidden rounded border-2 cursor-pointer
                            ${currentIndex === index ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                          onClick={() => {
                            setCurrentIndex(index);
                            const carousel = document.querySelector('[data-radix-carousel-viewport]');
                            if (carousel) {
                              carousel.scrollTo({
                                left: index * carousel.clientWidth,
                                behavior: 'smooth'
                              });
                            }
                          }}
                        >
                          {videoInfo.thumbnail ? (
                            <img
                              src={videoInfo.thumbnail}
                              alt={video.title || `Video ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full bg-gray-100">
                              <span className="text-xs text-gray-500">Video {index + 1}</span>
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {video.title || `Video ${index + 1}`}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm transition-opacity ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
            onClick={() => scrollThumbnails('right')}
            disabled={!canScrollRight}
            type="button"
            aria-label="Scroll thumbnails right"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductVideos;
