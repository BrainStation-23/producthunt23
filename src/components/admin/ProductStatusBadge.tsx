
import React from 'react';
import { Badge } from '@/components/ui/badge';

type StatusBadgeVariant = "default" | "destructive" | "outline" | "secondary";

export const getStatusBadgeVariant = (status: string): StatusBadgeVariant => {
  switch (status) {
    case 'approved':
      return 'default'; // Using 'default' instead of 'success'
    case 'pending':
      return 'secondary'; // Using 'secondary' instead of 'warning'
    case 'rejected':
      return 'destructive';
    case 'draft':
      return 'outline';
    default:
      return 'secondary';
  }
};

interface ProductStatusBadgeProps {
  status: string;
}

const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({ status }) => {
  const displayStatus = status 
    ? (status.charAt(0).toUpperCase() + status.slice(1)) 
    : 'Pending';
    
  return (
    <Badge variant={getStatusBadgeVariant(status || 'pending')}>
      {displayStatus}
    </Badge>
  );
};

export default ProductStatusBadge;
