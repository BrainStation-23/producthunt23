
import React from 'react';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import TechnologiesSearchBar from './TechnologiesSearchBar';
import TechnologyTabs from '../technologies/TechnologyTabs';
import TechnologyGrid from '../technologies/TechnologyGrid';
import RecommendedTechnologies from '../technologies/RecommendedTechnologies';
import SelectedTechnologiesPanel from './SelectedTechnologiesPanel';
import { DeviconItem } from '@/services/deviconService';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TechnologiesDialogContentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredTechnologies: DeviconItem[];
  selected: string[];
  relatedTechSuggestions: string[];
  toggleTechnology: (techId: string) => void;
  removeTechnology: (techId: string) => void;
  clearAllTechnologies: () => void;
  isLoading: boolean;
  deviconData: DeviconItem[] | undefined;
  onClose: () => void;
}

const TechnologiesDialogContent: React.FC<TechnologiesDialogContentProps> = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  filteredTechnologies,
  selected,
  relatedTechSuggestions,
  toggleTechnology,
  removeTechnology,
  clearAllTechnologies,
  isLoading,
  deviconData,
  onClose
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      <DialogHeader className="px-6 py-4 border-b">
        <DialogTitle className="text-xl">Select Technologies</DialogTitle>
      </DialogHeader>
      
      <div className="flex-1 overflow-hidden flex flex-col p-0">
        <div className={`flex flex-col ${!isMobile ? 'md:flex-row' : ''} h-full`}>
          {/* Left column: Selection area */}
          <div className={`flex-1 flex flex-col p-6 ${!isMobile ? 'md:border-r md:max-w-[65%]' : ''} overflow-hidden`}>
            <TechnologiesSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            
            {/* Recommended technologies section */}
            <RecommendedTechnologies 
              suggestions={relatedTechSuggestions} 
              onSelect={toggleTechnology} 
            />
            
            {/* Technology categories tabs */}
            <div className="w-full overflow-x-auto mt-2">
              <TechnologyTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
            </div>
            
            {/* Loading spinner or technology grid */}
            <div className="flex-1 overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <TechnologyGrid 
                  technologies={filteredTechnologies} 
                  selectedTechnologies={selected} 
                  searchTerm={searchTerm}
                  toggleTechnology={toggleTechnology} 
                />
              )}
            </div>
          </div>

          {/* Right column: Selected technologies */}
          <SelectedTechnologiesPanel 
            selected={selected}
            deviconData={deviconData}
            removeTechnology={removeTechnology}
            clearAllTechnologies={clearAllTechnologies}
          />
        </div>
      </div>
      
      <DialogFooter className="px-6 py-4 border-t">
        <Button onClick={onClose}>
          Done
        </Button>
      </DialogFooter>
    </>
  );
};

export default TechnologiesDialogContent;
