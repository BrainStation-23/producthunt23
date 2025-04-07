
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JudgeList } from './assignment/JudgeList';
import { JudgeAssignmentDetail } from './assignment/JudgeAssignmentDetail';
import { toast } from 'sonner';

export interface Judge {
  id: string;
  username: string | null;
  email: string;
  avatar_url: string | null;
  assigned_product_count: number;
}

const JudgeAssignmentPanel: React.FC = () => {
  const [selectedJudge, setSelectedJudge] = useState<Judge | null>(null);
  const [viewMode, setViewMode] = useState<'judges' | 'unassigned'>('judges');
  
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

  return (
    <div className="h-[calc(100vh-320px)] min-h-[500px]">
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'judges' | 'unassigned')} className="mb-4">
        <TabsList>
          <TabsTrigger value="judges">Judges</TabsTrigger>
          <TabsTrigger value="unassigned">Unassigned Products</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {viewMode === 'judges' ? (
        <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
          <ResizablePanel defaultSize={30} minSize={20}>
            <JudgeList 
              judges={judges || []} 
              isLoading={isLoading}
              selectedJudgeId={selectedJudge?.id} 
              onSelectJudge={handleJudgeSelected}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={70}>
            {selectedJudge ? (
              <JudgeAssignmentDetail 
                judge={selectedJudge}
                onAssignmentsUpdated={handleAssignmentsUpdated}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground p-4">
                Select a judge to manage their product assignments
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="rounded-lg border p-4">
          <p className="text-center text-muted-foreground">
            Unassigned products functionality coming soon.
          </p>
        </div>
      )}
    </div>
  );
};

export default JudgeAssignmentPanel;
