
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, ArrowUp, ArrowDown } from 'lucide-react';
import { Video } from '@/types/product';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VideoDetailsProps {
  video: Video;
  index: number;
  totalVideos: number;
  onUpdateField: (field: keyof Video, value: string) => void;
  onMoveVideo: (direction: 'up' | 'down') => void;
  onRemoveVideo: () => void;
}

const VideoDetails: React.FC<VideoDetailsProps> = ({
  video,
  index,
  totalVideos,
  onUpdateField,
  onMoveVideo,
  onRemoveVideo
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="relative pb-0">
        <div className="absolute right-4 top-4 z-10 flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onMoveVideo('up')}
                  disabled={index === 0}
                  className="h-8 w-8"
                  type="button"
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
                  onClick={() => onMoveVideo('down')}
                  disabled={index === totalVideos - 1}
                  className="h-8 w-8"
                  type="button"
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
                  onClick={onRemoveVideo}
                  className="h-8 w-8 hover:text-destructive"
                  type="button"
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
        <div>
          <Label htmlFor={`video-${index}-title`}>Title (Optional)</Label>
          <Input
            id={`video-${index}-title`}
            value={video.title || ''}
            onChange={(e) => onUpdateField('title', e.target.value)}
            placeholder="Video title"
          />
        </div>
        <div>
          <Label htmlFor={`video-${index}-url`}>Video URL</Label>
          <Input
            id={`video-${index}-url`}
            value={video.video_url}
            onChange={(e) => onUpdateField('video_url', e.target.value)}
            placeholder="https://youtube.com/watch?v=example"
          />
          <p className="text-xs text-muted-foreground mt-1">Paste a YouTube or Vimeo URL</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoDetails;
