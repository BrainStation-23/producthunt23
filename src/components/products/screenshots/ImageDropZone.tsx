
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImagePlus, UploadCloud } from 'lucide-react';

interface ImageDropZoneProps {
  onFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const ImageDropZone: React.FC<ImageDropZoneProps> = ({ onFileSelected, disabled = false }) => {
  return (
    <div 
      className={`border-2 border-dashed rounded-md p-8 text-center ${!disabled ? 'hover:bg-muted/50 cursor-pointer' : 'opacity-60 cursor-not-allowed'} transition-colors`}
      onClick={() => !disabled && document.getElementById('screenshot-file')?.click()}
    >
      <ImagePlus className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
      <p className="text-sm mb-2 font-medium">{disabled ? 'Upload limit reached' : 'Click to upload or drag and drop'}</p>
      <p className="text-xs text-muted-foreground mb-4">PNG, JPG or GIF (max 5MB)</p>
      <Button type="button" variant="secondary" size="sm" disabled={disabled}>
        <UploadCloud className="mr-2 h-4 w-4" />
        Select Image
      </Button>
      <Input
        id="screenshot-file"
        type="file"
        accept="image/*"
        onChange={onFileSelected}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default ImageDropZone;
