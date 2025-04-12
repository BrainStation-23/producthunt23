
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
      <div className="flex flex-wrap gap-2">
        {selected.length === 0 ? (
          <p className="text-muted-foreground">No technologies selected</p>
        ) : (
          selected.map(techId => {
            const tech = deviconData?.find(t => t.name === techId);
            return (
              <Badge key={techId} variant="secondary" className="flex items-center gap-2 pl-2 pr-1 py-1">
                <i className={getDeviconClass(techId)} style={{ fontSize: '1.25rem' }}></i>
                {tech ? tech.name : techId}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 rounded-full" 
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
          <Button variant="outline" type="button" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Select Technologies
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Technologies</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search technologies..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
                  <TabsList className="w-full overflow-x-auto flex flex-nowrap">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="popular">Popular</TabsTrigger>
                    {techCategories.map(category => (
                      <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                
                {selected.length > 0 && relatedTechSuggestions.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Suggested technologies:</h3>
                    <div className="flex flex-wrap gap-2">
                      {relatedTechSuggestions.map(tech => (
                        <Badge 
                          key={tech} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-secondary flex items-center gap-1.5"
                          onClick={() => toggleTechnology(tech)}
                        >
                          <i className={getDeviconClass(tech)} style={{ fontSize: '1rem' }}></i>
                          {tech}
                          <Plus className="h-3 w-3 text-muted-foreground" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
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
                                  flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors
                                  ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'}
                                `}
                                onClick={() => toggleTechnology(tech.name)}
                              >
                                <div className="flex items-center gap-3">
                                  <i className={getDeviconClass(tech.name, preferredVersion)} style={{ fontSize: '1.5rem' }}></i>
                                  <div>
                                    <div className="font-medium">{tech.name}</div>
                                    {tech.tags.length > 0 && (
                                      <div className="text-xs text-muted-foreground">{tech.tags.join(', ')}</div>
                                    )}
                                  </div>
                                </div>
                                {isSelected && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
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
                </ScrollArea>
              </>
            )}
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
