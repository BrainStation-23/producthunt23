
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ProductsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const ProductsFilters: React.FC<ProductsFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
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
        <Button 
          variant={statusFilter === null ? "default" : "outline"} 
          size="sm"
          onClick={() => setStatusFilter(null)}
        >
          All
        </Button>
        <Button 
          variant={statusFilter === "approved" ? "default" : "outline"} 
          size="sm"
          onClick={() => setStatusFilter("approved")}
        >
          Approved
        </Button>
        <Button 
          variant={statusFilter === "pending" ? "default" : "outline"} 
          size="sm"
          onClick={() => setStatusFilter("pending")}
        >
          Pending
        </Button>
        <Button 
          variant={statusFilter === "rejected" ? "default" : "outline"} 
          size="sm"
          onClick={() => setStatusFilter("rejected")}
        >
          Rejected
        </Button>
      </div>
    </div>
  );
};

export default ProductsFilters;
