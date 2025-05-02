
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { Input } from '@/components/ui/input';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
        // Calculate metrics manually since the RPC function doesn't exist
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id');
          
        if (productsError) throw productsError;
        
        const { data: submissions, error: submissionsError } = await supabase
          .from('judging_submissions')
          .select('product_id, judge_id, rating_value');
          
        if (submissionsError) throw submissionsError;
        
        // Calculate metrics
        const totalProducts = products?.length || 0;
        
        // Group submissions by product
        const productScores: Record<string, number[]> = {};
        submissions?.forEach((sub: any) => {
          if (sub.rating_value !== null) {
            if (!productScores[sub.product_id]) {
              productScores[sub.product_id] = [];
            }
            productScores[sub.product_id].push(sub.rating_value);
          }
        });
        
        // Calculate average scores
        const productAvgScores = Object.entries(productScores).map(([id, scores]) => {
          return {
            id,
            avgScore: scores.reduce((sum, score) => sum + score, 0) / scores.length
          };
        });
        
        // Calculate overall metrics
        const averageScore = productAvgScores.length > 0 
          ? productAvgScores.reduce((sum, item) => sum + item.avgScore, 0) / productAvgScores.length
          : 0;
          
        const highScoringCount = productAvgScores.filter(p => p.avgScore >= 8).length;
        const lowScoringCount = productAvgScores.filter(p => p.avgScore < 6).length;
        
        // Calculate evaluation progress
        const productsWithEvals = Object.keys(productScores).length;
        const evaluationCompletion = totalProducts > 0 
          ? (productsWithEvals / totalProducts) * 100
          : 0;
        
        return {
          total_products: totalProducts,
          average_score: averageScore,
          high_scoring_count: highScoringCount,
          low_scoring_count: lowScoringCount,
          evaluation_completion: evaluationCompletion
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
                
                {/* Mobile tabs - visible on mobile devices */}
                <Tabs value={view} onValueChange={(v) => setView(v as 'table' | 'visual')} className="md:hidden">
                  <TabsList className="w-full">
                    <TabsTrigger value="table" className="flex-1">Table</TabsTrigger>
                    <TabsTrigger value="visual" className="flex-1">Visual</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                {/* Fixed: Using proper conditional rendering instead of TabsContent outside Tabs */}
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
