import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useEvaluationSubmissions = (productId: string) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
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

  const saveSubmission = useMutation({
    mutationFn: async (submission: {
      criteriaId: string;
      field: string;
      value: any;
    }) => {
      const { criteriaId, field, value } = submission;
      const { data: authData } = await supabase.auth.getUser();
      const judgeId = authData.user?.id;
      
      if (!judgeId) {
        throw new Error('No authenticated user found');
      }

      const { data: existing } = await supabase
        .from('judging_submissions')
        .select('*')
        .eq('judge_id', judgeId)
        .eq('product_id', productId)
        .eq('criteria_id', criteriaId)
        .maybeSingle();

      if (existing) {
        // Update existing submission
        const { error } = await supabase
          .from('judging_submissions')
          .update({
            [field]: value,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
          
        if (error) throw error;
      } else {
        // Create new submission
        const { error } = await supabase
          .from('judging_submissions')
          .insert({
            judge_id: judgeId,
            product_id: productId,
            criteria_id: criteriaId,
            [field]: value
          });
          
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluationSubmissions', productId] });
    },
    onError: (error) => {
      toast.error('Failed to save evaluation');
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

    // Save the change to the database
    saveSubmission.mutate({ criteriaId, field, value });
  };

  return {
    formValues,
    handleChange,
    isLoading
  };
};
