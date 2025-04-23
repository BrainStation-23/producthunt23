
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useEvaluationSubmissions = (productId: string) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const queryClient = useQueryClient();

  // Fetch existing submissions for this product
  const { data: existingSubmissions, isLoading } = useQuery({
    queryKey: ['evaluationSubmissions', productId],
    queryFn: async () => {
      const { data: authData } = await supabase.auth.getUser();
      const judgeId = authData.user?.id;
      
      if (!judgeId) {
        throw new Error('No authenticated user found');
      }
      
      const { data, error } = await supabase
        .from('judging_submissions')
        .select('*')
        .eq('judge_id', judgeId)
        .eq('product_id', productId);
        
      if (error) throw error;
      return data || [];
    }
  });

  // Initialize form values from existing submissions
  useEffect(() => {
    if (existingSubmissions && existingSubmissions.length > 0) {
      const values = {};
      existingSubmissions.forEach((submission) => {
        values[submission.criteria_id] = {
          rating_value: submission.rating_value,
          boolean_value: submission.boolean_value,
          text_value: submission.text_value
        };
      });
      setFormValues(values);
    }
  }, [existingSubmissions]);

  const saveSubmissions = useMutation({
    mutationFn: async () => {
      const { data: authData } = await supabase.auth.getUser();
      const judgeId = authData.user?.id;
      
      if (!judgeId) {
        throw new Error('No authenticated user found');
      }

      // Get all changed criteria values and submit them
      const submissions = Object.entries(formValues).map(([criteriaId, values]) => ({
        judge_id: judgeId,
        product_id: productId,
        criteria_id: criteriaId,
        ...values
      }));

      const { error } = await supabase
        .from('judging_submissions')
        .upsert(submissions, {
          onConflict: 'product_id,judge_id,criteria_id'
        });
        
      if (error) throw error;
      
      setHasChanges(false);
      return submissions;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluationSubmissions', productId] });
      toast.success('Evaluation submitted successfully');
    },
    onError: (error) => {
      toast.error('Failed to submit evaluation');
      console.error('Error saving evaluation:', error);
    }
  });

  const handleChange = (criteriaId: string, field: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [criteriaId]: {
        ...prev[criteriaId],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  return {
    formValues,
    handleChange,
    isLoading,
    saveSubmissions,
    hasChanges
  };
};
