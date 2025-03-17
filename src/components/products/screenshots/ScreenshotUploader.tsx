import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ImagePlus, UploadCloud, X, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Screenshot } from '@/types/product';

interface ScreenshotUploaderProps {
  onImageUploaded: (screenshot: Screenshot) => void;
  onCancel: () => void;
}

const ScreenshotUploader: React.FC<ScreenshotUploaderProps> = ({
  onImageUploaded,
  onCancel
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
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
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
    
    try {
      setUploading(true);
      setProgress(0);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const fileSize = file.size;
      let uploadedSize = 0;
      
      const uploadWithProgress = async () => {
        const { data, error } = await supabase.storage
          .from('product_screenshots')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) throw error;
        return data;
      };
      
      const progressInterval = setInterval(() => {
        const increment = Math.random() * 10 + 5;
        setProgress(prev => {
          const newProgress = Math.min(prev + increment, 95);
          return newProgress;
        });
      }, 500);
      
      const data = await uploadWithProgress();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      const { data: { publicUrl } } = supabase.storage
        .from('product_screenshots')
        .getPublicUrl(filePath);
      
      const newScreenshot: Screenshot = {
        title: title || undefined,
        image_url: publicUrl,
        description: description || undefined,
      };
      
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
      <div className="space-y-2">
        <Label htmlFor="screenshot-title">Title (Optional)</Label>
        <Input
          id="screenshot-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Screenshot title"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="screenshot-description">Description (Optional)</Label>
        <Input
          id="screenshot-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what's shown in this screenshot"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="screenshot-file">Upload Image</Label>
        {previewUrl ? (
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
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
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
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
        
        {error && (
          <div className="flex items-center text-sm text-destructive mt-2">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
        
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={uploadFile} 
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>
    </div>
  );
};

export default ScreenshotUploader;
