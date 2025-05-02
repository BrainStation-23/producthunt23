
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Code, X } from 'lucide-react';
import { DeviconItem, getDeviconClass } from '@/services/deviconService';
import { useIsMobile } from '@/hooks/use-mobile';

interface SelectedTechnologiesPanelProps {
  selected: string[];
  deviconData: DeviconItem[] | undefined;
  removeTechnology: (techId: string) => void;
  clearAllTechnologies: () => void;
}

const SelectedTechnologiesPanel: React.FC<SelectedTechnologiesPanelProps> = ({
  selected,
  deviconData,
  removeTechnology,
  clearAllTechnologies
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`${!isMobile ? 'md:w-[35%]' : ''} flex flex-col p-6 overflow-hidden`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-lg">Selected Technologies</h3>
        {selected.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllTechnologies}
            className="h-8 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1 pr-4 max-h-[500px]">
        {selected.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="bg-muted/50 rounded-full p-3 mb-3">
              <Code className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              No technologies selected yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Select technologies from the list on the left
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {selected.map(techId => {
              const tech = deviconData?.find(t => t.name === techId);
              return (
                <div 
                  key={techId}
                  className="flex items-center justify-between p-2 rounded-md border border-muted bg-background/80"
                >
                  <div className="flex items-center gap-2">
                    <i className={getDeviconClass(techId)} style={{ fontSize: '1.25rem' }}></i>
                    <span>{tech?.name || techId}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full hover:bg-muted" 
                    onClick={() => removeTechnology(techId)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>{selected.length} {selected.length === 1 ? 'technology' : 'technologies'} selected</p>
      </div>
    </div>
  );
};

export default SelectedTechnologiesPanel;
