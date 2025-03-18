import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Bookmark, Package, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserDashboard } from '@/hooks/useUserDashboard';
import UserProductsEmptyState from '@/components/user/UserProductsEmptyState';
import ProductSaveButton from '@/components/products/card/ProductSaveButton';

const UserDashboard: React.FC = () => {
  const { isLoading, data } = useUserDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your activity.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data.products.count}</div>
                <p className="text-xs text-muted-foreground">
                  Products you've submitted
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Products</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data.savedProducts.count}</div>
                <p className="text-xs text-muted-foreground">
                  Products you've saved
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data.activity.count}</div>
                <p className="text-xs text-muted-foreground">
                  Comments, votes, etc.
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data.messages.count}</div>
                <p className="text-xs text-muted-foreground">
                  Unread messages
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Products</CardTitle>
            <CardDescription>
              Products you've submitted
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : data.products.items.length > 0 ? (
              <div className="space-y-4">
                {data.products.items.map(product => (
                  <div key={product.id} className="flex items-center gap-3 border p-3 rounded-lg">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="h-12 w-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${product.id}`} className="font-medium hover:underline block truncate">
                        {product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground truncate">{product.tagline}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <UserProductsEmptyState />
            )}
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/products/submit">Submit a product</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Saved Products</CardTitle>
            <CardDescription>
              Products you've saved for later
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : data.savedProducts.items.length > 0 ? (
              <div className="space-y-4">
                {data.savedProducts.items.map(product => (
                  <div key={product.id} className="flex items-center gap-3 border p-3 rounded-lg">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="h-12 w-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${product.id}`} className="font-medium hover:underline block truncate">
                        {product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground truncate">{product.tagline}</p>
                    </div>
                    <ProductSaveButton productId={product.id} variant="outline" iconOnly />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 border rounded-md">
                <p className="text-muted-foreground">You haven't saved any products yet</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link to="/products">Browse products</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your recent interactions on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : data.activity.count > 0 ? (
            <div className="flex items-center justify-center h-40 border rounded-md">
              <p className="text-muted-foreground">Activity history coming soon</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 border rounded-md">
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
