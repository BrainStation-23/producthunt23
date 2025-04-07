
import React from 'react';
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

interface JudgingCriteria {
  id: string;
  name: string;
  description: string | null;
  type: 'rating' | 'boolean' | 'text';
  min_value: number | null;
  max_value: number | null;
  created_at: string;
  updated_at: string;
}

interface DeleteCriteriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  criteria: JudgingCriteria;
  onCriteriaDeleted: () => void;
}

const DeleteCriteriaDialog: React.FC<DeleteCriteriaDialogProps> = ({
  open,
  onOpenChange,
  criteria,
  onCriteriaDeleted,
}) => {
  const handleDelete = async () => {
    try {
      // Check if the criteria is in use - use type assertion to work around TypeScript limitations
      const { data: submissions, error: checkError } = await (supabase
        .from('judging_submissions' as any)
        .select('id')
        .eq('criteria_id', criteria.id)
        .limit(1) as any);

      if (checkError) throw checkError;

      if (submissions && submissions.length > 0) {
        toast.error('This criteria is currently in use and cannot be deleted.');
        onOpenChange(false);
        return;
      }

      // Delete the criteria - use type assertion to work around TypeScript limitations
      const { error } = await (supabase
        .from('judging_criteria' as any)
        .delete()
        .eq('id', criteria.id) as any);

      if (error) throw error;

      onCriteriaDeleted();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Failed to delete criteria: ${error.message}`);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the criteria "{criteria.name}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCriteriaDialog;
