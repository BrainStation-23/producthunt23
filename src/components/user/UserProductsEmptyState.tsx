
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const UserProductsEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border rounded-lg text-center bg-muted/10">
      <div className="mb-4 p-3 rounded-full bg-muted">
        <Plus className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No products yet</h3>
      <p className="text-muted-foreground mb-4 max-w-md">
        You haven't submitted any products yet. Get started by creating your first product listing.
      </p>
      <Button asChild>
        <Link to="/user/products/submit">
          <Plus className="mr-2 h-4 w-4" />
          Submit a Product
        </Link>
      </Button>
    </div>
  );
};

export default UserProductsEmptyState;
