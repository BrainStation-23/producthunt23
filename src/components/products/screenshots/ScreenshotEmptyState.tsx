
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, ImageIcon, Info } from 'lucide-react';

interface ScreenshotEmptyStateProps {
  type: 'gallery' | 'details';
  onAddClick?: () => void;
}

const ScreenshotEmptyState: React.FC<ScreenshotEmptyStateProps> = ({ type, onAddClick }) => {
  if (type === 'gallery') {
    return (
      <div className="col-span-full flex flex-col items-center justify-center h-[300px] border border-dashed rounded-md p-8 text-center text-muted-foreground">
        <ImageIcon className="h-16 w-16 mb-4 opacity-20" />
        <h3 className="font-medium mb-2">No screenshots yet</h3>
        <p className="text-sm mb-4">Add some screenshots to showcase your product</p>
        <Button onClick={onAddClick} variant="outline" type="button">
          <ImagePlus className="mr-2 h-4 w-4" />
          Add Screenshot
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center border border-dashed rounded-md p-8 text-center text-muted-foreground">
      <Info className="h-12 w-12 mb-4 opacity-20" />
      <h3 className="font-medium mb-2">Select a screenshot</h3>
      <p className="text-sm">Click on a screenshot to view and edit its details</p>
    </div>
  );
};

export default ScreenshotEmptyState;
