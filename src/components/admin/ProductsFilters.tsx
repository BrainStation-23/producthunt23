
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilters: string[];
  toggleStatusFilter: (status: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const ProductsFilters: React.FC<ProductsFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilters,
  toggleStatusFilter,
  handleSearch,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <form onSubmit={handleSearch} className="relative w-full sm:w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="w-full pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      <div className="flex flex-wrap gap-2">
        {statusFilters.length === 0 && (
          <Badge variant="outline" className="px-3 py-1">
            All
          </Badge>
        )}
        
        <Button 
          variant={statusFilters.includes("draft") ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleStatusFilter("draft")}
        >
          Draft
        </Button>
        <Button 
          variant={statusFilters.includes("pending") ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleStatusFilter("pending")}
        >
          Pending
        </Button>
        <Button 
          variant={statusFilters.includes("approved") ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleStatusFilter("approved")}
        >
          Approved
        </Button>
        <Button 
          variant={statusFilters.includes("rejected") ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleStatusFilter("rejected")}
        >
          Rejected
        </Button>
      </div>
    </div>
  );
};

export default ProductsFilters;
