
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { techCategories } from '@/services/deviconService';

interface TechnologyTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TechnologyTabs: React.FC<TechnologyTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange} className="mb-6">
      <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start">
        <TabsTrigger value="all" className="px-4">All</TabsTrigger>
        <TabsTrigger value="popular" className="px-4">Popular</TabsTrigger>
        {techCategories.map(category => (
          <TabsTrigger key={category.id} value={category.id} className="px-4">{category.name}</TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TechnologyTabs;
