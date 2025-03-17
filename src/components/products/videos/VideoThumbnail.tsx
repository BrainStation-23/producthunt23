
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileVideo, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getVideoInfo } from '@/utils/videoUtils';
import { Video } from '@/types/product';

interface VideoThumbnailProps {
  video: Video;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ 
  video, 
  index, 
  isSelected, 
  onClick 
}) => {
  const videoInfo = getVideoInfo(video.video_url);

  return (
    <Card 
      className={cn(
        "mb-2 cursor-pointer overflow-hidden transition-all",
        isSelected ? "ring-2 ring-primary" : ""
      )}
      onClick={onClick}
    >
      <div className="relative aspect-video group">
        {videoInfo.thumbnail ? (
          <>
            <img
              src={videoInfo.thumbnail}
              alt={video.title || `Video ${index + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
              <Play className="h-8 w-8 text-white" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <FileVideo className="h-8 w-8 text-gray-500" />
          </div>
        )}
      </div>
      <CardContent className="p-2">
        <p className="text-xs font-medium truncate">
          {video.title || `Video ${index + 1}`}
        </p>
        <p className="text-xs text-muted-foreground capitalize">
          {videoInfo.platform || 'Video'}
        </p>
      </CardContent>
    </Card>
  );
};

export default VideoThumbnail;
