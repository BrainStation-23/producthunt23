import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Code, Search, Loader2 } from 'lucide-react';
import { useDeviconData, getRelatedTechnologies, techCategories, categorizeTechnology } from '@/services/deviconService';
import TechnologyGrid from './technologies/TechnologyGrid';
import TechnologyTabs from './technologies/TechnologyTabs';
import SelectedTechnologies from './technologies/SelectedTechnologies';
import RecommendedTechnologies from './technologies/RecommendedTechnologies';
import TechnologyBadge from './technologies/TechnologyBadge';

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
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl">Select Technologies</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col p-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search technologies..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-2 text-base w-full"
              />
            </div>
            
            <SelectedTechnologies 
              selected={selected} 
              onRemove={removeTechnology} 
              deviconData={deviconData} 
            />
            
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex-1 overflow-hidden flex flex-col">
                <RecommendedTechnologies 
                  suggestions={relatedTechSuggestions} 
                  onSelect={toggleTechnology} 
                />
                
                <div className="w-full overflow-x-auto">
                  <TechnologyTabs 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                  />
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <TechnologyGrid 
                    technologies={filteredTechnologies} 
                    selectedTechnologies={selected} 
                    searchTerm={searchTerm}
                    toggleTechnology={toggleTechnology} 
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="px-6 py-4 border-t">
            <Button onClick={() => setIsDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechnologiesSelector;
