
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { getDeviconClass } from '@/services/deviconService';

interface TechnologyBadgeProps {
  techId: string;
  name?: string;
  onRemove?: (techId: string) => void;
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  showRemoveButton?: boolean;
}

const TechnologyBadge: React.FC<TechnologyBadgeProps> = ({ 
  techId, 
  name, 
  onRemove, 
  className = "", 
  variant = "secondary",
  showRemoveButton = true
}) => {
  return (
    <Badge 
      variant={variant} 
      className={`flex items-center gap-2 pl-2 ${showRemoveButton ? 'pr-1' : 'pr-2'} py-1.5 ${className}`}
    >
      <i className={getDeviconClass(techId)} style={{ fontSize: '1.25rem' }}></i>
      {name || techId}
      {showRemoveButton && onRemove && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5 rounded-full hover:bg-muted" 
          onClick={() => onRemove(techId)}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </Badge>
  );
};

export default TechnologyBadge;
