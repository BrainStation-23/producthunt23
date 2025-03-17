
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Image } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// Create a more specific type for icon names from Lucide
// Excluding non-icon exports like 'createLucideIcon' and 'default'
type IconName = keyof Omit<typeof LucideIcons, 'createLucideIcon' | 'default'>;

interface DynamicIconProps {
  name: string | null;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className }) => {
  if (!name) {
    return <Image className={className || "h-4 w-4"} />;
  }
  
  // Type guard to check if the name exists in LucideIcons and is a valid icon
  const isValidIconName = (name: string): name is IconName => {
    return (
      name in LucideIcons && 
      name !== 'createLucideIcon' && 
      name !== 'default' &&
      typeof LucideIcons[name as IconName] === 'function'
    );
  };
  
  // Check if the name is a valid icon name
  if (!isValidIconName(name)) {
    return <Image className={className || "h-4 w-4"} />;
  }
  
  // Get the icon component
  const IconComponent = LucideIcons[name] as LucideIcon;
  
  // Use React.createElement to create the element
  // This approach handles the complex types better than JSX syntax
  return React.createElement(IconComponent, {
    className: className || "h-4 w-4"
  });
};
