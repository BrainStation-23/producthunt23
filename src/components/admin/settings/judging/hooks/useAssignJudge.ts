
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Judge } from '../types';

interface UseAssignJudgeProps {
  productId: string;
  onAssignmentAdded: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useAssignJudge = ({ productId, onAssignmentAdded, onOpenChange }: UseAssignJudgeProps) => {
  const [selectedJudges, setSelectedJudges] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: judges, isLoading } = useQuery({
    queryKey: ['available-judges', productId],
    queryFn: async () => {
      try {
        const { data: judgeRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'judge');

        if (rolesError) {
          toast.error(`Failed to load judges: ${rolesError.message}`);
          throw rolesError;
        }

        if (!judgeRoles || judgeRoles.length === 0) {
          return [];
        }

        const judgeIds = judgeRoles.map(jr => jr.user_id);

        const { data: judgeProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, username, avatar_url')
          .in('id', judgeIds);

        if (profilesError) {
          toast.error(`Failed to load judge profiles: ${profilesError.message}`);
          throw profilesError;
        }

        const { data: assignments, error: assignmentsError } = await supabase
          .from('judge_assignments')
          .select('judge_id')
          .eq('product_id', productId);

        if (assignmentsError) {
          toast.error(`Failed to load assignments: ${assignmentsError.message}`);
          throw assignmentsError;
        }

        const assignedJudgeIds = assignments.map((a) => a.judge_id);
        return judgeProfiles.filter((judge) => 
          !assignedJudgeIds.includes(judge.id)
        );
      } catch (error: any) {
        console.error('Error fetching available judges:', error);
        throw error;
      }
    },
    enabled: true,
  });

  const handleSubmit = async () => {
    if (selectedJudges.length === 0) {
      toast.error("Please select at least one judge");
      return;
    }

    try {
      setIsSubmitting(true);

      const assignments = selectedJudges.map(judgeId => ({
        judge_id: judgeId,
        product_id: productId,
      }));

      const { error } = await supabase
        .from('judge_assignments')
        .insert(assignments);

      if (error) throw error;

      onAssignmentAdded();
      onOpenChange(false);
      setSelectedJudges([]);
      toast.success(`Successfully assigned ${selectedJudges.length} judge${selectedJudges.length > 1 ? 's' : ''}`);
    } catch (error: any) {
      toast.error(`Failed to assign judges: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedJudges,
    setSelectedJudges,
    isSubmitting,
    judges: judges || [],
    isLoading,
    handleSubmit,
    hasAvailableJudges: judges && judges.length > 0,
  };
};
