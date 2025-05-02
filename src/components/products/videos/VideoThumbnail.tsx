
import React from 'react';
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
    <div 
      className={cn(
        "relative flex-shrink-0 w-32 cursor-pointer overflow-hidden transition-all rounded-md border-2",
        isSelected ? "border-primary" : "border-transparent hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <div className="aspect-video group">
        {videoInfo.thumbnail ? (
          <>
            <img
              src={videoInfo.thumbnail}
              alt={video.title || `Video ${index + 1}`}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
              <Play className="h-6 w-6 text-white" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <FileVideo className="h-6 w-6 text-gray-500" />
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="text-xs font-medium truncate">
          {video.title || `Video ${index + 1}`}
        </p>
        <p className="text-xs text-muted-foreground capitalize">
          {videoInfo.platform || 'Video'}
        </p>
      </div>
    </div>
  );
};

export default VideoThumbnail;
