
import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X, Code, Search, Loader2 } from 'lucide-react';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  useDeviconData, 
  getDeviconClass, 
  techCategories, 
  categorizeTechnology,
  getRelatedTechnologies,
  DeviconItem
} from '@/services/deviconService';

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
    
    const result: Record<string, DeviconItem[]> = {
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
      tech.aliases.some(alias => alias.toLowerCase().includes(searchLower)) ||
      tech.tags.some(tag => tag.toLowerCase().includes(searchLower))
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
          selected.map(techId => {
            const tech = deviconData?.find(t => t.name === techId);
            return (
              <Badge key={techId} variant="secondary" className="flex items-center gap-2 pl-2 pr-1 py-1.5">
                <i className={getDeviconClass(techId)} style={{ fontSize: '1.25rem' }}></i>
                {tech ? tech.name : techId}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 rounded-full hover:bg-muted" 
                  onClick={() => removeTechnology(techId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" type="button" className="flex w-full items-center gap-2 p-6 justify-center text-base">
            <Code className="h-5 w-5" />
            Select Technologies
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">Select Technologies</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search technologies..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-6 text-lg"
              />
            </div>
            
            {selected.length > 0 && (
              <div className="mb-6 bg-secondary/50 p-4 rounded-lg">
                <h3 className="text-base font-medium mb-2">Selected technologies:</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.map(techId => {
                    const tech = deviconData?.find(t => t.name === techId);
                    return (
                      <Badge 
                        key={techId} 
                        variant="secondary" 
                        className="flex items-center gap-2 pl-2 pr-1 py-1.5 bg-background"
                      >
                        <i className={getDeviconClass(techId)} style={{ fontSize: '1.25rem' }}></i>
                        {tech ? tech.name : techId}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 rounded-full hover:bg-muted" 
                          onClick={() => removeTechnology(techId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            
            {isLoading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
                  <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start">
                    <TabsTrigger value="all" className="px-4">All</TabsTrigger>
                    <TabsTrigger value="popular" className="px-4">Popular</TabsTrigger>
                    {techCategories.map(category => (
                      <TabsTrigger key={category.id} value={category.id} className="px-4">{category.name}</TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                
                {selected.length > 0 && relatedTechSuggestions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-base font-medium mb-2">Recommended technologies:</h3>
                    <div className="flex flex-wrap gap-2">
                      {relatedTechSuggestions.map(tech => (
                        <Badge 
                          key={tech} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-secondary flex items-center gap-1.5 py-1.5 px-3"
                          onClick={() => toggleTechnology(tech)}
                        >
                          <i className={getDeviconClass(tech)} style={{ fontSize: '1.25rem' }}></i>
                          {tech}
                          <Plus className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {filteredTechnologies.map(tech => {
                      const isSelected = selected.includes(tech.name);
                      const versions = tech.versions.font || ['plain'];
                      const preferredVersion = versions.includes('original') ? 'original' : versions[0];
                      
                      return (
                        <TooltipProvider key={tech.name}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div 
                                className={`
                                  flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors
                                  ${isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted border border-transparent'}
                                `}
                                onClick={() => toggleTechnology(tech.name)}
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
                    })}
                  </div>
                  
                  {filteredTechnologies.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Search className="h-12 w-12 mb-4 opacity-20" />
                      <p className="text-lg">No technologies found matching "{searchTerm}"</p>
                      <p className="text-sm">Try a different search term or category</p>
                    </div>
                  )}
                </ScrollArea>
              </>
            )}
          </div>
          
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsDialogOpen(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// This is needed for the relatedTechSuggestions
const Plus = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default TechnologiesSelector;
