
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface UnassignedProduct {
  id: string;
  name: string;
  tagline: string;
  image_url: string | null;
  status: string;
  created_at: string;
}

const UnassignedProducts: React.FC = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['unassignedProducts'],
    queryFn: async () => {
      try {
        // First, get already assigned product IDs
        const { data: assignedData, error: assignedError } = await supabase
          .from('judge_assignments')
          .select('product_id');

        if (assignedError) throw assignedError;

        // Extract product IDs from assigned data
        const assignedProductIds = assignedData.map(item => item.product_id);

        // Then fetch approved products that aren't in the assigned list
        const query = supabase
          .from('products')
          .select('id, name, tagline, image_url, status, created_at')
          .eq('status', 'approved');
          
        // Only filter by not-in if we have assigned products
        if (assignedProductIds.length > 0) {
          query.not('id', 'in', `(${assignedProductIds.join(',')})`);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        return data as UnassignedProduct[];
      } catch (error) {
        console.error('Error fetching unassigned products:', error);
        return [];
      }
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unassigned Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unassigned Products</CardTitle>
      </CardHeader>
      <CardContent>
        {products && products.length > 0 ? (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="h-12 w-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                      No img
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium">{product.name}</h4>
                  <p className="text-xs text-muted-foreground truncate max-w-60">
                    {product.tagline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            All products have been assigned to judges.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UnassignedProducts;
