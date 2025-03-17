
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ArrowUp, ArrowDown, Tag } from 'lucide-react';

// Types for our products
interface Product {
  id: string;
  name: string;
  description: string;
  tagline: string;
  image_url: string | null;
  website_url: string | null;
  tags: string[] | null;
  upvotes: number;
  created_at: string;
  created_by: string;
  profile_id: string;
  profile_username: string | null;
  profile_avatar_url: string | null;
}

interface ProductsResponse {
  data: Product[];
  totalCount: number;
}

// Categories data (these would normally come from the API)
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

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  
  // Extract search parameters
  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sort') || 'newest';
  
  // Map sort options to actual sort parameters
  const getSortParams = () => {
    switch(sortBy) {
      case 'newest':
        return { sort_by: 'created_at', sort_direction: 'desc' };
      case 'oldest':
        return { sort_by: 'created_at', sort_direction: 'asc' };
      case 'most-upvotes':
        return { sort_by: 'upvotes', sort_direction: 'desc' };
      case 'least-upvotes':
        return { sort_by: 'upvotes', sort_direction: 'asc' };
      default:
        return { sort_by: 'created_at', sort_direction: 'desc' };
    }
  };

  // Local state for search input (to avoid immediate search on every keystroke)
  const [searchInput, setSearchInput] = useState(searchQuery);
  
  // Fetch products using the filter_products function
  const fetchProducts = async (): Promise<ProductsResponse> => {
    try {
      const { sort_by, sort_direction } = getSortParams();
      
      // Call the filter_products function
      const { data, error } = await supabase.rpc('filter_products', {
        search_query: searchQuery,
        selected_category: selectedCategory || null,
        sort_by,
        sort_direction,
        page_number: currentPage,
        page_size: 12
      });
      
      if (error) throw error;
      
      // Extract total count from the first result
      const totalCount = data.length > 0 ? data[0].total_count : 0;
      setTotalPages(Math.ceil(totalCount / 12));
      
      return { data, totalCount };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { data: [], totalCount: 0 };
    }
  };
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory, currentPage, sortBy],
    queryFn: fetchProducts
  });
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update search params
    const params = new URLSearchParams(searchParams);
    params.set('q', searchInput);
    params.set('page', '1'); // Reset to first page on new search
    setSearchParams(params);
  };
  
  // Update category filter
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    
    params.set('page', '1'); // Reset to first page on category change
    setSearchParams(params);
  };
  
  // Update sort option
  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    setSearchParams(params);
  };
  
  // Navigate to a specific page
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };
  
  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxDisplayedPages = 5;
    
    // Logic to show limited page links with ellipsis
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);
    
    if (endPage - startPage < maxDisplayedPages - 1) {
      startPage = Math.max(1, endPage - maxDisplayedPages + 1);
    }
    
    // Add first page if not included in the range
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => goToPage(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Add ellipsis if there's a gap
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        );
      }
    }
    
    // Add pages in the current range
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => goToPage(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add last page if not included in the range
    if (endPage < totalPages) {
      // Add ellipsis if there's a gap
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => goToPage(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  // Render product cards or skeletons
  const renderProducts = () => {
    if (isLoading) {
      return Array(12).fill(0).map((_, i) => (
        <Card key={`skeleton-${i}`} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardHeader className="p-4 pb-0">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="p-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Skeleton className="h-8 w-24" />
          </CardFooter>
        </Card>
      ));
    }
    
    if (isError) {
      return (
        <div className="col-span-full py-12 text-center">
          <p className="text-lg text-red-500">Failed to load products. Please try again later.</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      );
    }
    
    if (data?.data?.length === 0) {
      return (
        <div className="col-span-full py-12 text-center">
          <p className="text-lg text-muted-foreground">No products found matching your search criteria.</p>
          <Button onClick={() => setSearchParams({})} variant="outline" className="mt-4">
            Clear filters
          </Button>
        </div>
      );
    }
    
    return data?.data?.map((product) => (
      <Card key={product.id} className="overflow-hidden">
        <div className="aspect-video relative overflow-hidden bg-muted">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        
        <CardHeader className="p-4 pb-0">
          <CardTitle className="line-clamp-1 text-xl">{product.name}</CardTitle>
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.tagline}</p>
        </CardHeader>
        
        <CardContent className="p-4 space-y-2">
          <div className="line-clamp-2 text-sm">{product.description}</div>
          
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowUp className="h-4 w-4" />
              {product.upvotes || 0}
            </Button>
          </div>
          
          {product.website_url && (
            <Button variant="outline" size="sm" onClick={() => window.open(product.website_url, '_blank')}>
              Visit
            </Button>
          )}
        </CardFooter>
      </Card>
    ));
  };
  
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Discover Products</h1>
        <p className="text-muted-foreground max-w-3xl">
          Explore the latest products and tools built by the community. Find inspiration for your next project.
        </p>
      </div>
      
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
                <SelectItem value="">All categories</SelectItem>
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
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete('q');
                    params.set('page', '1');
                    setSearchParams(params);
                    setSearchInput('');
                  }}
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
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete('category');
                    params.set('page', '1');
                    setSearchParams(params);
                  }}
                >
                  &times;
                </button>
              </Badge>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearchParams({});
                setSearchInput('');
              }}
              className="text-sm"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {renderProducts()}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ProductsPage;
