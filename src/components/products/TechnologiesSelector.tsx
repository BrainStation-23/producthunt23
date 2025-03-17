
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X, Code, Search } from 'lucide-react';
import { getDevIconClass } from '@/utils/devIconUtils';

// List of popular technologies
const popularTechnologies = [
  { id: 'react', name: 'React' },
  { id: 'angular', name: 'Angular' },
  { id: 'vue', name: 'Vue.js' },
  { id: 'nextjs', name: 'Next.js' },
  { id: 'nodejs', name: 'Node.js' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'django', name: 'Django' },
  { id: 'flask', name: 'Flask' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'rails', name: 'Rails' },
  { id: 'php', name: 'PHP' },
  { id: 'laravel', name: 'Laravel' },
  { id: 'csharp', name: 'C#' },
  { id: 'dotnetcore', name: '.NET Core' },
  { id: 'java', name: 'Java' },
  { id: 'spring', name: 'Spring' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'mongodb', name: 'MongoDB' },
  { id: 'mysql', name: 'MySQL' },
  { id: 'postgresql', name: 'PostgreSQL' },
  { id: 'redis', name: 'Redis' },
  { id: 'docker', name: 'Docker' },
  { id: 'kubernetes', name: 'Kubernetes' },
  { id: 'aws', name: 'AWS' },
  { id: 'azure', name: 'Azure' },
  { id: 'gcp', name: 'Google Cloud' },
  { id: 'firebase', name: 'Firebase' },
  { id: 'tailwindcss', name: 'Tailwind CSS' },
  { id: 'bootstrap', name: 'Bootstrap' },
  { id: 'sass', name: 'Sass' },
  { id: 'supabase', name: 'Supabase' },
  { id: 'graphql', name: 'GraphQL' },
];

interface TechnologiesSelectorProps {
  selected: string[];
  onSelect: (technologies: string[]) => void;
}

const TechnologiesSelector: React.FC<TechnologiesSelectorProps> = ({ selected, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredTechnologies = popularTechnologies.filter(tech => 
    tech.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selected.length === 0 ? (
          <p className="text-muted-foreground">No technologies selected</p>
        ) : (
          selected.map(techId => {
            const tech = popularTechnologies.find(t => t.id === techId);
            return (
              <Badge key={techId} variant="secondary" className="flex items-center gap-2 pl-2 pr-1 py-1">
                {tech && <i className={`${getDevIconClass(tech.name)} text-lg`}></i>}
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
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {filteredTechnologies.map(tech => (
                  <div 
                    key={tech.id} 
                    className={`
                      flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors
                      ${selected.includes(tech.id) ? 'bg-primary/10' : 'hover:bg-muted'}
                    `}
                    onClick={() => toggleTechnology(tech.id)}
                  >
                    <div className="flex items-center gap-3">
                      <i className={`${getDevIconClass(tech.name)} text-xl`}></i>
                      <span>{tech.name}</span>
                    </div>
                    {selected.includes(tech.id) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechnologiesSelector;
