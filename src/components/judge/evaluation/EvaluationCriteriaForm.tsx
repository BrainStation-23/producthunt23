
import React from 'react';
import { JudgingCriteria } from '@/components/admin/settings/judging/types';
import CriterionCard from './criteria/CriterionCard';
import { useEvaluationSubmissions } from './hooks/useEvaluationSubmissions';

interface EvaluationCriteriaFormProps {
  productId: string;
  criteria: JudgingCriteria[];
  onHasChangesUpdate?: (hasChanges: boolean) => void;
}

const EvaluationCriteriaForm: React.FC<EvaluationCriteriaFormProps> = ({
  productId,
  criteria,
  onHasChangesUpdate
}) => {
  const { formValues, handleChange, isLoading, hasChanges } = useEvaluationSubmissions(productId);

  // Pass hasChanges to parent component when it changes
  React.useEffect(() => {
    if (onHasChangesUpdate) {
      onHasChangesUpdate(hasChanges);
    }
  }, [hasChanges, onHasChangesUpdate]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (criteria.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No evaluation criteria found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {criteria.map((criterion) => (
        <CriterionCard 
          key={criterion.id}
          criterion={criterion}
          formValues={formValues}
          onChangeValue={handleChange}
        />
      ))}
    </div>
  );
};

export default EvaluationCriteriaForm;
