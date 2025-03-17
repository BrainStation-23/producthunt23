
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '@/types/product';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import TagsSelector from '@/components/products/TagsSelector';

interface CategoriesSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ form }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories*</FormLabel>
              <FormControl>
                <TagsSelector 
                  selected={field.value} 
                  onSelect={(tags) => field.onChange(tags)} 
                />
              </FormControl>
              <FormDescription>
                Select categories that best describe your product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default CategoriesSection;
