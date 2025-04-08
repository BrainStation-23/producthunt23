
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AssignedProduct, JudgingEvaluation } from '@/components/admin/settings/judging/types';
import { toast } from 'sonner';

export const useJudgeAssignments = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const queryClient = useQueryClient();

  const { data: assignedProducts, isLoading, error } = useQuery({
    queryKey: ['judgeAssignments', filter],
    queryFn: async () => {
      try {
        // Get user ID properly from Supabase auth
        const { data: authData } = await supabase.auth.getUser();
        const judgeId = authData.user?.id;
        
        if (!judgeId) {
          throw new Error('No authenticated user found');
        }

        // Get assigned products using the RPC function
        const { data: assignedProductsData, error: assignmentsError } = await supabase
          .rpc('get_judge_assigned_products', {
            judge_uuid: judgeId
          });

        if (assignmentsError) throw assignmentsError;

        // Get evaluation statuses for these products - use a custom query
        const { data: evaluationsData, error: evaluationsError } = await supabase
          .from('judging_evaluations')
          .select('*')
          .eq('judge_id', judgeId);
          
        if (evaluationsError) {
          console.error('Error fetching evaluations:', evaluationsError);
          // Continue even if there's an error - we'll just assume no evaluations exist
        }

        // Create a map of product IDs to evaluation status
        const evaluationMap = (evaluationsData || []).reduce((map, evaluation) => {
          map[evaluation.product_id] = evaluation;
          return map;
        }, {});

        // Combine product data with evaluation status
        const productsWithStatus = assignedProductsData.map((product) => {
          const evaluation = evaluationMap[product.id];
          return {
            ...product,
            evaluation_status: evaluation ? evaluation.status : 'pending',
            priority: evaluation ? evaluation.priority : 'medium',
            deadline: evaluation ? evaluation.deadline : null,
            notes: evaluation ? evaluation.notes : null,
          };
        });

        // Filter products based on selected filter
        if (filter !== 'all') {
          return productsWithStatus.filter((product) => 
            product.evaluation_status === filter
          );
        }

        return productsWithStatus;
      } catch (error) {
        toast.error('Failed to load assigned products');
        console.error('Error fetching judge assignments:', error);
        return [];
      }
    }
  });

  // Mutation to update evaluation status
  const updateEvaluationStatus = useMutation({
    mutationFn: async ({
      productId, 
      status, 
      priority = 'medium',
      notes = '',
      deadline = null
    }: {
      productId: string;
      status: 'pending' | 'in_progress' | 'completed';
      priority?: 'low' | 'medium' | 'high';
      notes?: string;
      deadline?: string | null;
    }) => {
      const { data: authData } = await supabase.auth.getUser();
      const judgeId = authData.user?.id;
      
      if (!judgeId) {
        throw new Error('No authenticated user found');
      }

      // Auto-set status to 'in_progress' when notes are added for a 'pending' item
      if (status === 'pending' && notes && notes.trim() !== '') {
        status = 'in_progress';
      }

      // First check if the judging_evaluations table exists and has our evaluation
      const { data: existing, error: checkError } = await supabase
        .from('judging_evaluations')
        .select('id, status')
        .eq('judge_id', judgeId)
        .eq('product_id', productId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking for existing evaluation:', checkError);
      }

      const currentTime = new Date().toISOString();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('judging_evaluations')
          .update({
            status,
            priority,
            notes,
            deadline,
            updated_at: currentTime
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('judging_evaluations')
          .insert({
            judge_id: judgeId,
            product_id: productId,
            status,
            priority,
            notes,
            deadline: deadline || currentTime
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['judgeAssignments'] });
      toast.success('Evaluation status updated');
    },
    onError: (error) => {
      toast.error('Failed to update evaluation status');
      console.error('Error updating evaluation status:', error);
    }
  });

  return {
    assignedProducts: assignedProducts as AssignedProduct[] || [],
    isLoading,
    error,
    filter,
    setFilter,
    updateEvaluationStatus
  };
};
