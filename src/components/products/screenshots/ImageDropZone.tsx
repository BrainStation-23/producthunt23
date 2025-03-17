
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImagePlus, UploadCloud } from 'lucide-react';

interface ImageDropZoneProps {
  onFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageDropZone: React.FC<ImageDropZoneProps> = ({ onFileSelected }) => {
  return (
    <div 
      className="border-2 border-dashed rounded-md p-8 text-center hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => document.getElementById('screenshot-file')?.click()}
    >
      <ImagePlus className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
      <p className="text-sm mb-2 font-medium">Click to upload or drag and drop</p>
      <p className="text-xs text-muted-foreground mb-4">PNG, JPG or GIF (max 5MB)</p>
      <Button type="button" variant="secondary" size="sm">
        <UploadCloud className="mr-2 h-4 w-4" />
        Select Image
      </Button>
      <Input
        id="screenshot-file"
        type="file"
        accept="image/*"
        onChange={onFileSelected}
        className="hidden"
      />
    </div>
  );
};

export default ImageDropZone;
