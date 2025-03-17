
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getDevIconClass } from '@/utils/devIconUtils';

interface ProductTechnologiesProps {
  technologies: string[] | null | undefined;
}

const ProductTechnologies: React.FC<ProductTechnologiesProps> = ({ technologies }) => {
  if (!technologies || technologies.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {technologies.slice(0, 4).map((tech, index) => (
        <Badge key={index} variant="outline" className="flex items-center gap-1 text-xs">
          <i className={`${getDevIconClass(tech)} text-sm`}></i>
          {tech}
        </Badge>
      ))}
      {technologies.length > 4 && (
        <Badge variant="outline" className="text-xs">
          +{technologies.length - 4}
        </Badge>
      )}
    </div>
  );
};

export default ProductTechnologies;
