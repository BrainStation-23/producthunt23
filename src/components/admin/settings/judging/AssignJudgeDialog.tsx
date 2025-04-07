
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [selectedJudge, setSelectedJudge] = useState<string | null>(null);
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
    if (!selectedJudge) {
      toast.error("Please select a judge");
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('judge_assignments')
        .insert({
          judge_id: selectedJudge,
          product_id: productId,
        });

      if (error) throw error;

      onAssignmentAdded();
      onOpenChange(false);
      setSelectedJudge(null);
    } catch (error: any) {
      toast.error(`Failed to assign judge: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAvailableJudges = judges && judges.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Judge</DialogTitle>
          <DialogDescription>
            Select a judge to assign to this product for evaluation.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : hasAvailableJudges ? (
          <div className="py-4">
            <Select 
              value={selectedJudge || ''} 
              onValueChange={setSelectedJudge}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a judge" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-60">
                  {judges.map((judge: Judge) => (
                    <SelectItem key={judge.id} value={judge.id}>
                      {judge.username || judge.email}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
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
            type="button" 
            onClick={handleSubmit} 
            disabled={isSubmitting || !selectedJudge || !hasAvailableJudges}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              'Assign Judge'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignJudgeDialog;
