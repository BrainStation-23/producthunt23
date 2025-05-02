
import React, { useState, useEffect } from 'react';
import { Video } from '@/types/product';
import { getEmbedUrl } from '@/utils/videoUtils';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";

interface VideoCarouselProps {
  videos: Video[];
  selectedVideoIndex: number | null;
  onSelectVideo: (index: number) => void;
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({
  videos,
  selectedVideoIndex,
  onSelectVideo
}) => {
  const [api, setApi] = useState<CarouselApi>();

  // Effect to handle carousel change events
  useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      const current = api.selectedScrollSnap();
      if (selectedVideoIndex !== current) {
        onSelectVideo(current);
      }
    });
  }, [api, selectedVideoIndex, onSelectVideo]);

  // Effect to sync the selected thumbnail with the carousel
  useEffect(() => {
    if (!api || selectedVideoIndex === null) return;
    api.scrollTo(selectedVideoIndex);
  }, [api, selectedVideoIndex]);

  return (
    <div className="space-y-4">
      <Carousel 
        className="w-full"
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
        {selectedVideoIndex !== null && videos.length > 0 ? 
          `${selectedVideoIndex + 1} of ${videos.length}` : 
          `${videos.length} videos`}
      </div>
    </div>
  );
};

export default VideoCarousel;
