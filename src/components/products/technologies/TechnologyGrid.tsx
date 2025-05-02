
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import TechnologyItem from './TechnologyItem';
import { DeviconItem } from '@/services/deviconService';

interface TechnologyGridProps {
  technologies: DeviconItem[];
  selectedTechnologies: string[];
  searchTerm: string;
  toggleTechnology: (techId: string) => void;
}

const TechnologyGrid: React.FC<TechnologyGridProps> = ({ 
  technologies, 
  selectedTechnologies, 
  searchTerm,
  toggleTechnology 
}) => {
  return (
    <ScrollArea className="h-[400px] w-full pr-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-2 pr-2">
        {technologies.map(tech => (
          <TechnologyItem
            key={tech.name}
            tech={tech}
            isSelected={selectedTechnologies.includes(tech.name)}
            onToggle={toggleTechnology}
          />
        ))}
      </div>
      
      {technologies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Search className="h-12 w-12 mb-4 opacity-20" />
          <p className="text-lg">No technologies found matching "{searchTerm}"</p>
          <p className="text-sm">Try a different search term or category</p>
        </div>
      )}
    </ScrollArea>
  );
};

export default TechnologyGrid;
