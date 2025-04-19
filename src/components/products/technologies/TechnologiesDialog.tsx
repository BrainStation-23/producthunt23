
import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { DeviconItem } from '@/services/deviconService';
import TechnologyGrid from './TechnologyGrid';
import TechnologyTabs from './TechnologyTabs';
import SelectedTechnologies from './SelectedTechnologies';
import RecommendedTechnologies from './RecommendedTechnologies';
import { useTechnologiesData } from './hooks/useTechnologiesData';

interface TechnologiesDialogProps {
  selected: string[];
  onSelect: (techId: string) => void;
  onRemove: (techId: string) => void;
  onClose: () => void;
}

const TechnologiesDialog: React.FC<TechnologiesDialogProps> = ({
  selected,
  onSelect,
  onRemove,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const {
    deviconData,
    isLoading,
    filteredTechnologies,
    relatedTechSuggestions,
  } = useTechnologiesData(selected, activeTab, searchTerm);

  return (
    <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden flex flex-col p-0">
      <DialogHeader className="px-6 py-4 border-b">
        <DialogTitle className="text-xl">Select Technologies</DialogTitle>
      </DialogHeader>
      
      <div className="flex-1 overflow-hidden flex flex-col p-6 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search technologies..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-2 text-base w-full"
          />
        </div>
        
        <SelectedTechnologies 
          selected={selected} 
          onRemove={onRemove} 
          deviconData={deviconData} 
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            <RecommendedTechnologies 
              suggestions={relatedTechSuggestions} 
              onSelect={onSelect} 
            />
            
            <div className="w-full overflow-x-auto">
              <TechnologyTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
            </div>
            
            <div className="flex-1 overflow-hidden">
              <TechnologyGrid 
                technologies={filteredTechnologies} 
                selectedTechnologies={selected} 
                searchTerm={searchTerm}
                toggleTechnology={onSelect} 
              />
            </div>
          </div>
        )}
      </div>
      
      <DialogFooter className="px-6 py-4 border-t">
        <Button onClick={onClose}>
          Done
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default TechnologiesDialog;
