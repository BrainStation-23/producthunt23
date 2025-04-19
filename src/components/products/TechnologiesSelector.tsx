
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Code } from 'lucide-react';
import TechnologyBadge from './technologies/TechnologyBadge';
import TechnologiesDialog from './technologies/TechnologiesDialog';

interface TechnologiesSelectorProps {
  selected: string[];
  onSelect: (technologies: string[]) => void;
}

const TechnologiesSelector: React.FC<TechnologiesSelectorProps> = ({ selected, onSelect }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleTechnology = (techId: string) => {
    if (selected.includes(techId)) {
      onSelect(selected.filter(id => id !== techId));
    } else {
      onSelect([...selected, techId]);
    }
  };

  const removeTechnology = (techId: string) => {
    onSelect(selected.filter(id => id !== techId));
  };
  
  // Reset dialog state when closed
  useEffect(() => {
    if (!isDialogOpen) {
      // Dialog closed, no need to reset anything else
    }
  }, [isDialogOpen]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {selected.length === 0 ? (
          <p className="text-muted-foreground">No technologies selected</p>
        ) : (
          selected.map(techId => (
            <TechnologyBadge 
              key={techId} 
              techId={techId} 
              onRemove={removeTechnology} 
            />
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" type="button" className="flex w-full items-center gap-2 p-6 justify-center text-base">
            <Code className="h-5 w-5" />
            Select Technologies
          </Button>
        </DialogTrigger>
        
        <TechnologiesDialog
          selected={selected}
          onSelect={toggleTechnology}
          onRemove={removeTechnology}
          onClose={() => setIsDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default TechnologiesSelector;
