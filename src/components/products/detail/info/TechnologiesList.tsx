
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getDeviconClass } from '@/services/deviconService';

interface TechnologiesListProps {
  technologies: string[] | null | undefined;
}

const TechnologiesList: React.FC<TechnologiesListProps> = ({ technologies }) => {
  if (!technologies || technologies.length === 0) return null;
  
  return (
    <div>
      <h3 className="font-medium mb-2">Built with</h3>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          <Badge key={index} variant="outline" className="flex items-center gap-1">
            <i className={`${getDeviconClass(tech)} text-sm`}></i>
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TechnologiesList;
