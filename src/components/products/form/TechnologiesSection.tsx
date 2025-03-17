
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TechnologiesSelector from '@/components/products/TechnologiesSelector';
import { Code } from 'lucide-react';

interface TechnologiesSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

const TechnologiesSection: React.FC<TechnologiesSectionProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Code className="h-5 w-5" />
          Technologies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologies<span className="text-destructive">*</span></FormLabel>
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
