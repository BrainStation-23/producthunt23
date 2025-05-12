
import React, { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScoringMetrics } from '@/components/admin/settings/scoring/ScoringMetrics';
import { ProductsList } from '@/components/admin/settings/scoring/ProductsList';
import { ScoringViewTabs } from '@/components/admin/settings/scoring/ScoringViewTabs';
import { ScoringFiltersPanel } from '@/components/admin/settings/scoring/ScoringFiltersPanel';
import { ProductScoringContent } from '@/components/admin/settings/scoring/ProductScoringContent';
import { useScoringMetrics } from '@/hooks/useScoringMetrics';

const AdminScoring = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState<'table' | 'visual'>('table');
  
  const { metrics, isLoading: metricsLoading } = useScoringMetrics();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Scoring</h1>
          <p className="text-muted-foreground">
            Review and analyze judge evaluations for all products.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <ScoringViewTabs 
            view={view} 
            onViewChange={(v) => setView(v)} 
            className="hidden md:block"
          />
        </div>
      </div>

      <ScoringFiltersPanel isOpen={filterOpen} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ScoringMetrics metrics={metrics} isLoading={metricsLoading} />
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ProductsList 
              selectedProduct={selectedProduct}
              onProductSelect={setSelectedProduct}
              searchQuery={searchQuery}
              className="max-h-[calc(100vh-300px)] overflow-auto"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            {/* Mobile tabs - visible on mobile devices */}
            {selectedProduct && (
              <ScoringViewTabs 
                view={view} 
                onViewChange={(v) => setView(v)} 
                className="md:hidden mb-6"
              />
            )}
            
            <ProductScoringContent 
              selectedProduct={selectedProduct}
              view={view}
            />
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminScoring;
