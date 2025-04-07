
import React from 'react';
import { JudgingCriteria } from '@/components/admin/settings/judging/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface EvaluationCriteriaFormProps {
  criteria: JudgingCriteria[];
  formValues: Record<string, any>;
  onChange: (criteriaId: string, field: string, value: any) => void;
}

const EvaluationCriteriaForm: React.FC<EvaluationCriteriaFormProps> = ({
  criteria,
  formValues,
  onChange
}) => {
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
                value={formValues[criterion.id]?.rating_value || 0}
                onChange={(value) => onChange(criterion.id, 'rating_value', value)}
              />
            )}

            {criterion.type === 'boolean' && (
              <BooleanCriterion
                criterion={criterion}
                value={formValues[criterion.id]?.boolean_value || false}
                onChange={(value) => onChange(criterion.id, 'boolean_value', value)}
              />
            )}

            {criterion.type === 'text' && (
              <TextCriterion
                criterion={criterion}
                value={formValues[criterion.id]?.text_value || ''}
                onChange={(value) => onChange(criterion.id, 'text_value', value)}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface RatingCriterionProps {
  criterion: JudgingCriteria;
  value: number;
  onChange: (value: number) => void;
}

const RatingCriterion: React.FC<RatingCriterionProps> = ({
  criterion,
  value,
  onChange
}) => {
  const minValue = criterion.min_value || 0;
  const maxValue = criterion.max_value || 10;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Rating</Label>
          <span className="text-sm font-medium">{value} / {maxValue}</span>
        </div>
        <Slider
          value={[value]}
          min={minValue}
          max={maxValue}
          step={1}
          onValueChange={(values) => onChange(values[0])}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  );
};

interface BooleanCriterionProps {
  criterion: JudgingCriteria;
  value: boolean;
  onChange: (value: boolean) => void;
}

const BooleanCriterion: React.FC<BooleanCriterionProps> = ({
  criterion,
  value,
  onChange
}) => {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox
        id={`checkbox-${criterion.id}`}
        checked={value}
        onCheckedChange={onChange}
      />
      <div className="space-y-1 leading-none">
        <Label
          htmlFor={`checkbox-${criterion.id}`}
          className="cursor-pointer font-normal"
        >
          Yes, this product meets this criterion
        </Label>
      </div>
    </div>
  );
};

interface TextCriterionProps {
  criterion: JudgingCriteria;
  value: string;
  onChange: (value: string) => void;
}

const TextCriterion: React.FC<TextCriterionProps> = ({
  criterion,
  value,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={`text-${criterion.id}`}>Comments</Label>
      <Textarea
        id={`text-${criterion.id}`}
        placeholder="Enter your evaluation comments here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
      />
    </div>
  );
};

export default EvaluationCriteriaForm;
