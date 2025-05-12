
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, User, UserCheck, UserX } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProductJudgeStatusProps {
  isAssigned: boolean;
  isJudged: boolean;
}

const ProductJudgeStatus: React.FC<ProductJudgeStatusProps> = ({ isAssigned, isJudged }) => {
  // Different states:
  // - Not assigned (!isAssigned)
  // - Assigned but not judged (isAssigned && !isJudged)
  // - Assigned and judged (isAssigned && isJudged)
  
  if (!isAssigned) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="text-gray-500 bg-gray-100">
              <UserX className="h-3 w-3 mr-1" /> Not assigned
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>This product has not been assigned to any judge</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  if (!isJudged) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="text-amber-500 bg-amber-50">
              <User className="h-3 w-3 mr-1" /> Assigned
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>This product is assigned but has not been evaluated yet</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="text-green-500 bg-green-50">
            <UserCheck className="h-3 w-3 mr-1" /> Evaluated
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>This product has been assigned and evaluated</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProductJudgeStatus;
