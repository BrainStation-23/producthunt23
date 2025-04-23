
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import EvaluationCriteriaForm from './EvaluationCriteriaForm';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { JudgingCriteria } from '@/components/admin/settings/judging/types';

interface CriteriaEvaluationCardProps {
  productId: string;
  criteria: JudgingCriteria[];
  onSubmit: () => Promise<void>;
  isSaving: boolean;
  isCompleted: boolean;
}

const CriteriaEvaluationCard: React.FC<CriteriaEvaluationCardProps> = ({
  productId,
  criteria,
  onSubmit,
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
        
        <Separator className="my-6" />
        <div className="flex justify-end">
          <Button 
            size="lg" 
            onClick={onSubmit}
            disabled={isSaving || isCompleted}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Submit Evaluation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CriteriaEvaluationCard;
