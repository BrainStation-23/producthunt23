
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  previewUrl: string;
  onClear: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ previewUrl, onClear }) => {
  return (
    <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100 border">
      <img
        src={previewUrl}
        alt="Preview"
        className="absolute inset-0 h-full w-full object-contain"
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8"
        onClick={onClear}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ImagePreview;
