
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PriorityBadgeProps {
  priority: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case 'low':
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Low Priority</Badge>;
    case 'medium':
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Medium Priority</Badge>;
    case 'high':
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Priority</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export default PriorityBadge;
