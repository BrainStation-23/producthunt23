
import React from 'react';
import { Video } from '@/types/product';
import VideoDetails from './VideoDetails';
import VideoEmptyState from './VideoEmptyState';
import { useIsMobile } from '@/hooks/use-mobile';
import VideoCarousel from './VideoCarousel';
import ThumbnailStrip from './ThumbnailStrip';

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

  if (videos.length === 0) {
    return <VideoEmptyState type="gallery" onAddClick={onAddClick} />;
  }

  return (
    <div className="space-y-8">
      {/* Media section - full width at top */}
      <div className="w-full space-y-4">
        {/* Main video carousel */}
        <VideoCarousel 
          videos={videos}
          selectedVideoIndex={selectedVideoIndex}
          onSelectVideo={onSelectVideo}
        />
        
        {/* Thumbnails strip with navigation */}
        <ThumbnailStrip
          items={videos.map((video, index) => {
            const videoInfo = getVideoInfo(video.video_url);
            return {
              id: index.toString(),
              url: videoInfo.thumbnail || '/placeholder.svg',
              title: video.title || `Video ${index + 1}`,
              subtitle: videoInfo.platform || 'Video',
            };
          })}
          selectedItemIndex={selectedVideoIndex}
          onSelectItem={onSelectVideo}
        />
      </div>

      {/* Video Details Form - full width at bottom */}
      <div className="w-full">
        {selectedVideoIndex !== null ? (
          videos.length > 0 ? (
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
          )
        ) : (
          <VideoEmptyState type="details" />
        )}
      </div>
    </div>
  );
};

// Import getVideoInfo at the top
import { getVideoInfo } from '@/utils/videoUtils';

export default VideoGallery;
