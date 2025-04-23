
import React from 'react';
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
import { useAssignJudge } from './hooks/useAssignJudge';

interface AssignJudgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  onAssignmentAdded: () => void;
}

const AssignJudgeDialog: React.FC<AssignJudgeDialogProps> = ({
  open,
  onOpenChange,
  productId,
  onAssignmentAdded,
}) => {
  const {
    selectedJudges,
    setSelectedJudges,
    isSubmitting,
    judges,
    isLoading,
    handleSubmit,
    hasAvailableJudges,
  } = useAssignJudge({
    productId,
    onAssignmentAdded,
    onOpenChange,
  });

  const handleJudgeToggle = (judgeId: string) => {
    setSelectedJudges(prev => 
      prev.includes(judgeId)
        ? prev.filter(id => id !== judgeId)
        : [...prev, judgeId]
    );
  };

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
