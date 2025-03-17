
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, BarChart3, Users, Package, Settings } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const GeneralSettings: React.FC = () => {
  const [isStatsOpen, setIsStatsOpen] = useState(true);
  
  // Fetch system statistics
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      try {
        // Get counts from various tables
        const [
          { count: userCount, error: userError },
          { count: productCount, error: productError },
          { count: categoryCount, error: categoryError },
          { count: pendingProductCount, error: pendingError }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('categories').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'pending')
        ]);
        
        if (userError || productError || categoryError || pendingError) {
          throw new Error('Error fetching statistics');
        }
        
        return {
          userCount: userCount || 0,
          productCount: productCount || 0,
          categoryCount: categoryCount || 0,
          pendingProductCount: pendingProductCount || 0
        };
      } catch (error) {
        console.error('Error fetching admin statistics:', error);
        toast.error('Failed to load system statistics');
        throw error;
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">General Settings</h2>
        <p className="text-muted-foreground">
          System overview and general platform settings.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {isStatsLoading ? '...' : stats?.userCount}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-4 w-4 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {isStatsLoading ? '...' : stats?.productCount}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Settings className="h-4 w-4 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {isStatsLoading ? '...' : stats?.categoryCount}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {isStatsLoading ? '...' : stats?.pendingProductCount}
              </div>
              {!isStatsLoading && stats?.pendingProductCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  Requires Review
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Collapsible open={isStatsOpen} onOpenChange={setIsStatsOpen} className="space-y-2">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer">
            <h3 className="text-lg font-semibold">System Information</h3>
            <Button variant="ghost" size="sm">
              <ChevronDown className={`h-4 w-4 transition-transform ${isStatsOpen ? 'transform rotate-180' : ''}`} />
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Database</span>
                  <span className="font-medium">Supabase PostgreSQL</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Environment</span>
                  <span className="font-medium">Production</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Authentication</span>
                  <span className="font-medium">Supabase Auth</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default GeneralSettings;
