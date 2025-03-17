
import React from 'react';
import { Activity, Heart, Package, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Products you've submitted
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Products</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Products you've saved
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Comments, votes, etc.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Unread messages
            </p>
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
            <div className="flex items-center justify-center h-40 border rounded-md">
              <p className="text-muted-foreground">You haven't submitted any products yet</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/submit">Submit a product</Link>
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
            <div className="flex items-center justify-center h-40 border rounded-md">
              <p className="text-muted-foreground">You haven't saved any products yet</p>
            </div>
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
          <div className="flex items-center justify-center h-40 border rounded-md">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
