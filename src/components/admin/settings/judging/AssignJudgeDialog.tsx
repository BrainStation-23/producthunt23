
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { SearchableMultiJudgeSelect } from './assignment/SearchableMultiJudgeSelect';

interface AssignJudgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  onAssignmentAdded: () => void;
}

interface Judge {
  id: string;
  username: string | null;
  email: string;
  avatar_url: string | null;
}

const AssignJudgeDialog: React.FC<AssignJudgeDialogProps> = ({
  open,
  onOpenChange,
  productId,
  onAssignmentAdded,
}) => {
  const [selectedJudges, setSelectedJudges] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available judges (judges who aren't already assigned to this product)
  const { data: judges, isLoading } = useQuery({
    queryKey: ['available-judges', productId],
    queryFn: async () => {
      try {
        // Get all users with judge role
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

        // Get profiles for these judges
        const { data: judgeProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, username, avatar_url')
          .in('id', judgeIds);

        if (profilesError) {
          toast.error(`Failed to load judge profiles: ${profilesError.message}`);
          throw profilesError;
        }

        // Get already assigned judges for this product
        const { data: assignments, error: assignmentsError } = await supabase
          .from('judge_assignments')
          .select('judge_id')
          .eq('product_id', productId);

        if (assignmentsError) {
          toast.error(`Failed to load assignments: ${assignmentsError.message}`);
          throw assignmentsError;
        }

        // Filter out already assigned judges
        const assignedJudgeIds = assignments.map((a) => a.judge_id);
        const availableJudges = judgeProfiles.filter((judge) => 
          !assignedJudgeIds.includes(judge.id)
        );

        return availableJudges;
      } catch (error: any) {
        console.error('Error fetching available judges:', error);
        throw error;
      }
    },
    enabled: open,
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

  const handleJudgeToggle = (judgeId: string) => {
    setSelectedJudges(prev => 
      prev.includes(judgeId)
        ? prev.filter(id => id !== judgeId)
        : [...prev, judgeId]
    );
  };

  const hasAvailableJudges = judges && judges.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Judges</DialogTitle>
          <DialogDescription>
            Select judges to assign to this product for evaluation.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : hasAvailableJudges ? (
          <SearchableMultiJudgeSelect
            judges={judges}
            selectedJudges={selectedJudges}
            onJudgeToggle={handleJudgeToggle}
          />
        ) : (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">
              No available judges found. All judges have already been assigned to this product or no judges exist.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !hasAvailableJudges || selectedJudges.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              `Assign ${selectedJudges.length} Judge${selectedJudges.length !== 1 ? 's' : ''}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignJudgeDialog;
