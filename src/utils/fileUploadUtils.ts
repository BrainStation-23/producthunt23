
import { supabase } from '@/integrations/supabase/client';
import { Screenshot } from '@/types/product';

export interface FileValidationResult {
  isValid: boolean;
  error: string | null;
}

export const validateImageFile = (file: File): FileValidationResult => {
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select an image file' };
  }
  
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: 'File size must be less than 5MB' };
  }
  
  return { isValid: true, error: null };
};

export const uploadImageToStorage = async (
  file: File, 
  bucketName: string = 'product_screenshots',
  onProgressUpdate?: (progress: number) => void,
  customPath?: string
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = customPath ? 
    `${customPath}.${fileExt}` : 
    `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  
  // Simulate progress if onProgressUpdate is provided
  let progressInterval: NodeJS.Timeout | null = null;
  
  if (onProgressUpdate) {
    onProgressUpdate(0);
    progressInterval = setInterval(() => {
      const simulatedProgress = Math.min(95, Math.random() * 10 + 5);
      if (onProgressUpdate) {
        onProgressUpdate(simulatedProgress);
      }
    }, 500);
  }
  
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true // Changed to true to allow replacing existing avatars
      });
    
    if (error) throw error;
    
    if (progressInterval) {
      clearInterval(progressInterval);
      if (onProgressUpdate) onProgressUpdate(100);
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error) {
    if (progressInterval) clearInterval(progressInterval);
    throw error;
  }
};

export const createScreenshotFromUrl = (
  imageUrl: string, 
  title?: string, 
  description?: string
): Screenshot => {
  return {
    image_url: imageUrl,
    title: title || undefined,
    description: description || undefined,
  };
};
