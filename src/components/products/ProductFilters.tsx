
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Tag, Code } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TechnologiesDialog from './technologies-selector/TechnologiesDialog';

interface Category {
  id: string;
  name: string;
  status: string;
}

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most-upvotes', label: 'Most Upvotes' },
  { value: 'least-upvotes', label: 'Least Upvotes' },
];

interface ProductFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  selectedTechnology: string;
  sortBy: string;
  setSearchParams: (params: URLSearchParams) => void;
  searchParams: URLSearchParams;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ 
  searchQuery, 
  selectedCategory,
  selectedTechnology, 
  sortBy, 
  setSearchParams,
  searchParams 
}) => {
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Convert single technology to array format for the selector
  const selectedTechnologies = selectedTechnology ? [selectedTechnology] : [];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, status')
          .eq('status', 'active')
          .order('name');
        
        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }
        
        setCategories(data || []);
      } catch (error) {
        console.error('Unexpected error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
  
  const handleTechnologyChange = (technologies: string[]) => {
    const params = new URLSearchParams(searchParams);
    
    if (technologies.length > 0) {
      // For now, we'll only use the first selected technology for filtering
      // Future enhancement could allow multiple technology filters
      params.set('technology', technologies[0]);
    } else {
      params.delete('technology');
    }
    
    params.set('page', '1'); // Reset to first page on technology change
    setSearchParams(params);
  };
  
  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    setSearchParams(params);
  };

  const clearFilter = (filterType: 'q' | 'category' | 'technology' | 'all') => {
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

  // Helper function to find category name by value
  const getCategoryNameByValue = (value: string): string => {
    const category = categories.find(c => c.id === value);
    return category ? category.name : value;
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
        <div className="md:col-span-2">
          <Select value={selectedCategory} onValueChange={handleCategoryChange} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Loading..." : "All categories"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Technology Filter - Using the TechnologiesDialog */}
        <div className="md:col-span-2">
          <TechnologiesDialog
            selectedTechnologies={selectedTechnologies}
            onSelectionChange={handleTechnologyChange}
            buttonVariant="outline"
            buttonClassName="w-full"
            placeholder={selectedTechnology || "All technologies"}
            singleSelection={true}
          />
        </div>
        
        {/* Sort Options */}
        <div className="md:col-span-2">
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
      {(searchQuery || selectedCategory || selectedTechnology) && (
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
              {getCategoryNameByValue(selectedCategory)}
              <button 
                className="ml-1 hover:bg-muted rounded" 
                onClick={() => clearFilter('category')}
              >
                &times;
              </button>
            </Badge>
          )}
          
          {selectedTechnology && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              {selectedTechnology}
              <button 
                className="ml-1 hover:bg-muted rounded" 
                onClick={() => clearFilter('technology')}
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
