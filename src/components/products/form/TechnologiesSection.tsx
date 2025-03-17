
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
import TechnologiesSelector from '@/components/products/TechnologiesSelector';

interface TechnologiesSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

const TechnologiesSection: React.FC<TechnologiesSectionProps> = ({ form }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologies*</FormLabel>
              <FormControl>
                <TechnologiesSelector 
                  selected={field.value} 
                  onSelect={(techs) => field.onChange(techs)} 
                />
              </FormControl>
              <FormDescription>
                Select the technologies used to build your product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default TechnologiesSection;
