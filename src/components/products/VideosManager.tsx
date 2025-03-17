import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilePlus, X, MoveUp, MoveDown } from 'lucide-react';
import { Video } from '@/types/product';

interface VideosManagerProps {
  videos: Video[];
  onChange: (videos: Video[]) => void;
}

// Function to get embed URL from YouTube or Vimeo URL
const getEmbedUrl = (url: string): string => {
  // YouTube URL patterns
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  // Vimeo URL patterns
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|)(\d+)(?:$|\/|\?))/;
  const vimeoMatch = url.match(vimeoRegex);
  
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  // If not YouTube or Vimeo, return the original URL
  return url;
};

// Function to check if the URL is a valid YouTube or Vimeo URL
const isValidVideoUrl = (url: string): boolean => {
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|)(\d+)(?:$|\/|\?))/;
  
  return youtubeRegex.test(url) || vimeoRegex.test(url);
};

const VideosManager: React.FC<VideosManagerProps> = ({ videos, onChange }) => {
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [urlError, setUrlError] = useState('');

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
  };

  const removeVideo = (index: number) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    onChange(updatedVideos);
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

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {videos.map((video, index) => (
          <Card key={index} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 h-7 w-7 rounded-full bg-background/80 hover:bg-background/90"
              onClick={() => removeVideo(index)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="relative aspect-video overflow-hidden rounded-t-md">
              <iframe
                src={getEmbedUrl(video.video_url)}
                title={video.title || `Video ${index + 1}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor={`video-${index}-title`}>Title (Optional)</Label>
                <Input
                  id={`video-${index}-title`}
                  value={video.title || ''}
                  onChange={(e) => updateVideoField(index, 'title', e.target.value)}
                  placeholder="Video title"
                />
              </div>
              <div>
                <Label htmlFor={`video-${index}-url`}>Video URL</Label>
                <Input
                  id={`video-${index}-url`}
                  value={video.video_url}
                  onChange={(e) => updateVideoField(index, 'video_url', e.target.value)}
                  placeholder="https://youtube.com/watch?v=example"
                />
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveVideo(index, 'up')}
                  disabled={index === 0}
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveVideo(index, 'down')}
                  disabled={index === videos.length - 1}
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="new-video-title">Title (Optional)</Label>
            <Input
              id="new-video-title"
              value={newVideoTitle}
              onChange={(e) => setNewVideoTitle(e.target.value)}
              placeholder="Video title"
            />
          </div>
          <div>
            <Label htmlFor="new-video-url">Video URL*</Label>
            <Input
              id="new-video-url"
              value={newVideoUrl}
              onChange={handleUrlChange}
              placeholder="https://youtube.com/watch?v=example"
              className={urlError ? "border-destructive" : ""}
            />
            {urlError && <p className="text-destructive text-sm mt-1">{urlError}</p>}
            <p className="text-muted-foreground text-sm mt-1">
              Paste a YouTube or Vimeo URL
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={addVideo}
            disabled={!newVideoUrl || !!urlError}
            className="w-full"
          >
            <FilePlus className="mr-2 h-4 w-4" />
            Add Video
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VideosManager;
