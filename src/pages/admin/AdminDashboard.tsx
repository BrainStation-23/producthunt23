import React, { useEffect, useState } from 'react';
import { Activity, Users, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

// Function to fetch dashboard stats
const fetchDashboardStats = async () => {
  try {
    // Get users count
    const { count: usersCount, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (usersError) throw usersError;

    // Get products count
    const { count: productsCount, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (productsError) throw productsError;

    // Get pending products count
    const { count: pendingCount, error: pendingError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (pendingError) throw pendingError;

    // Get upvotes count (as measure of engagement)
    const { count: upvotesCount, error: upvotesError } = await supabase
      .from('upvotes')
      .select('*', { count: 'exact', head: true });

    if (upvotesError) throw upvotesError;

    return {
      usersCount: usersCount || 0,
      productsCount: productsCount || 0,
      pendingCount: pendingCount || 0,
      upvotesCount: upvotesCount || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Function to fetch recent activity
const fetchRecentActivity = async () => {
  try {
    // Get latest products
    const { data: recentProducts, error: productsError } = await supabase
      .from('products')
      .select('id, name, status, created_at, created_by, profiles:created_by(username, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(5);

    if (productsError) throw productsError;

    // Get latest upvotes
    const { data: recentUpvotes, error: upvotesError } = await supabase
      .from('upvotes')
      .select('id, created_at, user_id, product_id, profiles:user_id(username, avatar_url), products:product_id(name)')
      .order('created_at', { ascending: false })
      .limit(5);

    if (upvotesError) throw upvotesError;

    return {
      recentProducts: recentProducts || [],
      recentUpvotes: recentUpvotes || []
    };
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};

// Function to fetch pending products
const fetchPendingProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, tagline, created_at, created_by, profiles:created_by(username, avatar_url)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching pending products:', error);
    throw error;
  }
};

const AdminDashboard: React.FC = () => {
  // Query for dashboard stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats
  });

  // Query for recent activity
  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: fetchRecentActivity
  });

  // Query for pending products
  const { data: pendingProducts, isLoading: isLoadingPending } = useQuery({
    queryKey: ['pendingProducts'],
    queryFn: fetchPendingProducts
  });

  const handleApproveProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'approved' })
        .eq('id', productId);

      if (error) throw error;
      
      toast.success('Product approved successfully');
    } catch (error) {
      console.error('Error approving product:', error);
      toast.error('Failed to approve product');
    }
  };

  const handleRejectProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'rejected' })
        .eq('id', productId);

      if (error) throw error;
      
      toast.success('Product rejected');
    } catch (error) {
      console.error('Error rejecting product:', error);
      toast.error('Failed to reject product');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the administration panel.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.usersCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Managing user accounts
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.productsCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Products on platform
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Submissions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.pendingCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Pending approval
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.upvotesCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Total product upvotes
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Recent user and product activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingActivity ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : activity && (activity.recentProducts.length > 0 || activity.recentUpvotes.length > 0) ? (
              <div className="space-y-4">
                {activity.recentProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          New product ({product.status}) by {product.profiles?.username || 'Unknown user'}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(product.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                
                {activity.recentUpvotes.map(upvote => (
                  <div key={upvote.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{upvote.products?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Upvoted by {upvote.profiles?.username || 'Unknown user'}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(upvote.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 border rounded-md">
                <p className="text-muted-foreground">No recent activity found</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/activity">View all activity</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>
              Products awaiting moderation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingPending ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : pendingProducts && pendingProducts.length > 0 ? (
              <div className="space-y-4">
                {pendingProducts.map(product => (
                  <div key={product.id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">{product.tagline}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(product.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleApproveProduct(product.id)}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-destructive hover:bg-destructive/10"
                        onClick={() => handleRejectProduct(product.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 border rounded-md">
                <p className="text-muted-foreground">No pending approvals</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">View all</Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <p className="font-medium">Supabase Connection Active</p>
            </div>
            <p className="text-sm text-muted-foreground">
              All systems are operational. Database and authentication services are running normally.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
