
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Video } from '@/types/product';
import VideoThumbnail from './VideoThumbnail';
import VideoDetails from './VideoDetails';
import VideoEmptyState from './VideoEmptyState';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { getEmbedUrl } from '@/utils/videoUtils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoGalleryProps {
  videos: Video[];
  selectedVideoIndex: number | null;
  onSelectVideo: (index: number) => void;
  onUpdateVideoField: (index: number, field: keyof Video, value: string) => void;
  onMoveVideo: (index: number, direction: 'up' | 'down') => void;
  onRemoveVideo: (index: number) => void;
  onAddClick: () => void;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({
  videos,
  selectedVideoIndex,
  onSelectVideo,
  onUpdateVideoField,
  onMoveVideo,
  onRemoveVideo,
  onAddClick
}) => {
  const isMobile = useIsMobile();
  const [api, setApi] = useState<CarouselApi>();
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Effect to handle carousel change events
  React.useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      const current = api.selectedScrollSnap();
      if (selectedVideoIndex !== current) {
        onSelectVideo(current);
      }
    });
  }, [api, selectedVideoIndex, onSelectVideo]);

  // Effect to sync the selected thumbnail with the carousel
  React.useEffect(() => {
    if (!api || selectedVideoIndex === null) return;
    api.scrollTo(selectedVideoIndex);
  }, [api, selectedVideoIndex]);

  // Check if scrolling is possible
  const checkScrollability = () => {
    if (!thumbnailScrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = thumbnailScrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
  };

  // Effect to check scrollability on mount and when videos change
  useEffect(() => {
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
    
    const scrollAmount = 250; // Increased scroll amount for better navigation
    const currentScroll = thumbnailScrollRef.current.scrollLeft;
    
    thumbnailScrollRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
    
    // Update scroll buttons state after scrolling
    setTimeout(checkScrollability, 300);
  };

  if (videos.length === 0) {
    return <VideoEmptyState type="gallery" onAddClick={onAddClick} />;
  }

  return (
    <div className={`min-h-[300px] ${isMobile ? 'flex flex-col gap-4' : 'grid grid-cols-1 md:grid-cols-3 gap-4'}`}>
      <div className={isMobile ? 'order-2' : 'col-span-1 md:col-span-1 h-fit'}>
        {/* Horizontal thumbnail navigation */}
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

          {/* Native scrollable container replacing ScrollArea */}
          <div className="relative px-10">
            <div 
              ref={thumbnailScrollRef}
              className="flex gap-2 pb-4 overflow-x-auto scrollbar-hide"
              style={{ scrollBehavior: 'smooth' }}
              onScroll={checkScrollability}
            >
              {videos.map((video, index) => (
                <VideoThumbnail
                  key={index}
                  video={video}
                  index={index}
                  isSelected={selectedVideoIndex === index}
                  onClick={() => onSelectVideo(index)}
                />
              ))}
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
      </div>

      <div className={isMobile ? 'order-1' : 'col-span-1 md:col-span-2'}>
        {selectedVideoIndex !== null ? (
          videos.length > 0 ? (
            <div className="space-y-4">
              {/* Video Carousel */}
              <Carousel 
                className="w-full max-w-full"
                setApi={setApi}
              >
                <CarouselContent>
                  {videos.map((video, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                        <iframe
                          src={getEmbedUrl(video.video_url)}
                          title={video.title || `Video ${index + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
              </Carousel>

              {/* Video Counter */}
              <div className="text-center text-sm text-muted-foreground">
                {selectedVideoIndex + 1} of {videos.length}
              </div>

              {/* Video Details Form */}
              <VideoDetails
                video={videos[selectedVideoIndex]}
                index={selectedVideoIndex}
                totalVideos={videos.length}
                onUpdateField={(field, value) => onUpdateVideoField(selectedVideoIndex, field, value)}
                onMoveVideo={(direction) => onMoveVideo(selectedVideoIndex, direction)}
                onRemoveVideo={() => onRemoveVideo(selectedVideoIndex)}
              />
            </div>
          ) : (
            <VideoEmptyState type="details" />
          )
        ) : (
          <VideoEmptyState type="details" />
        )}
      </div>
    </div>
  );
};

export default VideoGallery;
