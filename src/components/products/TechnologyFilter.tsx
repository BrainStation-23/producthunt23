
import React, { useState, useEffect, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Code } from 'lucide-react';
import { useDeviconData } from '@/services/deviconService';

interface TechnologyFilterProps {
  selectedTechnology: string;
  onTechnologyChange: (technology: string) => void;
}

const TechnologyFilter: React.FC<TechnologyFilterProps> = ({ 
  selectedTechnology, 
  onTechnologyChange 
}) => {
  const { data: deviconData, isLoading } = useDeviconData();
  
  // Get popular technologies (hardcoded for now, could be dynamically populated in the future)
  const popularTechs = useMemo(() => [
    'react', 'typescript', 'javascript', 'python', 'nodejs', 
    'vue', 'angular', 'nextjs', 'mongodb', 'mysql', 
    'postgresql', 'php', 'java', 'csharp', 'dotnetcore', 
    'aws', 'docker', 'kubernetes', 'firebase', 'tailwindcss'
  ], []);
  
  // Filter to popular techs and sort alphabetically
  const technologiesOptions = useMemo(() => {
    if (!deviconData) return [];
    
    return deviconData
      .filter(tech => popularTechs.includes(tech.name))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [deviconData, popularTechs]);
  
  return (
    <Select value={selectedTechnology} onValueChange={onTechnologyChange} disabled={isLoading}>
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          <SelectValue placeholder={isLoading ? "Loading technologies..." : "All technologies"} />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All technologies</SelectItem>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Loading technologies...</span>
          </div>
        ) : (
          technologiesOptions.map((tech) => (
            <SelectItem key={tech.name} value={tech.name}>
              {tech.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default TechnologyFilter;
