
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type StatusBadgeVariant = "default" | "destructive" | "outline" | "secondary";

export const getStatusBadgeVariant = (status: string): StatusBadgeVariant => {
  switch (status) {
    case 'approved':
      return 'default'; // Green
    case 'pending':
      return 'secondary'; // Yellow
    case 'rejected':
      return 'destructive'; // Red
    case 'draft':
      return 'outline'; // Gray
    default:
      return 'secondary';
  }
};

interface ProductStatusBadgeProps {
  status: string;
  rejectionFeedback?: string | null;
}

const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({ status, rejectionFeedback }) => {
  const displayStatus = status 
    ? (status.charAt(0).toUpperCase() + status.slice(1)) 
    : 'Pending';
  
  // Apply custom styles based on status
  const getCustomStyles = () => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return '';
    }
  };

  // Show tooltip only for rejected status with feedback
  if (status === 'rejected' && rejectionFeedback) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge 
              variant={getStatusBadgeVariant(status)} 
              className={getCustomStyles()}
            >
              {displayStatus}
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>{rejectionFeedback}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
    
  return (
    <Badge 
      variant={getStatusBadgeVariant(status || 'pending')} 
      className={getCustomStyles()}
    >
      {displayStatus}
    </Badge>
  );
};

export default ProductStatusBadge;
