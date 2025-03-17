
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilePlus, X, ArrowUp, ArrowDown, FileVideo, Info, Play } from 'lucide-react';
import { Video } from '@/types/product';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

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

// Function to extract video ID and platform
const getVideoInfo = (url: string): { platform: string | null, id: string | null, thumbnail: string | null } => {
  // YouTube URL patterns
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  
  if (youtubeMatch && youtubeMatch[1]) {
    return {
      platform: 'youtube',
      id: youtubeMatch[1],
      thumbnail: `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`
    };
  }
  
  // Vimeo URL patterns
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|)(\d+)(?:$|\/|\?))/;
  const vimeoMatch = url.match(vimeoRegex);
  
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      platform: 'vimeo',
      id: vimeoMatch[1],
      // Vimeo doesn't have an easy thumbnail API like YouTube
      thumbnail: null
    };
  }
  
  return { platform: null, id: null, thumbnail: null };
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
          variant={activeTab === 'gallery' ? "default" : "outline"}
          onClick={() => setActiveTab('gallery')}
          className="flex-1"
        >
          <FileVideo className="mr-2 h-4 w-4" />
          Gallery {videos.length > 0 && `(${videos.length})`}
        </Button>
        <Button
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
        <div className="min-h-[300px] grid grid-cols-1 md:grid-cols-3 gap-4">
          {videos.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center h-[300px] border border-dashed rounded-md p-8 text-center text-muted-foreground">
              <FileVideo className="h-16 w-16 mb-4 opacity-20" />
              <h3 className="font-medium mb-2">No videos yet</h3>
              <p className="text-sm mb-4">Add some videos to showcase your product</p>
              <Button onClick={() => setActiveTab('add')} variant="outline">
                <FilePlus className="mr-2 h-4 w-4" />
                Add Video
              </Button>
            </div>
          ) : (
            <>
              <div className="col-span-1 md:col-span-1 h-fit">
                <ScrollArea className="max-h-[600px] pr-4">
                  {videos.map((video, index) => {
                    const videoInfo = getVideoInfo(video.video_url);
                    return (
                      <Card 
                        key={index} 
                        className={cn(
                          "mb-2 cursor-pointer overflow-hidden transition-all",
                          selectedVideoIndex === index ? "ring-2 ring-primary" : ""
                        )}
                        onClick={() => selectVideo(index)}
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
                  })}
                </ScrollArea>
              </div>

              <div className="col-span-1 md:col-span-2">
                {selectedVideoIndex !== null ? (
                  <Card className="h-full">
                    <CardHeader className="relative pb-0">
                      <div className="absolute right-4 top-4 z-10 flex gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveVideo(selectedVideoIndex, 'up')}
                                disabled={selectedVideoIndex === 0}
                                className="h-8 w-8"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Move up</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveVideo(selectedVideoIndex, 'down')}
                                disabled={selectedVideoIndex === videos.length - 1}
                                className="h-8 w-8"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Move down</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeVideo(selectedVideoIndex)}
                                className="h-8 w-8 hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardHeader>
                    <CardContent className="py-4 space-y-4">
                      <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100 border">
                        <iframe
                          src={getEmbedUrl(videos[selectedVideoIndex].video_url)}
                          title={videos[selectedVideoIndex].title || `Video ${selectedVideoIndex + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`video-${selectedVideoIndex}-title`}>Title (Optional)</Label>
                        <Input
                          id={`video-${selectedVideoIndex}-title`}
                          value={videos[selectedVideoIndex].title || ''}
                          onChange={(e) => updateVideoField(selectedVideoIndex, 'title', e.target.value)}
                          placeholder="Video title"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`video-${selectedVideoIndex}-url`}>Video URL</Label>
                        <Input
                          id={`video-${selectedVideoIndex}-url`}
                          value={videos[selectedVideoIndex].video_url}
                          onChange={(e) => updateVideoField(selectedVideoIndex, 'video_url', e.target.value)}
                          placeholder="https://youtube.com/watch?v=example"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Paste a YouTube or Vimeo URL</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center border border-dashed rounded-md p-8 text-center text-muted-foreground">
                    <Info className="h-12 w-12 mb-4 opacity-20" />
                    <h3 className="font-medium mb-2">Select a video</h3>
                    <p className="text-sm">Click on a video to view and edit its details</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'add' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Add New Video</h3>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <div>
              <Label htmlFor="new-video-title">Title (Optional)</Label>
              <Input
                id="new-video-title"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                placeholder="Video title"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveTab('gallery');
                setNewVideoUrl('');
                setNewVideoTitle('');
                setUrlError('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={addVideo}
              disabled={!newVideoUrl || !!urlError}
            >
              <FilePlus className="mr-2 h-4 w-4" />
              Add Video
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default VideosManager;
