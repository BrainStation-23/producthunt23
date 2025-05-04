import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Code } from 'lucide-react';
import TechnologiesDialogContent from './TechnologiesDialogContent';

interface TechnologiesDialogProps {
  selectedTechnologies: string[];
  onSelectionChange: (technologies: string[]) => void;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonClassName?: string;
  placeholder?: string;
  singleSelection?: boolean;
}

const TechnologiesDialog: React.FC<TechnologiesDialogProps> = ({
  selectedTechnologies,
  onSelectionChange,
  buttonVariant = "outline",
  buttonClassName = "",
  placeholder = "Select technologies",
  singleSelection = false
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTechnologiesChange = (technologies: string[]) => {
    // If single selection mode is enabled, only keep one technology
    const finalTechnologies = singleSelection && technologies.length > 1
      ? [technologies[technologies.length - 1]]
      : technologies;
      
    onSelectionChange(finalTechnologies);
  };

  // Get the display text for the button
  const getDisplayText = () => {
    if (selectedTechnologies.length === 0) {
      return placeholder;
    }
    
    if (singleSelection) {
      return selectedTechnologies[0];
    }
    
    return `${selectedTechnologies.length} selected`;
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          className={`flex items-center justify-between text-left h-10 ${buttonClassName}`}
        >
          <div className="flex items-center gap-2 truncate">
            <Code className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{getDisplayText()}</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <TechnologiesDialogContent
          selectedTechnologies={selectedTechnologies}
          onSelectionChange={handleTechnologiesChange}
          singleSelection={singleSelection}
          onClose={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TechnologiesDialog;
