
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';
import { Product } from '@/types/product';

interface ProductSearchProps {
  placeholder?: string;
  className?: string;
  maxResults?: number;
  onSearch?: (term: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ 
  placeholder = "Search products...", 
  className = "",
  maxResults = 5,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearch.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setIsOpen(true);

      try {
        // Call Supabase RPC function to search products
        const { data, error } = await supabase.rpc('search_products', {
          search_query: debouncedSearch.trim(),
          result_limit: maxResults
        });

        if (error) throw error;
        
        setResults(data || []);
      } catch (error) {
        console.error('Error searching products:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearch, maxResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) onSearch(searchQuery);
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  const handleResultClick = (productId: string) => {
    navigate(`/products/${productId}`);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={placeholder}
            className="w-full bg-muted pl-8 py-2 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setIsOpen(true)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="absolute right-2.5 top-2.5" 
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </form>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-card rounded-md border shadow-lg z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2 p-2">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((product) => (
                <div 
                  key={product.id}
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() => handleResultClick(product.id)}
                >
                  <Avatar className="h-10 w-10 rounded-md">
                    {product.image_url ? (
                      <AvatarImage src={product.image_url} alt={product.name} />
                    ) : (
                      <AvatarFallback className="rounded-md">{product.name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{product.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{product.tagline}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {product.upvotes > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {product.upvotes} upvotes
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full flex items-center justify-center gap-1 mt-1"
                onClick={handleSearch}
              >
                View all results
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          ) : searchQuery.trim() ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No products found matching "{searchQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
