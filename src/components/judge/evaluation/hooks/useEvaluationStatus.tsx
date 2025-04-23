
import { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';
import { useJudgeAssignments } from '@/hooks/useJudgeAssignments';

type EvaluationPriority = 'low' | 'medium' | 'high';

export const useEvaluationStatus = (
  productId: string | undefined,
  notes: string,
  priority: EvaluationPriority,
  navigate: NavigateFunction
) => {
  const [isSaving, setIsSaving] = useState(false);
  const { updateEvaluationStatus } = useJudgeAssignments();

  const handleCompleteEvaluation = async () => {
    if (!productId) return;
    
    const allCriteriaEvaluated = true; // This would need actual validation logic
    
    if (!allCriteriaEvaluated) {
      toast.error('Please complete the evaluation for all criteria before submitting');
      return;
    }
    
    setIsSaving(true);
    try {
      await updateEvaluationStatus.mutateAsync({
        productId,
        status: 'completed',
        priority,
        notes,
        deadline: new Date().toISOString()
      });
      
      toast.success('Evaluation completed successfully');
      navigate('/judge/evaluations');
    } catch (error) {
      console.error('Error completing evaluation:', error);
      toast.error('Error completing evaluation');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleCompleteEvaluation,
    isSaving
  };
};
