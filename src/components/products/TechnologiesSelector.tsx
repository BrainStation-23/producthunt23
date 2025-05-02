
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Code, Search, Loader2, X } from 'lucide-react';
import { useDeviconData, getRelatedTechnologies, techCategories, categorizeTechnology } from '@/services/deviconService';
import TechnologyGrid from './technologies/TechnologyGrid';
import TechnologyTabs from './technologies/TechnologyTabs';
import SelectedTechnologies from './technologies/SelectedTechnologies';
import RecommendedTechnologies from './technologies/RecommendedTechnologies';
import TechnologyBadge from './technologies/TechnologyBadge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

interface TechnologiesSelectorProps {
  selected: string[];
  onSelect: (technologies: string[]) => void;
}

const TechnologiesSelector: React.FC<TechnologiesSelectorProps> = ({ selected, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { data: deviconData, isLoading } = useDeviconData();
  const isMobile = useIsMobile();
  
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
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl">Select Technologies</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col p-0">
            {/* Two-column layout container */}
            <div className={`flex flex-col ${!isMobile ? 'md:flex-row' : ''} h-full`}>
              {/* Left column: Selection area */}
              <div className={`flex-1 flex flex-col p-6 ${!isMobile ? 'md:border-r md:max-w-[65%]' : ''} overflow-hidden`}>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search technologies..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 py-2 text-base w-full"
                  />
                </div>
                
                {/* Recommended technologies section */}
                <RecommendedTechnologies 
                  suggestions={relatedTechSuggestions} 
                  onSelect={toggleTechnology} 
                />
                
                {/* Technology categories tabs */}
                <div className="w-full overflow-x-auto mt-2">
                  <TechnologyTabs 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                  />
                </div>
                
                {/* Loading spinner or technology grid */}
                <div className="flex-1 overflow-hidden">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <TechnologyGrid 
                      technologies={filteredTechnologies} 
                      selectedTechnologies={selected} 
                      searchTerm={searchTerm}
                      toggleTechnology={toggleTechnology} 
                    />
                  )}
                </div>
              </div>

              {/* Right column: Selected technologies */}
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
                
                <ScrollArea className="flex-1 pr-4">
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
            </div>
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
