
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
import { Checkbox } from '@/components/ui/checkbox';

interface AgreementSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

const AgreementSection: React.FC<AgreementSectionProps> = ({ form }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <FormField
          control={form.control}
          name="agreed_to_policies"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I agree to the product submission policies
                </FormLabel>
                <FormDescription>
                  By checking this box, you confirm that your submission follows our community guidelines and terms of service.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default AgreementSection;
