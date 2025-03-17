import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImagePlus, X, MoveUp, MoveDown } from 'lucide-react';
import { Screenshot } from '@/types/product';

interface ScreenshotsManagerProps {
  screenshots: Screenshot[];
  onChange: (screenshots: Screenshot[]) => void;
}

const ScreenshotsManager: React.FC<ScreenshotsManagerProps> = ({ screenshots, onChange }) => {
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');
  const [newScreenshotTitle, setNewScreenshotTitle] = useState('');
  const [newScreenshotDescription, setNewScreenshotDescription] = useState('');

  const addScreenshot = () => {
    if (!newScreenshotUrl) return;

    const newScreenshot: Screenshot = {
      image_url: newScreenshotUrl,
      title: newScreenshotTitle || undefined,
      description: newScreenshotDescription || undefined,
    };

    onChange([...screenshots, newScreenshot]);
    setNewScreenshotUrl('');
    setNewScreenshotTitle('');
    setNewScreenshotDescription('');
  };

  const removeScreenshot = (index: number) => {
    const updatedScreenshots = [...screenshots];
    updatedScreenshots.splice(index, 1);
    onChange(updatedScreenshots);
  };

  const moveScreenshot = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === screenshots.length - 1)
    ) {
      return;
    }

    const updatedScreenshots = [...screenshots];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedScreenshots[index], updatedScreenshots[newIndex]] = 
    [updatedScreenshots[newIndex], updatedScreenshots[index]];
    
    onChange(updatedScreenshots);
  };

  const updateScreenshotField = (index: number, field: keyof Screenshot, value: string) => {
    const updatedScreenshots = [...screenshots];
    updatedScreenshots[index] = {
      ...updatedScreenshots[index],
      [field]: value || undefined,
    };
    onChange(updatedScreenshots);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {screenshots.map((screenshot, index) => (
          <Card key={index} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 h-7 w-7 rounded-full bg-background/80 hover:bg-background/90"
              onClick={() => removeScreenshot(index)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="relative aspect-video">
              <img
                src={screenshot.image_url}
                alt={screenshot.title || `Screenshot ${index + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor={`screenshot-${index}-title`}>Title (Optional)</Label>
                <Input
                  id={`screenshot-${index}-title`}
                  value={screenshot.title || ''}
                  onChange={(e) => updateScreenshotField(index, 'title', e.target.value)}
                  placeholder="Screenshot title"
                />
              </div>
              <div>
                <Label htmlFor={`screenshot-${index}-url`}>Image URL</Label>
                <Input
                  id={`screenshot-${index}-url`}
                  value={screenshot.image_url}
                  onChange={(e) => updateScreenshotField(index, 'image_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor={`screenshot-${index}-description`}>Description (Optional)</Label>
                <Textarea
                  id={`screenshot-${index}-description`}
                  value={screenshot.description || ''}
                  onChange={(e) => updateScreenshotField(index, 'description', e.target.value)}
                  placeholder="Describe what's shown in this screenshot"
                />
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveScreenshot(index, 'up')}
                  disabled={index === 0}
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveScreenshot(index, 'down')}
                  disabled={index === screenshots.length - 1}
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
            <Label htmlFor="new-screenshot-title">Title (Optional)</Label>
            <Input
              id="new-screenshot-title"
              value={newScreenshotTitle}
              onChange={(e) => setNewScreenshotTitle(e.target.value)}
              placeholder="Screenshot title"
            />
          </div>
          <div>
            <Label htmlFor="new-screenshot-url">Image URL*</Label>
            <Input
              id="new-screenshot-url"
              value={newScreenshotUrl}
              onChange={(e) => setNewScreenshotUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <Label htmlFor="new-screenshot-description">Description (Optional)</Label>
            <Textarea
              id="new-screenshot-description"
              value={newScreenshotDescription}
              onChange={(e) => setNewScreenshotDescription(e.target.value)}
              placeholder="Describe what's shown in this screenshot"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={addScreenshot}
            disabled={!newScreenshotUrl}
            className="w-full"
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            Add Screenshot
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ScreenshotsManager;
