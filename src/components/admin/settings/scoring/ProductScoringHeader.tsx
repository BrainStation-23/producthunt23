
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Star, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductScoringHeaderProps {
  selectedProduct: string | null;
}

export const ProductScoringHeader: React.FC<ProductScoringHeaderProps> = ({
  selectedProduct
}) => {
  const { toast } = useToast();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product-detail', selectedProduct],
    queryFn: async () => {
      if (!selectedProduct) return null;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, tagline, image_url, categories, created_at')
          .eq('id', selectedProduct)
          .single();
          
        if (error) {
          toast({
            title: "Error loading product details",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        
        // Get category names
        if (data.categories && data.categories.length > 0) {
          const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('id, name')
            .in('id', data.categories);
            
          if (!categoryError && categoryData) {
            const categoryMap = categoryData.reduce((acc, cat) => {
              acc[cat.id] = cat.name;
              return acc;
            }, {} as Record<string, string>);
            
            data.categoryNames = data.categories.map((id: string) => categoryMap[id] || id);
          }
        }
        
        return data;
      } catch (err) {
        console.error("Error fetching product details:", err);
        throw err;
      }
    },
    enabled: !!selectedProduct
  });
  
  // Query product score summary
  const { data: scoreSummary } = useQuery({
    queryKey: ['product-score-summary', selectedProduct],
    queryFn: async () => {
      if (!selectedProduct) return null;
      
      try {
        const { data, error } = await supabase
          .rpc('get_product_score_summary', {
            product_uuid: selectedProduct
          });
          
        if (error) throw error;
        return data || { avg_score: null, judges_count: 0 };
      } catch (err) {
        console.error("Error fetching score summary:", err);
        return { avg_score: null, judges_count: 0 };
      }
    },
    enabled: !!selectedProduct
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading product details...</span>
      </div>
    );
  }

  if (error || !product) {
    return null;
  }
  
  const formattedDate = product.created_at 
    ? new Date(product.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }) 
    : '';
  
  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        {product.image_url ? (
          <div className="h-16 w-16 rounded overflow-hidden shrink-0">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="h-full w-full object-cover" 
            />
          </div>
        ) : (
          <div className="h-16 w-16 rounded bg-muted flex items-center justify-center shrink-0">
            <span className="text-lg font-medium text-muted-foreground">
              {product.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            
            <div className="flex items-center ml-auto">
              <div className={cn(
                "flex items-center rounded-md border px-2.5 py-0.5", 
                getScoreColor(scoreSummary?.avg_score || null)
              )}>
                <Star className="h-4 w-4 mr-1" />
                <span className="text-sm font-semibold">
                  {scoreSummary?.avg_score ? scoreSummary.avg_score.toFixed(1) : "No score"}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-muted-foreground mt-1">{product.tagline}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {product.categoryNames?.map((category: string, i: number) => (
              <Badge key={i} variant="secondary">
                {category}
              </Badge>
            ))}
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
