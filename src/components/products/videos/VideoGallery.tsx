
import React, { useState } from 'react';
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
import { cn } from '@/lib/utils';

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

  if (videos.length === 0) {
    return <VideoEmptyState type="gallery" onAddClick={onAddClick} />;
  }

  return (
    <div className={`min-h-[300px] ${isMobile ? 'flex flex-col gap-4' : 'grid grid-cols-1 md:grid-cols-3 gap-4'}`}>
      <div className={isMobile ? 'order-2' : 'col-span-1 md:col-span-1 h-fit'}>
        <ScrollArea className={`${isMobile ? 'max-h-[200px]' : 'max-h-[600px]'} pr-4`}>
          <div className={isMobile ? 'flex gap-2 overflow-x-auto pb-2' : 'flex flex-col gap-2'}>
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
        </ScrollArea>
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
