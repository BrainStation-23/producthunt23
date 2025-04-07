
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface JudgingCriteria {
  id: string;
  name: string;
  description: string | null;
  type: 'rating' | 'boolean' | 'text';
  min_value: number | null;
  max_value: number | null;
  created_at: string;
  updated_at: string;
}

interface EditCriteriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  criteria: JudgingCriteria;
  onCriteriaUpdated: () => void;
}

const criteriaSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  type: z.enum(["rating", "boolean", "text"]),
  min_value: z.number().nullable().optional(),
  max_value: z.number().nullable().optional(),
}).refine((data) => {
  // For rating type, require both min and max values
  if (data.type === "rating") {
    return data.min_value !== null && data.max_value !== null && 
           data.min_value !== undefined && data.max_value !== undefined &&
           data.min_value < data.max_value;
  }
  return true;
}, {
  message: "For rating type, min value must be less than max value",
  path: ["max_value"]
});

type CriteriaFormValues = z.infer<typeof criteriaSchema>;

const EditCriteriaDialog: React.FC<EditCriteriaDialogProps> = ({ 
  open, 
  onOpenChange,
  criteria,
  onCriteriaUpdated 
}) => {
  const form = useForm<CriteriaFormValues>({
    resolver: zodResolver(criteriaSchema),
    defaultValues: {
      name: criteria.name,
      description: criteria.description || '',
      type: criteria.type,
      min_value: criteria.min_value,
      max_value: criteria.max_value,
    }
  });

  const { reset, watch, setValue } = form;
  const criteriaType = watch('type');

  // Update form values when criteria changes
  useEffect(() => {
    reset({
      name: criteria.name,
      description: criteria.description || '',
      type: criteria.type,
      min_value: criteria.min_value,
      max_value: criteria.max_value,
    });
  }, [criteria, reset]);

  const onSubmit = async (data: CriteriaFormValues) => {
    try {
      // For non-rating types, set min/max to null
      if (data.type !== 'rating') {
        data.min_value = null;
        data.max_value = null;
      }

      // Use type assertion to work around TypeScript limitations
      const { error } = await (supabase
        .from('judging_criteria' as any)
        .update(data)
        .eq('id', criteria.id) as any);

      if (error) throw error;
      
      onCriteriaUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Failed to update criteria: ${error.message}`);
    }
  };

  const handleTypeChange = (type: string) => {
    setValue('type', type as 'rating' | 'boolean' | 'text');
    
    if (type === 'rating') {
      setValue('min_value', criteria.min_value !== null ? criteria.min_value : 1);
      setValue('max_value', criteria.max_value !== null ? criteria.max_value : 10);
    } else {
      setValue('min_value', null);
      setValue('max_value', null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Judging Criteria</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Criteria Type</FormLabel>
                  <Select 
                    onValueChange={handleTypeChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="rating">Rating (Numerical)</SelectItem>
                      <SelectItem value="boolean">Yes/No</SelectItem>
                      <SelectItem value="text">Text Comment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {criteriaType === 'rating' && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="min_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Value</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                          value={field.value === null ? '' : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="max_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Value</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                          value={field.value === null ? '' : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCriteriaDialog;
