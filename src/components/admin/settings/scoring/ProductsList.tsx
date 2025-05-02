
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  tagline: string;
  avg_score: number | null;
  judges_count: number;
  evaluation_progress: number;
}

interface ProductsListProps {
  selectedProduct: string | null;
  onProductSelect: (productId: string) => void;
  searchQuery: string;
  className?: string;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  selectedProduct,
  onProductSelect,
  searchQuery,
  className
}) => {
  const { toast } = useToast();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products-for-scoring', searchQuery],
    queryFn: async () => {
      try {
        // Get all products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name, tagline, image_url')
          .order('name');
          
        if (productsError) {
          throw productsError;
        }
        
        // Get evaluation data for these products
        const { data: evalData, error: evalError } = await supabase
          .from('judging_submissions')
          .select('product_id, judge_id, rating_value');
          
        if (evalError) {
          throw evalError;
        }
        
        // Process and enrich product data
        const enrichedProducts = productsData.map((product: any) => {
          const productEvals = evalData.filter((eval: any) => eval.product_id === product.id);
          
          // Count unique judges
          const judges = new Set(productEvals.map((eval: any) => eval.judge_id));
          
          // Calculate average score
          const validRatings = productEvals
            .filter((eval: any) => eval.rating_value !== null)
            .map((eval: any) => eval.rating_value);
            
          const avgScore = validRatings.length > 0
            ? validRatings.reduce((sum: number, val: number) => sum + val, 0) / validRatings.length
            : null;
            
          // Calculate evaluation progress (mock for now)
          const evaluationProgress = judges.size > 0 ? Math.min(judges.size / 5, 1) : 0;
            
          return {
            ...product,
            avg_score: avgScore,
            judges_count: judges.size,
            evaluation_progress: evaluationProgress
          };
        });
        
        // Filter by search query client-side
        if (searchQuery) {
          return enrichedProducts.filter((p: Product) => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tagline.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        return enrichedProducts;
      } catch (err) {
        console.error("Error fetching products:", err);
        toast({
          title: "Error loading products",
          description: "Failed to load the product list",
          variant: "destructive",
        });
        throw err;
      }
    },
  });

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-amber-500";
    return "text-red-500";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-destructive">
        Failed to load products
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        {searchQuery ? "No products match your search" : "No products available"}
      </div>
    );
  }

  return (
    <div className={cn("overflow-y-auto", className)}>
      <ul className="divide-y divide-border">
        {products.map((product: Product) => (
          <li 
            key={product.id}
            onClick={() => onProductSelect(product.id)}
            className={cn(
              "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
              selectedProduct === product.id && "bg-muted"
            )}
          >
            <div className="flex items-start gap-3">
              {product.image_url ? (
                <div className="h-10 w-10 rounded overflow-hidden shrink-0">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="h-full w-full object-cover" 
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                  <span className="text-xs font-medium text-muted-foreground">
                    {product.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <div className="flex items-center ml-2 shrink-0">
                    <Star className={cn("h-3.5 w-3.5 mr-1", getScoreColor(product.avg_score))} />
                    <span className={cn("text-xs font-medium", getScoreColor(product.avg_score))}>
                      {product.avg_score ? product.avg_score.toFixed(1) : "N/A"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{product.tagline}</p>
                <div className="mt-2">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-muted-foreground">Evaluation Progress</span>
                    <Badge variant="outline" className="text-xs">
                      {product.judges_count} {product.judges_count === 1 ? 'judge' : 'judges'}
                    </Badge>
                  </div>
                  <Progress value={product.evaluation_progress * 100} className="h-1" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
