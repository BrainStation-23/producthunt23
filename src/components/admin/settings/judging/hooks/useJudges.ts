
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Judge } from '../types';

export const useJudges = () => {
  const [selectedJudge, setSelectedJudge] = useState<Judge | null>(null);

  // Fetch judges with assignment counts
  const { data: judges, isLoading, refetch: refetchJudges } = useQuery({
    queryKey: ['judges-with-assignments'],
    queryFn: async () => {
      try {
        // Get all users with judge role
        const { data: judgeRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'judge');

        if (rolesError) {
          throw rolesError;
        }

        if (!judgeRoles || judgeRoles.length === 0) {
          return [];
        }

        const judgeIds = judgeRoles.map(jr => jr.user_id);

        // Get profiles for these judges
        const { data: judgeProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, username, avatar_url')
          .in('id', judgeIds);

        if (profilesError) {
          throw profilesError;
        }

        // Get assignment counts for each judge
        const judgesWithCounts = await Promise.all(
          judgeProfiles.map(async (judge) => {
            const { count, error } = await supabase
              .from('judge_assignments')
              .select('id', { count: 'exact', head: true })
              .eq('judge_id', judge.id);
              
            if (error) {
              console.error('Error getting judge assignment count:', error);
              return {
                ...judge,
                assigned_product_count: 0
              };
            }
            
            return {
              ...judge,
              assigned_product_count: count || 0
            };
          })
        );

        return judgesWithCounts;
      } catch (error) {
        console.error('Error fetching judges:', error);
        toast.error('Failed to load judges');
        return [];
      }
    }
  });

  const handleJudgeSelected = (judge: Judge) => {
    setSelectedJudge(judge);
  };

  const handleAssignmentsUpdated = () => {
    refetchJudges();
    // If we have a selected judge, we need to update their assigned_product_count
    if (selectedJudge) {
      const updatedJudge = judges?.find(j => j.id === selectedJudge.id);
      if (updatedJudge) {
        setSelectedJudge(updatedJudge);
      }
    }
  };

  return {
    judges: judges || [],
    isLoading,
    selectedJudge,
    handleJudgeSelected,
    handleAssignmentsUpdated
  };
};
