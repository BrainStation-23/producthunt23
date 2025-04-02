
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabItem } from './types';

interface DesktopTabNavigationProps {
  tabItems: TabItem[];
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  children: React.ReactNode;
}

const DesktopTabNavigation: React.FC<DesktopTabNavigationProps> = ({
  tabItems,
  currentTab,
  setCurrentTab,
  children
}) => {
  return (
    <Tabs defaultValue={tabItems[0].id} value={currentTab} onValueChange={setCurrentTab}>
      <div className="relative">
        <ScrollArea className="pb-2">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            {tabItems.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="py-2"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
      </div>
      
      {tabItems.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="space-y-4 mt-4">
          {tab.id === currentTab && children}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DesktopTabNavigation;
