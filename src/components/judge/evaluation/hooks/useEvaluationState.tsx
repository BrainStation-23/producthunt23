
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useJudgeAssignments } from '@/hooks/useJudgeAssignments';
import { AssignedProduct } from '@/components/admin/settings/judging/types';

export const useEvaluationState = (productId: string | undefined) => {
  const navigate = useNavigate();
  const { assignedProducts, updateEvaluationStatus } = useJudgeAssignments();
  
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const currentProduct = assignedProducts.find(p => p.id === productId);
  const status = currentProduct?.evaluation_status || 'pending';
  const priority = currentProduct?.priority || 'medium';
  
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
        deadline: new Date().toISOString() // Automatically set deadline to now
      });
      toast.success('Notes saved successfully');
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Error saving notes');
    } finally {
      setIsSaving(false);
    }
  };

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
    notes,
    setNotes,
    isSaving,
    status,
    priority,
    handleSaveNotes,
    handleCompleteEvaluation,
    currentProduct
  };
};
