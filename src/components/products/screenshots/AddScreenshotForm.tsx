
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, Link } from 'lucide-react';
import { Screenshot } from '@/types/product';
import ScreenshotUploader from './ScreenshotUploader';

interface AddScreenshotFormProps {
  screenshotUrl: string;
  screenshotTitle: string;
  screenshotDescription: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCancel: () => void;
  onAdd: () => void;
  onImageUploaded?: (screenshot: Screenshot) => void;
  screenshotsCount?: number;
  maxScreenshots?: number;
}

const AddScreenshotForm: React.FC<AddScreenshotFormProps> = ({
  screenshotUrl,
  screenshotTitle,
  screenshotDescription,
  onUrlChange,
  onTitleChange,
  onDescriptionChange,
  onCancel,
  onAdd,
  onImageUploaded,
  screenshotsCount = 0,
  maxScreenshots = 50
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('upload');
  const remainingScreenshots = maxScreenshots - screenshotsCount;
  const isLimitReached = screenshotsCount >= maxScreenshots;

  const handleScreenshotUploaded = (screenshot: Screenshot) => {
    if (onImageUploaded && !isLimitReached) {
      onImageUploaded(screenshot);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Add New Screenshot</h3>
          <span className="text-xs text-muted-foreground">
            {remainingScreenshots} of {maxScreenshots} remaining
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'url' | 'upload')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              Upload Image
            </TabsTrigger>
            <TabsTrigger value="url">
              Use URL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <ScreenshotUploader 
              onImageUploaded={handleScreenshotUploaded}
              onCancel={onCancel}
              isLimitReached={isLimitReached}
              remainingScreenshots={remainingScreenshots}
            />
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4">
            <div>
              <Label htmlFor="new-screenshot-url">Image URL*</Label>
              <Input
                id="new-screenshot-url"
                value={screenshotUrl}
                onChange={onUrlChange}
                placeholder="https://example.com/image.jpg"
                disabled={isLimitReached}
              />
            </div>
            <div>
              <Label htmlFor="new-screenshot-title">Title (Optional)</Label>
              <Input
                id="new-screenshot-title"
                value={screenshotTitle}
                onChange={onTitleChange}
                placeholder="Screenshot title"
                disabled={isLimitReached}
              />
            </div>
            <div>
              <Label htmlFor="new-screenshot-description">Description (Optional)</Label>
              <Textarea
                id="new-screenshot-description"
                value={screenshotDescription}
                onChange={onDescriptionChange}
                placeholder="Describe what's shown in this screenshot"
                disabled={isLimitReached}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button"
                variant="outline" 
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onAdd}
                disabled={!screenshotUrl || isLimitReached}
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                Add Screenshot
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AddScreenshotForm;
