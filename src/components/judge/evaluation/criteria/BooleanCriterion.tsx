
import React from 'react';
import { JudgingCriteria } from '@/components/admin/settings/judging/types';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

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

export default BooleanCriterion;
