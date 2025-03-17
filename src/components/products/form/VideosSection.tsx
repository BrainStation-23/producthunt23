
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues, Video } from '@/types/product';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import VideosManager from '@/components/products/VideosManager';

interface VideosSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

const VideosSection: React.FC<VideosSectionProps> = ({ form }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <FormField
          control={form.control}
          name="videos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Videos</FormLabel>
              <FormControl>
                <VideosManager 
                  videos={field.value as Video[]} 
                  onChange={(videos: Video[]) => field.onChange(videos)} 
                />
              </FormControl>
              <FormDescription>
                Add YouTube or Vimeo videos showcasing your product (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default VideosSection;
