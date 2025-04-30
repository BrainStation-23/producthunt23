
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, TrendingUp, Package } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ActivityItem {
  id: string;
  type: 'product' | 'upvote';
  created_at: string;
  product_name: string;
  product_id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
}

const AdminActivity: React.FC = () => {
  useDocumentTitle('Activity Log | Admin');
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('all');

  const { data: activityData, isLoading, error } = useQuery({
    queryKey: ['activity-log'],
    queryFn: async () => {
      try {
        // Fetch recent products
        const { data: recentProducts, error: productsError } = await supabase
          .from('products')
          .select('id, name, status, created_at, created_by, profiles:created_by(username, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(50);

        if (productsError) throw productsError;

        // Fetch recent upvotes
        const { data: recentUpvotes, error: upvotesError } = await supabase
          .from('upvotes')
          .select('id, created_at, user_id, product_id, profiles:user_id(username, avatar_url), products:product_id(name)')
          .order('created_at', { ascending: false })
          .limit(50);

        if (upvotesError) throw upvotesError;

        // Transform products data
        const productActivities = recentProducts.map((product: any) => ({
          id: `product-${product.id}`,
          type: 'product' as const,
          created_at: product.created_at,
          product_name: product.name,
          product_id: product.id,
          user_id: product.created_by,
          username: product.profiles?.username || 'Unknown user',
          avatar_url: product.profiles?.avatar_url,
          status: product.status
        }));

        // Transform upvotes data
        const upvoteActivities = recentUpvotes.map((upvote: any) => ({
          id: `upvote-${upvote.id}`,
          type: 'upvote' as const,
          created_at: upvote.created_at,
          product_name: upvote.products?.name || 'Unknown product',
          product_id: upvote.product_id,
          user_id: upvote.user_id,
          username: upvote.profiles?.username || 'Unknown user',
          avatar_url: upvote.profiles?.avatar_url
        }));

        // Combine and sort all activities by date
        const allActivities = [...productActivities, ...upvoteActivities].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        return {
          all: allActivities,
          products: productActivities,
          upvotes: upvoteActivities,
        };
      } catch (err) {
        console.error('Error fetching activity data:', err);
        toast({
          title: "Error loading activity",
          description: "Failed to fetch activity data",
          variant: "destructive",
        });
        throw err;
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Failed to load activity data
      </div>
    );
  }

  const renderActivityItem = (item: ActivityItem) => {
    const date = new Date(item.created_at).toLocaleDateString(undefined, {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <div key={item.id} className="flex items-center justify-between border-b pb-4 mb-4 last:mb-0 last:pb-0 last:border-b-0">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
            {item.type === 'product' ? (
              <Package className="h-5 w-5" />
            ) : (
              <TrendingUp className="h-5 w-5" />
            )}
          </div>
          <div>
            <div className="flex items-center">
              <p className="text-sm font-medium">{item.product_name}</p>
              {item.type === 'product' && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">New Product</span>
              )}
              {item.type === 'upvote' && (
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Upvote</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {item.type === 'product' 
                ? `Added by ${item.username}` 
                : `Upvoted by ${item.username}`
              }
            </p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">{date}</div>
      </div>
    );
  };

  const currentItems = activityData?.[activeTab as keyof typeof activityData] || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
        <p className="text-muted-foreground mb-6">
          Track all platform activity including products and interactions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Showing the latest {currentItems.length} activities
          </CardDescription>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Activity</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="upvotes">Upvotes</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {currentItems.length > 0 ? (
              currentItems.map((item: ActivityItem) => renderActivityItem(item))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No activities found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminActivity;
