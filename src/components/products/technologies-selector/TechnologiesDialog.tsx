
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Code } from 'lucide-react';
import TechnologiesDialogContent from './TechnologiesDialogContent';
import { useDeviconData, getRelatedTechnologies, categorizeTechnology } from '@/services/deviconService';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { data: deviconData, isLoading } = useDeviconData();

  // Get related technologies for the currently selected technologies
  const relatedTechSuggestions = useMemo(() => {
    if (!deviconData || selectedTechnologies.length === 0) return [];
    
    const suggestions = new Set<string>();
    
    selectedTechnologies.forEach(tech => {
      getRelatedTechnologies(tech, deviconData).forEach(related => {
        if (!selectedTechnologies.includes(related)) {
          suggestions.add(related);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [deviconData, selectedTechnologies]);

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

  // Filter technologies based on search term and active tab
  const filteredTechnologies = useMemo(() => {
    if (!deviconData || !categorizedTechs[activeTab]) return [];
    
    if (!searchTerm) {
      return categorizedTechs[activeTab];
    }
    
    const searchLower = searchTerm.toLowerCase();
    return categorizedTechs[activeTab].filter(tech => 
      tech.name.toLowerCase().includes(searchLower) || 
      tech.aliases && Array.isArray(tech.aliases) && tech.aliases.some(alias => 
        typeof alias === 'string' && alias.toLowerCase().includes(searchLower)
      ) || 
      tech.tags && Array.isArray(tech.tags) && tech.tags.some(tag => 
        typeof tag === 'string' && tag.toLowerCase().includes(searchLower)
      )
    );
  }, [deviconData, searchTerm, activeTab, categorizedTechs]);

  const toggleTechnology = (techId: string) => {
    let updatedTechnologies: string[];
    if (selectedTechnologies.includes(techId)) {
      updatedTechnologies = selectedTechnologies.filter(id => id !== techId);
    } else {
      updatedTechnologies = [...selectedTechnologies, techId];
    }
    
    // If single selection mode is enabled, only keep one technology
    const finalTechnologies = singleSelection && updatedTechnologies.length > 1
      ? [updatedTechnologies[updatedTechnologies.length - 1]]
      : updatedTechnologies;
      
    onSelectionChange(finalTechnologies);
  };

  const removeTechnology = (techId: string) => {
    onSelectionChange(selectedTechnologies.filter(id => id !== techId));
  };

  const clearAllTechnologies = () => {
    onSelectionChange([]);
  };

  // Reset search when dialog is closed
  useEffect(() => {
    if (!isDialogOpen) {
      setSearchTerm('');
      setActiveTab('all');
    }
  }, [isDialogOpen]);

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
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredTechnologies={filteredTechnologies}
          selected={selectedTechnologies}
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
  );
};

export default TechnologiesDialog;
