
import { useState } from 'react';
import { toast } from 'sonner';
import { useJudgeAssignments } from '@/hooks/useJudgeAssignments';

type EvaluationPriority = 'low' | 'medium' | 'high';

export const useEvaluationStatus = (
  productId: string | undefined,
  notes: string,
  priority: EvaluationPriority
) => {
  const [isSaving, setIsSaving] = useState(false);
  const { updateEvaluationStatus } = useJudgeAssignments();

  const handleCompleteEvaluation = async () => {
    if (!productId) return;
    
    setIsSaving(true);
    try {
      await updateEvaluationStatus.mutateAsync({
        productId,
        status: 'completed',
        priority,
        notes,
        deadline: new Date().toISOString()
      });
      
      toast.success('Evaluation saved successfully');
    } catch (error) {
      console.error('Error saving evaluation:', error);
      toast.error('Error saving evaluation');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleCompleteEvaluation,
    isSaving
  };
};
