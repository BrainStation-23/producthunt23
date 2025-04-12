
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getDeviconClass } from '@/services/deviconService';

interface RecommendedTechnologiesProps {
  suggestions: string[];
  onSelect: (techId: string) => void;
}

// This is needed for the Plus icon
const Plus = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const RecommendedTechnologies: React.FC<RecommendedTechnologiesProps> = ({ suggestions, onSelect }) => {
  if (suggestions.length === 0) return null;
  
  return (
    <div className="mb-6">
      <h3 className="text-base font-medium mb-2">Recommended technologies:</h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map(tech => (
          <Badge 
            key={tech} 
            variant="outline" 
            className="cursor-pointer hover:bg-secondary flex items-center gap-1.5 py-1.5 px-3"
            onClick={() => onSelect(tech)}
          >
            <i className={getDeviconClass(tech)} style={{ fontSize: '1.25rem' }}></i>
            {tech}
            <Plus className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default RecommendedTechnologies;
