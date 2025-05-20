
import React from 'react';
import { Check, Badge } from 'lucide-react';
import { JudgingCriteria } from '@/components/admin/settings/judging/types';

interface CriteriaListProps {
  criteria: JudgingCriteria[];
}

const CriteriaList = ({ criteria }: CriteriaListProps) => {
  if (!criteria || criteria.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 text-left">
      <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center">
        <Badge className="mr-2" />
        Grading Criteria
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {criteria.map((criterion) => (
          <div key={criterion.id} className="flex items-start">
            <Check className="mr-2 mt-1 h-4 w-4 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium">{criterion.name}</p>
              {criterion.description && (
                <p className="text-sm text-muted-foreground">{criterion.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CriteriaList;
