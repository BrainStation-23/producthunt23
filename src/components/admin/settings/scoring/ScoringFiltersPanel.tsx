
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScoringFilters } from './ScoringFilters';

interface ScoringFiltersPanelProps {
  isOpen: boolean;
}

export const ScoringFiltersPanel: React.FC<ScoringFiltersPanelProps> = ({ isOpen }) => {
  if (!isOpen) return null;
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <ScoringFilters />
      </CardContent>
    </Card>
  );
};
