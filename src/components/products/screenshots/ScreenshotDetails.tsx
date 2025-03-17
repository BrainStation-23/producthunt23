
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, ArrowUp, ArrowDown } from 'lucide-react';
import { Screenshot } from '@/types/product';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScreenshotDetailsProps {
  screenshot: Screenshot;
  index: number;
  totalScreenshots: number;
  onUpdateField: (field: keyof Screenshot, value: string) => void;
  onMoveScreenshot: (direction: 'up' | 'down') => void;
  onRemoveScreenshot: () => void;
}

const ScreenshotDetails: React.FC<ScreenshotDetailsProps> = ({
  screenshot,
  index,
  totalScreenshots,
  onUpdateField,
  onMoveScreenshot,
  onRemoveScreenshot
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
                  onClick={() => onMoveScreenshot('up')}
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
                  onClick={() => onMoveScreenshot('down')}
                  disabled={index === totalScreenshots - 1}
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
                  onClick={onRemoveScreenshot}
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
        <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100 border">
          <img
            src={screenshot.image_url}
            alt={screenshot.title || `Screenshot ${index + 1}`}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>

        <div>
          <Label htmlFor={`screenshot-${index}-title`}>Title (Optional)</Label>
          <Input
            id={`screenshot-${index}-title`}
            value={screenshot.title || ''}
            onChange={(e) => onUpdateField('title', e.target.value)}
            placeholder="Screenshot title"
          />
        </div>
        <div>
          <Label htmlFor={`screenshot-${index}-url`}>Image URL</Label>
          <Input
            id={`screenshot-${index}-url`}
            value={screenshot.image_url}
            onChange={(e) => onUpdateField('image_url', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <Label htmlFor={`screenshot-${index}-description`}>Description (Optional)</Label>
          <Textarea
            id={`screenshot-${index}-description`}
            value={screenshot.description || ''}
            onChange={(e) => onUpdateField('description', e.target.value)}
            placeholder="Describe what's shown in this screenshot"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ScreenshotDetails;
