
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Video } from '@/types/product';
import VideoThumbnail from './VideoThumbnail';
import VideoDetails from './VideoDetails';
import VideoEmptyState from './VideoEmptyState';

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
  if (videos.length === 0) {
    return <VideoEmptyState type="gallery" onAddClick={onAddClick} />;
  }

  return (
    <div className="min-h-[300px] grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-1 md:col-span-1 h-fit">
        <ScrollArea className="max-h-[600px] pr-4">
          {videos.map((video, index) => (
            <VideoThumbnail
              key={index}
              video={video}
              index={index}
              isSelected={selectedVideoIndex === index}
              onClick={() => onSelectVideo(index)}
            />
          ))}
        </ScrollArea>
      </div>

      <div className="col-span-1 md:col-span-2">
        {selectedVideoIndex !== null ? (
          <VideoDetails
            video={videos[selectedVideoIndex]}
            index={selectedVideoIndex}
            totalVideos={videos.length}
            onUpdateField={(field, value) => onUpdateVideoField(selectedVideoIndex, field, value)}
            onMoveVideo={(direction) => onMoveVideo(selectedVideoIndex, direction)}
            onRemoveVideo={() => onRemoveVideo(selectedVideoIndex)}
          />
        ) : (
          <VideoEmptyState type="details" />
        )}
      </div>
    </div>
  );
};

export default VideoGallery;
