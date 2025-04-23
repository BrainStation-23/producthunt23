
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ProductScoringTable } from '@/components/admin/settings/scoring/ProductScoringTable';
import { ProductScoringHeader } from '@/components/admin/settings/scoring/ProductScoringHeader';
import { Toaster } from '@/components/ui/toaster';

const AdminScoring = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Scoring</h1>
        <p className="text-muted-foreground mb-6">
          Review and analyze judge evaluations for all products.
        </p>
      </div>
      
      <Card className="p-6">
        <ProductScoringHeader 
          selectedProduct={selectedProduct}
          onProductSelect={setSelectedProduct}
        />
        
        <ProductScoringTable productId={selectedProduct} />
      </Card>
      <Toaster />
    </div>
  );
};

export default AdminScoring;
