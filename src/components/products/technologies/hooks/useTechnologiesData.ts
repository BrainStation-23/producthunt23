
import { useMemo } from 'react';
import { DeviconItem } from '@/services/deviconService';
import { useDeviconData, getRelatedTechnologies } from '@/services/deviconService';

export const useTechnologiesData = (selected: string[], activeTab: string, searchTerm: string) => {
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
      result.all.push(tech);
      if (popularTechs.includes(tech.name)) {
        result.popular.push(tech);
      }
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
  
  // Get related technologies
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

  return {
    deviconData,
    isLoading,
    filteredTechnologies,
    relatedTechSuggestions,
  };
};
