
import React from 'react';
import { JudgingCriteria } from '@/components/admin/settings/judging/types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

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

export default RatingCriterion;
