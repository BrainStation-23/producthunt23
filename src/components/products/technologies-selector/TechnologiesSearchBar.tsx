
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TechnologiesSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const TechnologiesSearchBar: React.FC<TechnologiesSearchBarProps> = ({ 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input 
        placeholder="Search technologies..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 py-2 text-base w-full"
      />
    </div>
  );
};

export default TechnologiesSearchBar;
