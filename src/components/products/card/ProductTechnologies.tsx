
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getDeviconClass } from '@/services/deviconService';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface ProductTechnologiesProps {
  technologies: string[] | null | undefined;
}

const ProductTechnologies: React.FC<ProductTechnologiesProps> = ({ technologies }) => {
  if (!technologies || technologies.length === 0) return null;
  
  // Number of technologies to show directly
  const displayCount = 4;
  const visibleTechs = technologies.slice(0, displayCount);
  const hasMoreTechs = technologies.length > displayCount;
  
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {visibleTechs.map((tech, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <i className={`${getDeviconClass(tech)} text-sm`}></i>
                {tech}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tech}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      
      {hasMoreTechs && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="text-xs">
                +{technologies.length - displayCount}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p className="font-semibold">Additional technologies:</p>
                <div>
                  {technologies.slice(displayCount).map((tech, index) => (
                    <div key={index} className="flex items-center gap-1.5 py-0.5">
                      <i className={`${getDeviconClass(tech)} text-sm`}></i>
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default ProductTechnologies;
