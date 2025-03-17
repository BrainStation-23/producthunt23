
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CategorySearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const CategorySearch: React.FC<CategorySearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex gap-2 items-center mb-4">
      <Search className="h-4 w-4 text-muted-foreground ml-2" />
      <Input
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};

export default CategorySearch;
