
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface Judge {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  product_count: number;
}

interface RemoveJudgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  judge: Judge;
  onJudgeRemoved: () => void;
}

const RemoveJudgeDialog: React.FC<RemoveJudgeDialogProps> = ({
  open,
  onOpenChange,
  judge,
  onJudgeRemoved,
}) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    try {
      setIsRemoving(true);

      // Check if the judge has any assignments
      if (judge.product_count > 0) {
        // Delete judge assignments
        const { error: assignmentError } = await (supabase
          .from('judge_assignments' as any)
          .delete()
          .eq('judge_id', judge.id) as any);

        if (assignmentError) throw assignmentError;
      }

      // Remove the judge role
      const { error } = await (supabase
        .from('user_roles')
        .delete()
        .eq('user_id', judge.id)
        .eq('role', 'judge') as any);

      if (error) throw error;

      onJudgeRemoved();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Failed to remove judge: ${error.message}`);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Judge</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the judge role from <span className="font-semibold">{judge.username || judge.email}</span>. 
            {judge.product_count > 0 ? (
              <span className="block mt-2 text-red-500">
                Warning: This judge has {judge.product_count} assigned products. Those assignments will also be removed.
              </span>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleRemove} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isRemoving}
          >
            {isRemoving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              'Remove Judge'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveJudgeDialog;
