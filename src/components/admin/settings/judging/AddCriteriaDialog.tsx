import React from 'react';
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

interface AddCriteriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCriteriaAdded: () => void;
}

const criteriaSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  type: z.enum(["rating", "boolean", "text"]),
  min_value: z.number().nullable().optional(),
  max_value: z.number().nullable().optional(),
  weight: z.number().min(0.1).max(10).default(1),
}).refine((data) => {
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

const AddCriteriaDialog: React.FC<AddCriteriaDialogProps> = ({ 
  open, 
  onOpenChange,
  onCriteriaAdded 
}) => {
  const form = useForm<CriteriaFormValues>({
    resolver: zodResolver(criteriaSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'rating',
      min_value: 1,
      max_value: 10,
      weight: 1,
    }
  });

  const { reset, watch, setValue } = form;
  const criteriaType = watch('type');

  const onSubmit = async (data: CriteriaFormValues) => {
    try {
      if (data.type !== 'rating') {
        data.min_value = null;
        data.max_value = null;
      }

      const { error } = await (supabase
        .from('judging_criteria' as any)
        .insert([data]) as any);

      if (error) throw error;
      
      onCriteriaAdded();
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error(`Failed to add criteria: ${error.message}`);
    }
  };

  const handleTypeChange = (type: string) => {
    setValue('type', type as 'rating' | 'boolean' | 'text');
    
    if (type === 'rating') {
      setValue('min_value', 1);
      setValue('max_value', 10);
    } else {
      setValue('min_value', null);
      setValue('max_value', null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Judging Criteria</DialogTitle>
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
                    <Input placeholder="e.g., Design Quality" {...field} />
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
                      placeholder="Explain what judges should evaluate for this criteria" 
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
            
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (1 = 100%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1"
                      min="0.1"
                      max="10"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => {
                  reset();
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Add Criteria</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCriteriaDialog;
