
import React, { useState } from 'react';
import { ProductVideo } from '@/types/product';
import { getEmbedUrl, getVideoInfo } from '@/utils/videoUtils';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Play } from 'lucide-react';

interface ProductVideoGalleryProps {
  videos: ProductVideo[];
}

const ProductVideoGallery: React.FC<ProductVideoGalleryProps> = ({ videos }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  // Effect to handle carousel change events
  React.useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      setCurrentVideoIndex(api.selectedScrollSnap());
    });
  }, [api]);

  // Effect to sync the selected thumbnail with the carousel
  React.useEffect(() => {
    if (!api) return;
    api.scrollTo(currentVideoIndex);
  }, [api, currentVideoIndex]);

  return (
    <div className="relative w-full space-y-4">
      {/* Main video carousel */}
      <Carousel 
        className="w-full max-w-full"
        setApi={setApi}
      >
        <CarouselContent>
          {videos.map((video, index) => (
            <CarouselItem key={video.id}>
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
              {video.title && (
                <p className="mt-2 text-sm font-medium text-center">
                  {video.title}
                </p>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
      </Carousel>

      {/* Video counter */}
      <div className="text-center text-sm text-muted-foreground">
        {currentVideoIndex + 1} of {videos.length}
      </div>

      {/* Thumbnail strip */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-4">
          {videos.map((video, index) => {
            const videoInfo = getVideoInfo(video.video_url);
            
            return (
              <TooltipProvider key={video.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        setCurrentVideoIndex(index);
                        api?.scrollTo(index);
                      }}
                      className={cn(
                        "relative flex-shrink-0 w-20 h-20 overflow-hidden rounded border-2 transition-all",
                        currentVideoIndex === index 
                          ? "border-primary" 
                          : "border-transparent hover:border-primary/50"
                      )}
                    >
                      {videoInfo.thumbnail ? (
                        <>
                          <img
                            src={videoInfo.thumbnail}
                            alt={video.title || `Video ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <Play className="h-4 w-4 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200">
                          <Play className="h-4 w-4" />
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {video.title || `Video ${index + 1}`}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProductVideoGallery;
