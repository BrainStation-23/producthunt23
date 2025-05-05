
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Screenshot } from '@/types/product';
import { validateImageFile, uploadImageToStorage, createScreenshotFromUrl } from '@/utils/fileUploadUtils';
import ImagePreview from './ImagePreview';
import ImageDropZone from './ImageDropZone';
import UploadProgress from './UploadProgress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ScreenshotUploaderProps {
  onImageUploaded: (screenshot: Screenshot) => void;
  onCancel: () => void;
  isLimitReached?: boolean;
  remainingScreenshots?: number;
}

const ScreenshotUploader: React.FC<ScreenshotUploaderProps> = ({
  onImageUploaded,
  onCancel,
  isLimitReached = false,
  remainingScreenshots = 50
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLimitReached) {
      setError(`Maximum limit of screenshots reached (${remainingScreenshots} remaining)`);
      return;
    }

    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    const validationResult = validateImageFile(selectedFile);
    
    if (!validationResult.isValid) {
      setError(validationResult.error);
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const uploadFile = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (isLimitReached) {
      setError(`Maximum limit of screenshots reached (${remainingScreenshots} remaining)`);
      return;
    }
    
    try {
      setUploading(true);
      setProgress(0);
      
      const publicUrl = await uploadImageToStorage(file, 'product_screenshots', setProgress);
      
      const newScreenshot = createScreenshotFromUrl(publicUrl, title, description);
      
      onImageUploaded(newScreenshot);
      toast({
        title: "Image uploaded successfully",
        description: "Your screenshot has been added to the gallery.",
      });
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setError(error.message || 'Error uploading file');
      toast({
        title: "Upload failed",
        description: error.message || 'There was a problem uploading your image',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {isLimitReached && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You've reached the maximum limit of {50 - remainingScreenshots} screenshots. 
            Please remove some screenshots before adding more.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="screenshot-title">Title (Optional)</Label>
        <Input
          id="screenshot-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Screenshot title"
          disabled={isLimitReached}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="screenshot-description">Description (Optional)</Label>
        <Input
          id="screenshot-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what's shown in this screenshot"
          disabled={isLimitReached}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="screenshot-file">Upload Image</Label>
        {previewUrl ? (
          <ImagePreview 
            previewUrl={previewUrl} 
            onClear={() => {
              setFile(null);
              setPreviewUrl(null);
            }}
          />
        ) : (
          <ImageDropZone onFileSelected={handleFileChange} disabled={isLimitReached} />
        )}
        
        {error && (
          <div className="flex items-center text-sm text-destructive mt-2">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
        
        {uploading && <UploadProgress progress={progress} />}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={uploadFile} 
          disabled={!file || uploading || isLimitReached}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>
    </div>
  );
};

export default ScreenshotUploader;
