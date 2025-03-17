
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImagePlus, X, ArrowUp, ArrowDown, UploadCloud, ImageIcon, Info } from 'lucide-react';
import { Screenshot } from '@/types/product';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ScreenshotsManagerProps {
  screenshots: Screenshot[];
  onChange: (screenshots: Screenshot[]) => void;
}

const ScreenshotsManager: React.FC<ScreenshotsManagerProps> = ({ screenshots, onChange }) => {
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');
  const [newScreenshotTitle, setNewScreenshotTitle] = useState('');
  const [newScreenshotDescription, setNewScreenshotDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'gallery' | 'add'>('gallery');
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<number | null>(null);

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
    setActiveTab('gallery');
  };

  const removeScreenshot = (index: number) => {
    const updatedScreenshots = [...screenshots];
    updatedScreenshots.splice(index, 1);
    onChange(updatedScreenshots);
    if (selectedScreenshotIndex === index) {
      setSelectedScreenshotIndex(null);
    }
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

    // Update selected index if needed
    if (selectedScreenshotIndex === index) {
      setSelectedScreenshotIndex(newIndex);
    } else if (selectedScreenshotIndex === newIndex) {
      setSelectedScreenshotIndex(index);
    }
  };

  const updateScreenshotField = (index: number, field: keyof Screenshot, value: string) => {
    const updatedScreenshots = [...screenshots];
    updatedScreenshots[index] = {
      ...updatedScreenshots[index],
      [field]: value || undefined,
    };
    onChange(updatedScreenshots);
  };

  const selectScreenshot = (index: number) => {
    setSelectedScreenshotIndex(index === selectedScreenshotIndex ? null : index);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === 'gallery' ? "default" : "outline"}
          onClick={() => setActiveTab('gallery')}
          className="flex-1"
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          Gallery {screenshots.length > 0 && `(${screenshots.length})`}
        </Button>
        <Button
          variant={activeTab === 'add' ? "default" : "outline"}
          onClick={() => {
            setActiveTab('add');
            setSelectedScreenshotIndex(null);
          }}
          className="flex-1"
        >
          <ImagePlus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      {activeTab === 'gallery' && (
        <div className="min-h-[300px] grid grid-cols-1 md:grid-cols-3 gap-4">
          {screenshots.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center h-[300px] border border-dashed rounded-md p-8 text-center text-muted-foreground">
              <ImageIcon className="h-16 w-16 mb-4 opacity-20" />
              <h3 className="font-medium mb-2">No screenshots yet</h3>
              <p className="text-sm mb-4">Add some screenshots to showcase your product</p>
              <Button onClick={() => setActiveTab('add')} variant="outline">
                <ImagePlus className="mr-2 h-4 w-4" />
                Add Screenshot
              </Button>
            </div>
          ) : (
            <>
              <div className="col-span-1 md:col-span-1 grid grid-cols-1 h-fit gap-2">
                <ScrollArea className="max-h-[600px] pr-4">
                  {screenshots.map((screenshot, index) => (
                    <Card 
                      key={index} 
                      className={cn(
                        "mb-2 cursor-pointer overflow-hidden transition-all", 
                        selectedScreenshotIndex === index ? "ring-2 ring-primary" : ""
                      )}
                      onClick={() => selectScreenshot(index)}
                    >
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
                      <CardContent className="p-2">
                        <p className="text-xs font-medium truncate">
                          {screenshot.title || `Screenshot ${index + 1}`}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
              </div>

              <div className="col-span-1 md:col-span-2">
                {selectedScreenshotIndex !== null ? (
                  <Card className="h-full">
                    <CardHeader className="relative pb-0">
                      <div className="absolute right-4 top-4 z-10 flex gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveScreenshot(selectedScreenshotIndex, 'up')}
                                disabled={selectedScreenshotIndex === 0}
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
                                onClick={() => moveScreenshot(selectedScreenshotIndex, 'down')}
                                disabled={selectedScreenshotIndex === screenshots.length - 1}
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
                                onClick={() => removeScreenshot(selectedScreenshotIndex)}
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
                        <img
                          src={screenshots[selectedScreenshotIndex].image_url}
                          alt={screenshots[selectedScreenshotIndex].title || `Screenshot ${selectedScreenshotIndex + 1}`}
                          className="absolute inset-0 h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`screenshot-${selectedScreenshotIndex}-title`}>Title (Optional)</Label>
                        <Input
                          id={`screenshot-${selectedScreenshotIndex}-title`}
                          value={screenshots[selectedScreenshotIndex].title || ''}
                          onChange={(e) => updateScreenshotField(selectedScreenshotIndex, 'title', e.target.value)}
                          placeholder="Screenshot title"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`screenshot-${selectedScreenshotIndex}-url`}>Image URL</Label>
                        <Input
                          id={`screenshot-${selectedScreenshotIndex}-url`}
                          value={screenshots[selectedScreenshotIndex].image_url}
                          onChange={(e) => updateScreenshotField(selectedScreenshotIndex, 'image_url', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`screenshot-${selectedScreenshotIndex}-description`}>Description (Optional)</Label>
                        <Textarea
                          id={`screenshot-${selectedScreenshotIndex}-description`}
                          value={screenshots[selectedScreenshotIndex].description || ''}
                          onChange={(e) => updateScreenshotField(selectedScreenshotIndex, 'description', e.target.value)}
                          placeholder="Describe what's shown in this screenshot"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center border border-dashed rounded-md p-8 text-center text-muted-foreground">
                    <Info className="h-12 w-12 mb-4 opacity-20" />
                    <h3 className="font-medium mb-2">Select a screenshot</h3>
                    <p className="text-sm">Click on a screenshot to view and edit its details</p>
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
            <h3 className="text-lg font-medium">Add New Screenshot</h3>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="new-screenshot-title">Title (Optional)</Label>
              <Input
                id="new-screenshot-title"
                value={newScreenshotTitle}
                onChange={(e) => setNewScreenshotTitle(e.target.value)}
                placeholder="Screenshot title"
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
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveTab('gallery');
                setNewScreenshotUrl('');
                setNewScreenshotTitle('');
                setNewScreenshotDescription('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={addScreenshot}
              disabled={!newScreenshotUrl}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Add Screenshot
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ScreenshotsManager;
