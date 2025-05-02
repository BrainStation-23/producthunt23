
import React, { useState } from 'react';
import { ProductScoringTable } from '@/components/admin/settings/scoring/ProductScoringTable';
import { ProductScoringHeader } from '@/components/admin/settings/scoring/ProductScoringHeader';
import { Toaster } from '@/components/ui/toaster';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ProductsList } from '@/components/admin/settings/scoring/ProductsList';

const AdminScoring = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Scoring</h1>
        <p className="text-muted-foreground mb-6">
          Review and analyze judge evaluations for all products.
        </p>
      </div>
      
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup 
          direction="horizontal"
          className="h-full border rounded-lg"
        >
          <ResizablePanel defaultSize={30} minSize={25}>
            <div className="h-full p-4 flex flex-col">
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex-1 overflow-auto">
                <ProductsList 
                  selectedProduct={selectedProduct}
                  onProductSelect={setSelectedProduct}
                  searchQuery={searchQuery}
                />
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={70}>
            <div className="h-full flex flex-col">
              {selectedProduct ? (
                <div className="p-4 flex-1 overflow-auto">
                  <ProductScoringHeader selectedProduct={selectedProduct} />
                  <div className="mt-4">
                    <Card className="p-4">
                      <ProductScoringTable productId={selectedProduct} />
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a product to view evaluation data
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminScoring;
