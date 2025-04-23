
import React from 'react';
import { JudgingCriteria } from '@/components/admin/settings/judging/types';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const maxValue = criterion.max_value || 5;
  const stars = Array.from({ length: maxValue }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Rating</Label>
        <span className="text-sm font-medium">{value} / {maxValue}</span>
      </div>
      <div className="flex gap-1 justify-center">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded"
            aria-label={`Rate ${star} out of ${maxValue}`}
          >
            <Star
              className={cn(
                "w-8 h-8 transition-colors",
                star <= value
                  ? "fill-primary stroke-primary text-primary"
                  : "fill-none stroke-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingCriterion;
