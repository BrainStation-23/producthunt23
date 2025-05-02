
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Code } from 'lucide-react';
import { useDeviconData, getRelatedTechnologies } from '@/services/deviconService';
import TechnologyBadge from '../technologies/TechnologyBadge';
import TechnologiesDialogContent from './TechnologiesDialogContent';

interface TechnologiesSelectorProps {
  selected: string[];
  onSelect: (technologies: string[]) => void;
}

const TechnologiesSelector: React.FC<TechnologiesSelectorProps> = ({ selected, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { data: deviconData, isLoading } = useDeviconData();
  
  // Organize technologies by category
  const categorizedTechs = useMemo(() => {
    if (!deviconData) return {};
    
    const result: Record<string, any[]> = {
      all: [],
      popular: [],
      frontend: [],
      backend: [],
      database: [],
      devops: [],
      languages: [],
      mobile: [],
      tools: [],
    };
    
    // Popular technologies (hardcoded for now)
    const popularTechs = [
      'react', 'typescript', 'javascript', 'python', 'nodejs', 
      'vue', 'angular', 'nextjs', 'mongodb', 'mysql', 
      'postgresql', 'php', 'java', 'csharp', 'dotnetcore', 
      'aws', 'docker', 'kubernetes', 'firebase', 'tailwindcss'
    ];
    
    deviconData.forEach(tech => {
      // Add to all
      result.all.push(tech);
      
      // Add to popular if it's in the popular list
      if (popularTechs.includes(tech.name)) {
        result.popular.push(tech);
      }
      
      // Add to category
      const category = categorizeTechnology(tech);
      if (result[category]) {
        result[category].push(tech);
      }
    });
    
    return result;
  }, [deviconData]);
  
  // Filter technologies based on search term
  const filteredTechnologies = useMemo(() => {
    if (!deviconData || !categorizedTechs[activeTab]) return [];
    
    if (!searchTerm) {
      return categorizedTechs[activeTab];
    }
    
    const searchLower = searchTerm.toLowerCase();
    return deviconData.filter(tech => 
      tech.name.toLowerCase().includes(searchLower) || 
      tech.aliases && Array.isArray(tech.aliases) && tech.aliases.some(alias => 
        typeof alias === 'string' && alias.toLowerCase().includes(searchLower)
      ) || 
      tech.tags && Array.isArray(tech.tags) && tech.tags.some(tag => 
        typeof tag === 'string' && tag.toLowerCase().includes(searchLower)
      )
    );
  }, [deviconData, searchTerm, activeTab, categorizedTechs]);
  
  // Get related technologies for the currently selected technologies
  const relatedTechSuggestions = useMemo(() => {
    if (!deviconData || selected.length === 0) return [];
    
    const suggestions = new Set<string>();
    
    selected.forEach(tech => {
      getRelatedTechnologies(tech, deviconData).forEach(related => {
        if (!selected.includes(related)) {
          suggestions.add(related);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [deviconData, selected]);

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

  const clearAllTechnologies = () => {
    onSelect([]);
  };
  
  // Reset search when dialog is closed
  useEffect(() => {
    if (!isDialogOpen) {
      setSearchTerm('');
      setActiveTab('all');
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
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <TechnologiesDialogContent 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filteredTechnologies={filteredTechnologies}
            selected={selected}
            relatedTechSuggestions={relatedTechSuggestions}
            toggleTechnology={toggleTechnology}
            removeTechnology={removeTechnology}
            clearAllTechnologies={clearAllTechnologies}
            isLoading={isLoading}
            deviconData={deviconData}
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Import from deviconService to make the function available
import { categorizeTechnology } from '@/services/deviconService';

export default TechnologiesSelector;
