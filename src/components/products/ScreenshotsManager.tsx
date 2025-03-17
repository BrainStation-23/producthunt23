
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, ImageIcon } from 'lucide-react';
import { Screenshot } from '@/types/product';
import ScreenshotGallery from './screenshots/ScreenshotGallery';
import AddScreenshotForm from './screenshots/AddScreenshotForm';

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
        <ScreenshotGallery
          screenshots={screenshots}
          selectedScreenshotIndex={selectedScreenshotIndex}
          onSelectScreenshot={selectScreenshot}
          onUpdateScreenshotField={updateScreenshotField}
          onMoveScreenshot={moveScreenshot}
          onRemoveScreenshot={removeScreenshot}
          onAddClick={() => setActiveTab('add')}
        />
      )}

      {activeTab === 'add' && (
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
        />
      )}
    </div>
  );
};

export default ScreenshotsManager;
