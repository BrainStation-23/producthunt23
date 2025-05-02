
import React from 'react';
import TechnologyBadge from './TechnologyBadge';
import { DeviconItem } from '@/services/deviconService';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SelectedTechnologiesProps {
  selected: string[];
  onRemove: (techId: string) => void;
  deviconData: DeviconItem[] | undefined;
  className?: string;
}

const SelectedTechnologies: React.FC<SelectedTechnologiesProps> = ({ 
  selected, 
  onRemove,
  deviconData,
  className = ""
}) => {
  if (selected.length === 0) return null;
  
  return (
    <div className={`mb-6 bg-secondary/50 p-4 rounded-lg ${className}`}>
      <h3 className="text-base font-medium mb-2">Selected technologies:</h3>
      <ScrollArea className="max-h-[120px]">
        <div className="flex flex-wrap gap-2">
          {selected.map(techId => {
            const tech = deviconData?.find(t => t.name === techId);
            return (
              <TechnologyBadge
                key={techId}
                techId={techId}
                name={tech?.name}
                onRemove={onRemove}
                variant="secondary"
                className="bg-background"
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SelectedTechnologies;
