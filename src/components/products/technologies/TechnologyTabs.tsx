
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { techCategories } from '@/services/deviconService';

interface TechnologyTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TechnologyTabs: React.FC<TechnologyTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange} className="mb-4 w-full">
      <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start p-1 h-auto">
        <TabsTrigger value="all" className="px-3 py-1.5 whitespace-nowrap">All</TabsTrigger>
        <TabsTrigger value="popular" className="px-3 py-1.5 whitespace-nowrap">Popular</TabsTrigger>
        {techCategories.map(category => (
          <TabsTrigger 
            key={category.id} 
            value={category.id} 
            className="px-3 py-1.5 whitespace-nowrap"
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TechnologyTabs;
