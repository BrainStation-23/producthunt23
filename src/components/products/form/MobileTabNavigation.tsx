
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import { TabItem } from './types';

interface MobileTabNavigationProps {
  tabItems: TabItem[];
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const MobileTabNavigation: React.FC<MobileTabNavigationProps> = ({
  tabItems,
  currentTab,
  setCurrentTab
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {tabItems.find(tab => tab.id === currentTab)?.label || "Select section"}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="grid gap-1 p-2">
          {tabItems.map((tab) => (
            <Button 
              key={tab.id}
              variant={currentTab === tab.id ? "secondary" : "ghost"}
              className="justify-start font-normal"
              onClick={() => setCurrentTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MobileTabNavigation;
