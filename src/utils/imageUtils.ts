
/**
 * Utility functions for handling images
 */

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFRUVFRkYiLz48cGF0aCBkPSJNNzUuNSAxMDIuNVY5Ny41TDEyNC41IDk3LjVWMTAyLjVMNzUuNSAxMDIuNVoiIGZpbGw9IiM4ODg4QUEiLz48cGF0aCBkPSJNMTAyLjUgNzUuNUg5Ny41VjEyNC41SDEwMi41Vjc1LjVaIiBmaWxsPSIjODg4OEFBIi8+PC9zdmc+';

/**
 * Convert an image from URL to a data URL to avoid CORS issues
 * @param url Image URL
 * @returns A promise resolving to a data URL
 */
export const convertImageToDataURL = async (url: string): Promise<string> => {
  // If already a data URL, just return it
  if (url.startsWith('data:')) {
    return url;
  }

  // Create a new promise that will resolve with the data URL
  return new Promise<string>((resolve, reject) => {
    // Create a canvas element to draw the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Canvas context not available');
      resolve(PLACEHOLDER_IMAGE);
      return;
    }

    // Create an image element to load the image
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Try to avoid CORS issues
    
    // Set up the onload handler
    img.onload = () => {
      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);
      
      // Convert the canvas to a data URL
      try {
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (error) {
        console.error('Error converting image to data URL:', error);
        resolve(PLACEHOLDER_IMAGE);
      }
    };
    
    // Set up the onerror handler
    img.onerror = (error) => {
      console.error('Error loading image:', error);
      resolve(PLACEHOLDER_IMAGE); // Return a placeholder image on error
    };
    
    // Start loading the image
    img.src = url;
    
    // If the image takes too long to load, resolve with a placeholder
    setTimeout(() => {
      if (!img.complete) {
        console.warn('Image load timeout:', url);
        resolve(PLACEHOLDER_IMAGE);
      }
    }, 5000); // 5 second timeout
  });
};

/**
 * Preloads multiple images and returns them as data URLs
 * @param urls Array of image URLs to preload
 * @returns A promise that resolves to an object mapping original URLs to data URLs
 */
export const preloadImages = async (urls: string[]): Promise<Record<string, string>> => {
  const uniqueUrls = [...new Set(urls)]; // Remove duplicates
  const result: Record<string, string> = {};
  
  // Process all URLs in parallel
  await Promise.all(
    uniqueUrls.map(async (url) => {
      try {
        result[url] = await convertImageToDataURL(url);
      } catch (error) {
        console.error(`Failed to preload image: ${url}`, error);
        result[url] = PLACEHOLDER_IMAGE;
      }
    })
  );
  
  return result;
};
