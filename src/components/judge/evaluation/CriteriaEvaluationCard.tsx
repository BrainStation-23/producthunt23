
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import EvaluationCriteriaForm from './EvaluationCriteriaForm';
import CompleteEvaluationSection from './CompleteEvaluationSection';
import { JudgingCriteria } from '@/components/admin/settings/judging/types';

interface CriteriaEvaluationCardProps {
  productId: string;
  criteria: JudgingCriteria[];
  onComplete: () => Promise<void>;
  isSaving: boolean;
  isCompleted: boolean;
}

const CriteriaEvaluationCard: React.FC<CriteriaEvaluationCardProps> = ({
  productId,
  criteria,
  onComplete,
  isSaving,
  isCompleted
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluation Criteria</CardTitle>
      </CardHeader>
      <CardContent>
        <EvaluationCriteriaForm 
          productId={productId} 
          criteria={criteria}
        />
        
        <CompleteEvaluationSection 
          onComplete={onComplete}
          isSaving={isSaving}
          isCompleted={isCompleted}
        />
      </CardContent>
    </Card>
  );
};

export default CriteriaEvaluationCard;
