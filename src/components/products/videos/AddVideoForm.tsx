
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilePlus } from 'lucide-react';
import { isValidVideoUrl } from '@/utils/videoUtils';

interface AddVideoFormProps {
  videoUrl: string;
  videoTitle: string;
  urlError: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onAdd: () => void;
}

const AddVideoForm: React.FC<AddVideoFormProps> = ({
  videoUrl,
  videoTitle,
  urlError,
  onUrlChange,
  onTitleChange,
  onCancel,
  onAdd
}) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium">Add New Video</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="new-video-url">Video URL*</Label>
          <Input
            id="new-video-url"
            value={videoUrl}
            onChange={onUrlChange}
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
            value={videoTitle}
            onChange={onTitleChange}
            placeholder="Video title"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
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
          disabled={!videoUrl || !!urlError}
        >
          <FilePlus className="mr-2 h-4 w-4" />
          Add Video
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddVideoForm;
