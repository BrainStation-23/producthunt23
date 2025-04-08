
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useJudgeAssignments } from '@/hooks/useJudgeAssignments';
import { AssignedProduct } from '@/components/admin/settings/judging/types';

export const useEvaluationNotes = (
  productId: string | undefined,
  currentProduct: AssignedProduct | undefined,
  status: string,
  priority: string
) => {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { updateEvaluationStatus } = useJudgeAssignments();
  
  // Initialize notes from current product
  useEffect(() => {
    if (currentProduct) {
      setNotes(currentProduct.notes || '');
    }
  }, [currentProduct]);

  const handleSaveNotes = async () => {
    if (!productId) return;
    
    setIsSaving(true);
    try {
      await updateEvaluationStatus.mutateAsync({
        productId,
        status,
        priority,
        notes,
        deadline: new Date().toISOString()
      });
      toast.success('Notes saved successfully');
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Error saving notes');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    notes,
    setNotes,
    handleSaveNotes,
    isSaving
  };
};
