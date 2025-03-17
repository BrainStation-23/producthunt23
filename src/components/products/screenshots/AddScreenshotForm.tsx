
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';

interface AddScreenshotFormProps {
  screenshotUrl: string;
  screenshotTitle: string;
  screenshotDescription: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCancel: () => void;
  onAdd: () => void;
}

const AddScreenshotForm: React.FC<AddScreenshotFormProps> = ({
  screenshotUrl,
  screenshotTitle,
  screenshotDescription,
  onUrlChange,
  onTitleChange,
  onDescriptionChange,
  onCancel,
  onAdd
}) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium">Add New Screenshot</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="new-screenshot-url">Image URL*</Label>
          <Input
            id="new-screenshot-url"
            value={screenshotUrl}
            onChange={onUrlChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <Label htmlFor="new-screenshot-title">Title (Optional)</Label>
          <Input
            id="new-screenshot-title"
            value={screenshotTitle}
            onChange={onTitleChange}
            placeholder="Screenshot title"
          />
        </div>
        <div>
          <Label htmlFor="new-screenshot-description">Description (Optional)</Label>
          <Textarea
            id="new-screenshot-description"
            value={screenshotDescription}
            onChange={onDescriptionChange}
            placeholder="Describe what's shown in this screenshot"
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
          disabled={!screenshotUrl}
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          Add Screenshot
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddScreenshotForm;
