
import React from 'react';
import TechnologyBadge from './TechnologyBadge';
import { DeviconItem } from '@/services/deviconService';

interface SelectedTechnologiesProps {
  selected: string[];
  onRemove: (techId: string) => void;
  deviconData: DeviconItem[] | undefined;
}

const SelectedTechnologies: React.FC<SelectedTechnologiesProps> = ({ 
  selected, 
  onRemove,
  deviconData
}) => {
  if (selected.length === 0) return null;
  
  return (
    <div className="mb-6 bg-secondary/50 p-4 rounded-lg">
      <h3 className="text-base font-medium mb-2">Selected technologies:</h3>
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
    </div>
  );
};

export default SelectedTechnologies;
