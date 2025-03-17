
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileVideo, FilePlus } from 'lucide-react';
import { Video } from '@/types/product';
import { isValidVideoUrl } from '@/utils/videoUtils';
import VideoGallery from './videos/VideoGallery';
import AddVideoForm from './videos/AddVideoForm';

interface VideosManagerProps {
  videos: Video[];
  onChange: (videos: Video[]) => void;
}

const VideosManager: React.FC<VideosManagerProps> = ({ videos, onChange }) => {
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [urlError, setUrlError] = useState('');
  const [activeTab, setActiveTab] = useState<'gallery' | 'add'>('gallery');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);

  const addVideo = () => {
    if (!newVideoUrl) return;
    
    if (!isValidVideoUrl(newVideoUrl)) {
      setUrlError('Please enter a valid YouTube or Vimeo URL');
      return;
    }

    const newVideo: Video = {
      video_url: newVideoUrl,
      title: newVideoTitle || undefined,
    };

    onChange([...videos, newVideo]);
    setNewVideoUrl('');
    setNewVideoTitle('');
    setUrlError('');
    setActiveTab('gallery');
  };

  const removeVideo = (index: number) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    onChange(updatedVideos);
    if (selectedVideoIndex === index) {
      setSelectedVideoIndex(null);
    }
  };

  const moveVideo = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === videos.length - 1)
    ) {
      return;
    }

    const updatedVideos = [...videos];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedVideos[index], updatedVideos[newIndex]] = 
    [updatedVideos[newIndex], updatedVideos[index]];
    
    onChange(updatedVideos);

    // Update selected index if needed
    if (selectedVideoIndex === index) {
      setSelectedVideoIndex(newIndex);
    } else if (selectedVideoIndex === newIndex) {
      setSelectedVideoIndex(index);
    }
  };

  const updateVideoField = (index: number, field: keyof Video, value: string) => {
    const updatedVideos = [...videos];
    
    if (field === 'video_url' && value && !isValidVideoUrl(value)) {
      return;
    }

    updatedVideos[index] = {
      ...updatedVideos[index],
      [field]: value || undefined,
    };
    onChange(updatedVideos);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewVideoUrl(e.target.value);
    if (e.target.value && !isValidVideoUrl(e.target.value)) {
      setUrlError('Please enter a valid YouTube or Vimeo URL');
    } else {
      setUrlError('');
    }
  };

  const selectVideo = (index: number) => {
    setSelectedVideoIndex(index === selectedVideoIndex ? null : index);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant={activeTab === 'gallery' ? "default" : "outline"}
          onClick={() => setActiveTab('gallery')}
          className="flex-1"
        >
          <FileVideo className="mr-2 h-4 w-4" />
          Gallery {videos.length > 0 && `(${videos.length})`}
        </Button>
        <Button
          type="button"
          variant={activeTab === 'add' ? "default" : "outline"}
          onClick={() => {
            setActiveTab('add');
            setSelectedVideoIndex(null);
          }}
          className="flex-1"
        >
          <FilePlus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      {activeTab === 'gallery' && (
        <VideoGallery
          videos={videos}
          selectedVideoIndex={selectedVideoIndex}
          onSelectVideo={selectVideo}
          onUpdateVideoField={updateVideoField}
          onMoveVideo={moveVideo}
          onRemoveVideo={removeVideo}
          onAddClick={() => setActiveTab('add')}
        />
      )}

      {activeTab === 'add' && (
        <AddVideoForm
          videoUrl={newVideoUrl}
          videoTitle={newVideoTitle}
          urlError={urlError}
          onUrlChange={handleUrlChange}
          onTitleChange={(e) => setNewVideoTitle(e.target.value)}
          onCancel={() => {
            setActiveTab('gallery');
            setNewVideoUrl('');
            setNewVideoTitle('');
            setUrlError('');
          }}
          onAdd={addVideo}
        />
      )}
    </div>
  );
};

export default VideosManager;
