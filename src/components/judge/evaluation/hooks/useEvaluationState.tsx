
import { useState, useEffect } from 'react';
import { useJudgeAssignments } from '@/hooks/useJudgeAssignments';
import { useEvaluationNotes } from './useEvaluationNotes';
import { useEvaluationStatus } from './useEvaluationStatus';

export const useEvaluationState = (productId: string | undefined) => {
  const { assignedProducts } = useJudgeAssignments();
  const currentProduct = assignedProducts.find(p => p.id === productId);
  
  const status = currentProduct?.evaluation_status || 'pending';
  const priority = currentProduct?.priority || 'medium';
  
  const { 
    notes, 
    setNotes, 
    handleSaveNotes, 
    isSaving: isNoteSaving 
  } = useEvaluationNotes(productId, currentProduct, status, priority);
  
  const {
    handleCompleteEvaluation,
    isSaving: isStatusSaving
  } = useEvaluationStatus(productId, notes, priority);

  const isSaving = isNoteSaving || isStatusSaving;

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
