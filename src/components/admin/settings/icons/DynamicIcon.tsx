
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
  if (!name || typeof LucideIcons[name as IconName] !== 'function') {
    return <Image className={className || "h-4 w-4"} />;
  }
  
  // Create the icon element using createElement to avoid TypeScript issues
  return React.createElement(LucideIcons[name as IconName], {
    className: className || "h-4 w-4"
  });
};
