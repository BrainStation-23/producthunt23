
import React from 'react';
import { JudgingCriteria } from '@/components/admin/settings/judging/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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

export default TextCriterion;
