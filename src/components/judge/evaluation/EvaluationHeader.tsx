
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import StatusBadge from './status/StatusBadge';
import PriorityBadge from './status/PriorityBadge';

interface EvaluationHeaderProps {
  status: string;
  priority: string;
}

const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({ status, priority }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div>
        <Button variant="ghost" onClick={() => navigate('/judge/evaluations')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Evaluations
        </Button>
        <h1 className="text-3xl font-bold tracking-tight mt-2">Product Evaluation</h1>
      </div>
      <div className="flex items-center space-x-2">
        <StatusBadge status={status} />
        <PriorityBadge priority={priority} />
      </div>
    </div>
  );
};

export default EvaluationHeader;
