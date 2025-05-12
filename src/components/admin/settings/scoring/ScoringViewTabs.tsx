
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ScoringViewTabsProps {
  view: 'table' | 'visual';
  onViewChange: (view: 'table' | 'visual') => void;
  className?: string;
}

export const ScoringViewTabs: React.FC<ScoringViewTabsProps> = ({ view, onViewChange, className }) => {
  return (
    <Tabs 
      value={view} 
      onValueChange={(v) => onViewChange(v as 'table' | 'visual')} 
      className={className}
    >
      <TabsList className="w-full">
        <TabsTrigger value="table" className={className ? "flex-1" : ""}>Table</TabsTrigger>
        <TabsTrigger value="visual" className={className ? "flex-1" : ""}>Visual</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
