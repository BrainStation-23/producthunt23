
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { ExportButton } from './ExportButton';
import { exportProductScoring } from '@/utils/excelExport';

interface ProductScoringHeaderProps {
  selectedProduct: string | null;
}

export const ProductScoringHeader: React.FC<ProductScoringHeaderProps> = ({ selectedProduct }) => {
  const { data: product, isLoading } = useQuery({
    queryKey: ['product-detail', selectedProduct],
    queryFn: async () => {
      if (!selectedProduct) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('id, name, tagline, image_url, status')
        .eq('id', selectedProduct)
        .single();
        
      if (error) {
        toast.error('Failed to load product details');
        throw error;
      }
      
      return data;
    },
    enabled: !!selectedProduct
  });
  
  const handleExport = () => {
    if (!product) return;
    toast.info('Preparing Excel export...');
    exportProductScoring(product.id, product.name);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <AlertCircle className="h-4 w-4" />
        <span>Select a product to view details</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <Badge variant="outline" className="capitalize">
            {product.status || 'Unknown'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{product.tagline}</p>
      </div>
      
      <ExportButton onClick={handleExport} />
    </div>
  );
};
