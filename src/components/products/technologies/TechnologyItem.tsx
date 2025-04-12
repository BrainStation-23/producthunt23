
import React from 'react';
import { Check } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { DeviconItem } from '@/services/deviconService';
import { getDeviconClass } from '@/services/deviconService';

interface TechnologyItemProps {
  tech: DeviconItem;
  isSelected: boolean;
  onToggle: (techId: string) => void;
}

const TechnologyItem: React.FC<TechnologyItemProps> = ({ tech, isSelected, onToggle }) => {
  const versions = tech.versions.font || ['plain'];
  const preferredVersion = versions.includes('original') ? 'original' : versions[0];
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`
              flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors
              ${isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted border border-transparent'}
            `}
            onClick={() => onToggle(tech.name)}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <i className={getDeviconClass(tech.name, preferredVersion)} style={{ fontSize: '1.75rem' }}></i>
              </div>
              <div>
                <div className="font-medium">{tech.name}</div>
                {tech.tags.length > 0 && (
                  <div className="text-xs text-muted-foreground">{tech.tags.join(', ')}</div>
                )}
              </div>
            </div>
            {isSelected && (
              <Check className="h-5 w-5 text-primary" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" align="center" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{tech.name}</p>
            {tech.aliases.length > 0 && (
              <p className="text-xs">Also known as: {tech.aliases.join(', ')}</p>
            )}
            {tech.versions.font.length > 1 && (
              <p className="text-xs">Available styles: {tech.versions.font.join(', ')}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TechnologyItem;
