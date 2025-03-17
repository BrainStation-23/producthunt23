
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Image } from 'lucide-react';

// Create a type for the icon names from Lucide
type IconName = keyof typeof LucideIcons;

// Component to render a Lucide icon by name
interface DynamicIconProps {
  name: string | null;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className }) => {
  if (!name) {
    return <Image className={className || "h-4 w-4"} />;
  }
  
  // Check if the icon exists in LucideIcons
  const IconComponent = LucideIcons[name as IconName];
  
  // If the component doesn't exist or isn't a valid component
  if (!IconComponent || typeof IconComponent !== 'function') {
    return <Image className={className || "h-4 w-4"} />;
  }

  // Render the icon directly
  return <IconComponent className={className || "h-4 w-4"} />;
};
