
import { useQuery } from '@tanstack/react-query';

export interface DeviconItem {
  name: string;
  aliases: string[];
  tags: string[];
  versions: {
    svg: string[];
    font: string[];
  };
}

// Cache the full devicon data
let cachedDeviconData: DeviconItem[] | null = null;

/**
 * Fetches the devicon metadata from the GitHub repository
 */
export const fetchDeviconData = async (): Promise<DeviconItem[]> => {
  if (cachedDeviconData) {
    return cachedDeviconData;
  }

  try {
    const response = await fetch('https://raw.githubusercontent.com/devicons/devicon/master/devicon.json');
    if (!response.ok) {
      throw new Error('Failed to fetch devicon data');
    }
    
    const data = await response.json();
    
    // Ensure aliases and tags are always string arrays
    const validatedData: DeviconItem[] = data.map((item: any) => ({
      name: item.name || '',
      aliases: Array.isArray(item.aliases) 
        ? item.aliases.filter((alias: any) => typeof alias === 'string')
        : [],
      tags: Array.isArray(item.tags) 
        ? item.tags.filter((tag: any) => typeof tag === 'string')
        : [],
      versions: {
        svg: Array.isArray(item.versions?.svg) ? item.versions.svg : [],
        font: Array.isArray(item.versions?.font) ? item.versions.font : []
      }
    }));
    
    cachedDeviconData = validatedData;
    return validatedData;
  } catch (error) {
    console.error('Error fetching devicon data:', error);
    return [];
  }
};

/**
 * Gets the CSS class for a technology icon
 * @param techName The technology name
 * @param variant The variant ('plain', 'original', etc.)
 * @param colored Whether to use the colored version
 * @returns The CSS class for the technology icon
 */
export const getDeviconClass = (
  techName: string, 
  variant: string = 'plain', 
  colored: boolean = true
): string => {
  const techLower = techName.toLowerCase();
  const coloredClass = colored ? 'colored' : '';
  
  return `devicon-${techLower}-${variant}${colored ? ' ' + coloredClass : ''}`;
};

/**
 * React Query hook to fetch devicon data
 */
export const useDeviconData = () => {
  return useQuery({
    queryKey: ['deviconData'],
    queryFn: fetchDeviconData,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
  });
};

/**
 * Categories of technologies for better organization
 */
export const techCategories = [
  { id: 'frontend', name: 'Frontend', tags: ['javascript', 'css', 'html', 'frontend', 'ui', 'framework'] },
  { id: 'backend', name: 'Backend', tags: ['backend', 'server', 'api'] },
  { id: 'database', name: 'Database', tags: ['database', 'sql', 'nosql', 'storage'] },
  { id: 'mobile', name: 'Mobile', tags: ['mobile', 'android', 'ios'] },
  { id: 'devops', name: 'DevOps', tags: ['devops', 'cloud', 'deployment', 'container'] },
  { id: 'languages', name: 'Languages', tags: ['language', 'programming'] },
  { id: 'tools', name: 'Tools', tags: ['tool', 'utility', 'editor', 'ide'] },
];

/**
 * Categorizes a technology based on its name and tags
 */
export const categorizeTechnology = (tech: DeviconItem): string => {
  // Check if any of the tech's tags match category tags
  for (const category of techCategories) {
    // Check if any tech tags match the category tags
    if (tech.tags.some(tag => category.tags.includes(tag))) {
      return category.id;
    }
    
    // Check if the tech name matches any category tags
    if (category.tags.includes(tech.name)) {
      return category.id;
    }
  }
  
  // Special cases based on common technologies
  if (['react', 'vue', 'angular', 'svelte', 'next', 'nuxt', 'tailwind', 'bootstrap'].includes(tech.name)) {
    return 'frontend';
  }
  
  if (['nodejs', 'express', 'django', 'flask', 'spring', 'laravel', 'rails'].includes(tech.name)) {
    return 'backend';
  }
  
  if (['mongodb', 'mysql', 'postgresql', 'firebase', 'supabase', 'redis'].includes(tech.name)) {
    return 'database';
  }
  
  if (['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins'].includes(tech.name)) {
    return 'devops';
  }
  
  if (['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby'].includes(tech.name)) {
    return 'languages';
  }
  
  // Default category
  return 'tools';
};

/**
 * Gets suggested related technologies based on a technology name
 */
export const getRelatedTechnologies = (techName: string, allTechs: DeviconItem[]): string[] => {
  const techLower = techName.toLowerCase();
  
  // Common technology relationships
  const relationships: Record<string, string[]> = {
    'react': ['javascript', 'typescript', 'redux', 'next', 'tailwind'],
    'vue': ['javascript', 'typescript', 'nuxt', 'vuetify'],
    'angular': ['typescript', 'rxjs', 'ngrx'],
    'nodejs': ['javascript', 'express', 'mongodb', 'typescript'],
    'python': ['django', 'flask', 'fastapi', 'pandas'],
    'java': ['spring', 'hibernate', 'maven'],
    'csharp': ['dotnetcore', 'azure', 'visualstudio'],
    'mongodb': ['nodejs', 'mongoose', 'express'],
    'mysql': ['php', 'laravel', 'mariadb'],
    'postgresql': ['ruby', 'rails', 'nodejs'],
    'aws': ['lambda', 's3', 'cloudfront', 'dynamodb'],
    'docker': ['kubernetes', 'nginx', 'jenkins'],
  };
  
  // If we have predefined relationships, use those
  if (relationships[techLower]) {
    // Filter to make sure we only return technologies that exist in our dataset
    return relationships[techLower].filter(tech => 
      allTechs.some(t => 
        t.name === tech || 
        (Array.isArray(t.aliases) && t.aliases.some(a => typeof a === 'string' && a === tech)) || 
        (Array.isArray(t.tags) && t.tags.some(tag => typeof tag === 'string' && tag === tech))
      )
    );
  }
  
  // Otherwise, find technologies with similar tags
  const tech = allTechs.find(t => 
    t.name === techLower || 
    (Array.isArray(t.aliases) && t.aliases.some(a => typeof a === 'string' && a === techLower)) || 
    (Array.isArray(t.tags) && t.tags.some(tag => typeof tag === 'string' && tag === techLower))
  );
  
  if (tech) {
    // Find techs with similar tags
    return allTechs
      .filter(t => 
        t.name !== tech.name && // Don't include the original tech
        (
          // Safely check for shared tags
          Array.isArray(t.tags) && Array.isArray(tech.tags) &&
          (
            t.tags.some(tag => typeof tag === 'string' && tech.tags.includes(tag)) ||
            tech.tags.some(tag => typeof tag === 'string' && t.tags.includes(tag))
          )
        )
      )
      .slice(0, 5) // Limit to 5 related technologies
      .map(t => t.name);
  }
  
  return [];
};
