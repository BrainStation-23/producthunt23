
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X } from 'lucide-react';

// List of popular technologies with their devicon identifiers
const popularTechnologies = [
  { id: 'react', name: 'React', icon: 'devicon-react-original' },
  { id: 'angular', name: 'Angular', icon: 'devicon-angularjs-plain' },
  { id: 'vue', name: 'Vue.js', icon: 'devicon-vuejs-plain' },
  { id: 'nextjs', name: 'Next.js', icon: 'devicon-nextjs-original' },
  { id: 'nodejs', name: 'Node.js', icon: 'devicon-nodejs-plain' },
  { id: 'typescript', name: 'TypeScript', icon: 'devicon-typescript-plain' },
  { id: 'javascript', name: 'JavaScript', icon: 'devicon-javascript-plain' },
  { id: 'python', name: 'Python', icon: 'devicon-python-plain' },
  { id: 'django', name: 'Django', icon: 'devicon-django-plain' },
  { id: 'flask', name: 'Flask', icon: 'devicon-flask-original' },
  { id: 'ruby', name: 'Ruby', icon: 'devicon-ruby-plain' },
  { id: 'rails', name: 'Rails', icon: 'devicon-rails-plain' },
  { id: 'php', name: 'PHP', icon: 'devicon-php-plain' },
  { id: 'laravel', name: 'Laravel', icon: 'devicon-laravel-plain' },
  { id: 'csharp', name: 'C#', icon: 'devicon-csharp-plain' },
  { id: 'dotnetcore', name: '.NET Core', icon: 'devicon-dotnetcore-plain' },
  { id: 'java', name: 'Java', icon: 'devicon-java-plain' },
  { id: 'spring', name: 'Spring', icon: 'devicon-spring-plain' },
  { id: 'go', name: 'Go', icon: 'devicon-go-plain' },
  { id: 'rust', name: 'Rust', icon: 'devicon-rust-plain' },
  { id: 'mongodb', name: 'MongoDB', icon: 'devicon-mongodb-plain' },
  { id: 'mysql', name: 'MySQL', icon: 'devicon-mysql-plain' },
  { id: 'postgresql', name: 'PostgreSQL', icon: 'devicon-postgresql-plain' },
  { id: 'redis', name: 'Redis', icon: 'devicon-redis-plain' },
  { id: 'docker', name: 'Docker', icon: 'devicon-docker-plain' },
  { id: 'kubernetes', name: 'Kubernetes', icon: 'devicon-kubernetes-plain' },
  { id: 'aws', name: 'AWS', icon: 'devicon-amazonwebservices-original' },
  { id: 'azure', name: 'Azure', icon: 'devicon-azure-plain' },
  { id: 'gcp', name: 'Google Cloud', icon: 'devicon-googlecloud-plain' },
  { id: 'firebase', name: 'Firebase', icon: 'devicon-firebase-plain' },
  { id: 'tailwindcss', name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain' },
  { id: 'bootstrap', name: 'Bootstrap', icon: 'devicon-bootstrap-plain' },
  { id: 'sass', name: 'Sass', icon: 'devicon-sass-original' },
  { id: 'supabase', name: 'Supabase', icon: 'devicon-supabase-plain' },
  { id: 'graphql', name: 'GraphQL', icon: 'devicon-graphql-plain' },
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
                {tech && <i className={`${tech.icon} text-base`}></i>}
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
          <Button variant="outline" type="button">Select Technologies</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Technologies</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Search technologies..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {filteredTechnologies.map(tech => (
                  <div 
                    key={tech.id} 
                    className={`
                      flex items-center justify-between p-2 rounded-md cursor-pointer
                      ${selected.includes(tech.id) ? 'bg-primary/10' : 'hover:bg-muted'}
                    `}
                    onClick={() => toggleTechnology(tech.id)}
                  >
                    <div className="flex items-center gap-3">
                      <i className={`${tech.icon} text-xl`}></i>
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
