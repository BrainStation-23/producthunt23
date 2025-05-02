
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { Input } from '@/components/ui/input';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ScoringMetrics } from '@/components/admin/settings/scoring/ScoringMetrics';
import { ProductScoringHeader } from '@/components/admin/settings/scoring/ProductScoringHeader';
import { ProductScoringTable } from '@/components/admin/settings/scoring/ProductScoringTable';
import { ProductScoreChart } from '@/components/admin/settings/scoring/ProductScoreChart';
import { ProductsList } from '@/components/admin/settings/scoring/ProductsList';
import { ScoringFilters } from '@/components/admin/settings/scoring/ScoringFilters';

const AdminScoring = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState<'table' | 'visual'>('table');
  const { toast } = useToast();
  
  // Fetch summary metrics for all products
  const { data: summaryMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['scoring-metrics'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_judging_summary_metrics');
          
        if (error) {
          toast({
            title: "Error loading metrics",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        return data || {
          total_products: 0,
          average_score: 0,
          high_scoring_count: 0,
          low_scoring_count: 0,
          evaluation_completion: 0
        };
      } catch (err) {
        console.error("Error fetching metrics:", err);
        return {
          total_products: 0,
          average_score: 0,
          high_scoring_count: 0,
          low_scoring_count: 0,
          evaluation_completion: 0
        };
      }
    }
  });
  
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
          <Tabs value={view} onValueChange={(v) => setView(v as 'table' | 'visual')} className="hidden md:block">
            <TabsList>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="visual">Visual View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filterOpen && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <ScoringFilters />
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ScoringMetrics metrics={summaryMetrics} isLoading={metricsLoading} />
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
            {selectedProduct ? (
              <div className="space-y-6">
                <ProductScoringHeader selectedProduct={selectedProduct} />
                <Tabs value={view} onValueChange={(v) => setView(v as 'table' | 'visual')} className="md:hidden">
                  <TabsList>
                    <TabsTrigger value="table">Table</TabsTrigger>
                    <TabsTrigger value="visual">Visual</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <TabsContent value="table" className="mt-6">
                  <div className="rounded-md border">
                    <ProductScoringTable productId={selectedProduct} />
                  </div>
                </TabsContent>
                
                <TabsContent value="visual" className="mt-6">
                  <ProductScoreChart productId={selectedProduct} />
                </TabsContent>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3">
                  <ChevronRight className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No product selected</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                  Select a product from the list to view detailed evaluation data and scores.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminScoring;
