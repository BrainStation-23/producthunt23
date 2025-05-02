
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

/**
 * Delete a file from Supabase storage
 * @param fileUrl The public URL of the file to delete
 * @param bucketName The storage bucket name
 * @returns True if deletion was successful, false otherwise
 */
export const deleteImageFromStorage = async (
  fileUrl: string,
  bucketName: string = 'product_screenshots'
): Promise<boolean> => {
  try {
    // Check if this is a Supabase storage URL
    if (!fileUrl.includes('storage.googleapis.com') && !fileUrl.includes('supabase.co/storage')) {
      console.log('Not deleting external URL:', fileUrl);
      return false; // Not a Supabase URL, so we don't try to delete it
    }

    // Extract the file path from the URL
    const urlParts = fileUrl.split(`/storage/v1/object/public/${bucketName}/`);
    if (urlParts.length !== 2) {
      console.log('Could not parse file path from URL:', fileUrl);
      return false;
    }

    const filePath = decodeURIComponent(urlParts[1]);
    
    // Delete the file
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
      
    if (error) {
      console.error('Error deleting file from storage:', error);
      return false;
    }
    
    console.log('Successfully deleted file:', filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file from storage:', error);
    return false;
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
