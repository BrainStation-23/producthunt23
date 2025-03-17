
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
  if (!name || !(name in LucideIcons)) {
    return <Image className={className || "h-4 w-4"} />;
  }
  
  const IconComponent = LucideIcons[name as IconName] as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className || "h-4 w-4"} />;
};
