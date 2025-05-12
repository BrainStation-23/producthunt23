
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { ProductScoringHeader } from './ProductScoringHeader';
import { ProductScoringTable } from './ProductScoringTable';
import { ProductScoreChart } from './ProductScoreChart';

interface ProductScoringContentProps {
  selectedProduct: string | null;
  view: 'table' | 'visual';
}

export const ProductScoringContent: React.FC<ProductScoringContentProps> = ({ 
  selectedProduct,
  view
}) => {
  if (!selectedProduct) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3">
          <ChevronRight className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">No product selected</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
          Select a product from the list to view detailed evaluation data and scores.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductScoringHeader selectedProduct={selectedProduct} />
      
      <div className="mt-6">
        {view === 'table' ? (
          <div className="rounded-md border">
            <ProductScoringTable productId={selectedProduct} />
          </div>
        ) : (
          <ProductScoreChart productId={selectedProduct} />
        )}
      </div>
    </div>
  );
};
