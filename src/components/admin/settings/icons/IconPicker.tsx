
import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DynamicIcon } from './DynamicIcon';

interface IconPickerProps {
  value: string | null;
  onChange: (value: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get all icon names from lucide-react
  const iconNames = Object.keys(LucideIcons)
    .filter(key => key !== 'default' && key !== 'createLucideIcon')
    .filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {value && value in LucideIcons ? (
            <>
              <DynamicIcon name={value} className="h-4 w-4 mr-2" />
              <span>{value}</span>
            </>
          ) : (
            <>
              <Image className="h-4 w-4 mr-2" />
              Select icon
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <div className="p-2">
          <Input
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
        </div>
        <ScrollArea className="h-[300px]">
          <div className="grid grid-cols-3 gap-2 p-2">
            {iconNames.map((name) => (
              <Button
                key={name}
                variant="ghost"
                className="flex h-10 w-full items-center justify-start gap-2 px-2"
                onClick={() => {
                  onChange(name);
                }}
              >
                <DynamicIcon name={name} className="h-4 w-4" />
                <span className="text-xs truncate">{name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
