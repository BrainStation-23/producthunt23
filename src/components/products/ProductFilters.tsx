
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Tag } from 'lucide-react';

// Categories data
const categories = [
  { value: 'ai', label: 'AI & Machine Learning' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'developer-tools', label: 'Developer Tools' },
  { value: 'design', label: 'Design Tools' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most-upvotes', label: 'Most Upvotes' },
  { value: 'least-upvotes', label: 'Least Upvotes' },
];

interface ProductFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  setSearchParams: (params: URLSearchParams) => void;
  searchParams: URLSearchParams;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ 
  searchQuery, 
  selectedCategory, 
  sortBy, 
  setSearchParams,
  searchParams 
}) => {
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update search params
    const params = new URLSearchParams(searchParams);
    params.set('q', searchInput);
    params.set('page', '1'); // Reset to first page on new search
    setSearchParams(params);
  };
  
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (category && category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    
    params.set('page', '1'); // Reset to first page on category change
    setSearchParams(params);
  };
  
  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    setSearchParams(params);
  };

  const clearFilter = (filterType: 'q' | 'category' | 'all') => {
    const params = new URLSearchParams(searchParams);
    
    if (filterType === 'all') {
      setSearchParams(new URLSearchParams());
      setSearchInput('');
      return;
    }
    
    params.delete(filterType);
    params.set('page', '1');
    setSearchParams(params);
    
    if (filterType === 'q') {
      setSearchInput('');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative md:col-span-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
        
        {/* Category Filter */}
        <div className="md:col-span-3">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Sort Options */}
        <div className="md:col-span-3">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {(searchQuery || selectedCategory) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">Active filters:</span>
          
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              {searchQuery}
              <button 
                className="ml-1 hover:bg-muted rounded" 
                onClick={() => clearFilter('q')}
              >
                &times;
              </button>
            </Badge>
          )}
          
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {categories.find(c => c.value === selectedCategory)?.label || selectedCategory}
              <button 
                className="ml-1 hover:bg-muted rounded" 
                onClick={() => clearFilter('category')}
              >
                &times;
              </button>
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => clearFilter('all')}
            className="text-sm"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
