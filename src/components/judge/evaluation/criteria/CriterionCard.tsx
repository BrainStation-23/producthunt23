
import React from 'react';
import { JudgingCriteria } from '@/components/admin/settings/judging/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import RatingCriterion from './RatingCriterion';
import BooleanCriterion from './BooleanCriterion';
import TextCriterion from './TextCriterion';

interface CriterionCardProps {
  criterion: JudgingCriteria;
  formValues: Record<string, any>;
  onChangeValue: (criteriaId: string, field: string, value: any) => void;
}

const CriterionCard: React.FC<CriterionCardProps> = ({
  criterion,
  formValues,
  onChangeValue
}) => {
  const values = formValues[criterion.id] || {};
  
  return (
    <Card key={criterion.id} className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-base">{criterion.name}</CardTitle>
        {criterion.description && (
          <CardDescription>{criterion.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        {criterion.type === 'rating' && (
          <RatingCriterion
            criterion={criterion}
            value={values.rating_value || 0}
            onChange={(value) => onChangeValue(criterion.id, 'rating_value', value)}
          />
        )}

        {criterion.type === 'boolean' && (
          <BooleanCriterion
            criterion={criterion}
            value={values.boolean_value || false}
            onChange={(value) => onChangeValue(criterion.id, 'boolean_value', value)}
          />
        )}

        {criterion.type === 'text' && (
          <TextCriterion
            criterion={criterion}
            value={values.text_value || ''}
            onChange={(value) => onChangeValue(criterion.id, 'text_value', value)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CriterionCard;
