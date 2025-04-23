
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface CompleteEvaluationSectionProps {
  onComplete: () => Promise<void>;
  isSaving: boolean;
}

const CompleteEvaluationSection: React.FC<CompleteEvaluationSectionProps> = ({
  onComplete,
  isSaving
}) => {
  return (
    <>
      <Separator className="my-6" />
      <div className="flex justify-end">
        <Button 
          size="lg" 
          onClick={onComplete}
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          Complete Evaluation
        </Button>
      </div>
    </>
  );
};

export default CompleteEvaluationSection;
