
import { useEffect } from 'react';
import { getBrandName } from '@/config/appConfig';

/**
 * Hook to dynamically set the document title
 * 
 * @param title - The page title to set
 * @param includeAppName - Whether to include the app name in the title
 */
export const useDocumentTitle = (title: string, includeAppName: boolean = true): void => {
  useEffect(() => {
    // Get the app name from configuration
    const appName = getBrandName();
    
    // Set the document title
    document.title = includeAppName ? `${title} | ${appName}` : title;
    
    // Reset to default when component unmounts
    return () => {
      document.title = appName;
    };
  }, [title, includeAppName]);
};

export default useDocumentTitle;
