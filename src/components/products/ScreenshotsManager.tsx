
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, ImageIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Screenshot } from '@/types/product';
import ScreenshotGallery from './screenshots/ScreenshotGallery';
import AddScreenshotForm from './screenshots/AddScreenshotForm';
import { deleteImageFromStorage } from '@/utils/fileUploadUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface ScreenshotsManagerProps {
  screenshots: Screenshot[];
  onChange: (screenshots: Screenshot[]) => void;
}

const MAX_SCREENSHOTS = 50;

const ScreenshotsManager: React.FC<ScreenshotsManagerProps> = ({ screenshots, onChange }) => {
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');
  const [newScreenshotTitle, setNewScreenshotTitle] = useState('');
  const [newScreenshotDescription, setNewScreenshotDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'gallery' | 'add'>('gallery');
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<number | null>(
    screenshots.length > 0 ? 0 : null
  );

  const isLimitReached = screenshots.length >= MAX_SCREENSHOTS;

  const addScreenshot = () => {
    if (!newScreenshotUrl) return;
    
    if (isLimitReached) {
      toast.error(`You can upload a maximum of ${MAX_SCREENSHOTS} screenshots.`);
      return;
    }

    const newScreenshot: Screenshot = {
      image_url: newScreenshotUrl,
      title: newScreenshotTitle || undefined,
      description: newScreenshotDescription || undefined,
    };

    const updatedScreenshots = [...screenshots, newScreenshot];
    onChange(updatedScreenshots);
    setNewScreenshotUrl('');
    setNewScreenshotTitle('');
    setNewScreenshotDescription('');
    setActiveTab('gallery');
    setSelectedScreenshotIndex(updatedScreenshots.length - 1);
  };

  const handleImageUploaded = (screenshot: Screenshot) => {
    if (isLimitReached) {
      toast.error(`You can upload a maximum of ${MAX_SCREENSHOTS} screenshots.`);
      return;
    }
    
    const updatedScreenshots = [...screenshots, screenshot];
    onChange(updatedScreenshots);
    setActiveTab('gallery');
    setSelectedScreenshotIndex(updatedScreenshots.length - 1);
  };

  const removeScreenshot = async (index: number) => {
    const screenshotToRemove = screenshots[index];
    
    // Try to delete the image from storage if it's a Supabase URL
    if (screenshotToRemove.image_url) {
      try {
        const deleted = await deleteImageFromStorage(screenshotToRemove.image_url);
        if (deleted) {
          toast.success("Screenshot image was deleted from storage");
        }
      } catch (error) {
        console.error("Failed to delete image from storage:", error);
        // We continue with removing from the gallery even if storage deletion fails
      }
    }
    
    // Update the screenshots array
    const updatedScreenshots = [...screenshots];
    updatedScreenshots.splice(index, 1);
    onChange(updatedScreenshots);
    
    // Update selected index after removing
    if (selectedScreenshotIndex === index) {
      if (updatedScreenshots.length > 0) {
        // Select previous image, or first if we removed the first image
        const newIndex = index > 0 ? index - 1 : 0;
        setSelectedScreenshotIndex(newIndex);
      } else {
        setSelectedScreenshotIndex(null);
      }
    } else if (selectedScreenshotIndex !== null && selectedScreenshotIndex > index) {
      // If we removed an image before the selected one, decrement the index
      setSelectedScreenshotIndex(selectedScreenshotIndex - 1);
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
    setSelectedScreenshotIndex(index);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2 flex-1">
          <Button
            type="button"
            variant={activeTab === 'gallery' ? "default" : "outline"}
            onClick={() => setActiveTab('gallery')}
            className="flex-1"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Gallery {screenshots.length > 0 && `(${screenshots.length})`}
          </Button>
          <Button
            type="button"
            variant={activeTab === 'add' ? "default" : "outline"}
            onClick={() => !isLimitReached && setActiveTab('add')}
            className="flex-1"
            disabled={isLimitReached}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
        <div className="text-xs text-muted-foreground ml-2">
          {screenshots.length}/{MAX_SCREENSHOTS}
        </div>
      </div>
      
      {isLimitReached && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Maximum limit of {MAX_SCREENSHOTS} screenshots reached. Please remove some screenshots before adding more.
          </AlertDescription>
        </Alert>
      )}

      {activeTab === 'gallery' && (
        <ScreenshotGallery
          screenshots={screenshots}
          selectedScreenshotIndex={selectedScreenshotIndex}
          onSelectScreenshot={selectScreenshot}
          onUpdateScreenshotField={updateScreenshotField}
          onMoveScreenshot={moveScreenshot}
          onRemoveScreenshot={removeScreenshot}
          onAddClick={() => !isLimitReached && setActiveTab('add')}
        />
      )}

      {activeTab === 'add' && !isLimitReached && (
        <AddScreenshotForm
          screenshotUrl={newScreenshotUrl}
          screenshotTitle={newScreenshotTitle}
          screenshotDescription={newScreenshotDescription}
          onUrlChange={(e) => setNewScreenshotUrl(e.target.value)}
          onTitleChange={(e) => setNewScreenshotTitle(e.target.value)}
          onDescriptionChange={(e) => setNewScreenshotDescription(e.target.value)}
          onCancel={() => {
            setActiveTab('gallery');
            setNewScreenshotUrl('');
            setNewScreenshotTitle('');
            setNewScreenshotDescription('');
          }}
          onAdd={addScreenshot}
          onImageUploaded={handleImageUploaded}
          screenshotsCount={screenshots.length}
          maxScreenshots={MAX_SCREENSHOTS}
        />
      )}
    </div>
  );
};

export default ScreenshotsManager;
