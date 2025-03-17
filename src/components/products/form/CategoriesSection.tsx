
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
import CategorySelector from '@/components/products/CategorySelector';

interface CategoriesSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ form }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories*</FormLabel>
              <FormControl>
                <CategorySelector 
                  selected={field.value} 
                  onSelect={(categories) => field.onChange(categories)} 
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
