
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues, Screenshot } from '@/types/product';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import ScreenshotsManager from '@/components/products/ScreenshotsManager';

interface ScreenshotsSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

const ScreenshotsSection: React.FC<ScreenshotsSectionProps> = ({ form }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <FormField
          control={form.control}
          name="screenshots"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Screenshots</FormLabel>
              <FormControl>
                <ScreenshotsManager 
                  screenshots={field.value as Screenshot[]} 
                  onChange={(screenshots: Screenshot[]) => field.onChange(screenshots)} 
                />
              </FormControl>
              <FormDescription>
                Add screenshots of your product (optional but recommended).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ScreenshotsSection;
