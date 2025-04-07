
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AssignedProduct } from '@/components/admin/settings/judging/types';
import { toast } from 'sonner';

export const useJudgeAssignments = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const { data: assignedProducts, isLoading, error, refetch } = useQuery({
    queryKey: ['judgeAssignments', filter],
    queryFn: async () => {
      try {
        // Fix: get user ID properly from Supabase auth
        const { data: authData } = await supabase.auth.getUser();
        const judgeId = authData.user?.id;
        
        if (!judgeId) {
          throw new Error('No authenticated user found');
        }

        const { data, error } = await supabase
          .rpc('get_judge_assigned_products', {
            judge_uuid: judgeId
          });

        if (error) throw error;

        // Add mock evaluation status for now
        // In a real implementation, this would come from the database
        const productsWithStatus = data.map((product: any) => ({
          ...product,
          evaluation_status: Math.random() > 0.7 
            ? 'completed' 
            : Math.random() > 0.5 
              ? 'in_progress' 
              : 'pending',
          deadline: new Date(Date.now() + Math.random() * 1000 * 60 * 60 * 24 * 14).toISOString(),
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
        }));

        if (filter !== 'all') {
          return productsWithStatus.filter((product: AssignedProduct) => 
            product.evaluation_status === filter
          );
        }

        return productsWithStatus;
      } catch (error: any) {
        toast.error('Failed to load assigned products');
        console.error('Error fetching judge assignments:', error);
        return [];
      }
    }
  });

  return {
    assignedProducts: assignedProducts as AssignedProduct[] || [],
    isLoading,
    error,
    refetch,
    filter,
    setFilter
  };
};
