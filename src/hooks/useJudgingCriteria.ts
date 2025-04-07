
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JudgingCriteria } from '@/components/admin/settings/judging/types';
import { toast } from 'sonner';

export const useJudgingCriteria = () => {
  const { data: criteria, isLoading, error } = useQuery({
    queryKey: ['judgingCriteria'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('judging_criteria')
          .select('*');

        if (error) throw error;
        
        return data as JudgingCriteria[];
      } catch (error: any) {
        toast.error('Failed to load judging criteria');
        console.error('Error fetching judging criteria:', error);
        return [];
      }
    }
  });

  return {
    criteria: criteria || [],
    isLoading,
    error
  };
};
