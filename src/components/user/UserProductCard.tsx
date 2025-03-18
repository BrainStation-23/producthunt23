
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash, ExternalLink, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import DeleteProductDialog from '@/components/user/DeleteProductDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ProductStatusBadge from '@/components/admin/ProductStatusBadge';

interface UserProductCardProps {
  product: {
    id: string;
    name: string;
    tagline: string;
    image_url: string | null;
    status: string;
    created_at: string;
    created_by: string;
    rejection_feedback?: string | null;
    isCreator?: boolean;
  };
}

const UserProductCard: React.FC<UserProductCardProps> = ({ product }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;
      toast.success('Product deleted successfully');
      setIsDeleteDialogOpen(false);
      // Ideally we would update the products list here
      // but we'll rely on the parent component's re-fetch for simplicity
      window.location.reload();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const isCreator = product.isCreator !== false; // Default to true if property is missing

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="truncate">{product.name}</CardTitle>
            <ProductStatusBadge 
              status={product.status || 'pending'} 
              rejectionFeedback={product.rejection_feedback}
            />
          </div>
          <p className="text-sm text-muted-foreground truncate">{product.tagline}</p>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="aspect-video bg-muted rounded-md overflow-hidden mb-3">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-muted">
                <p className="text-muted-foreground">No image</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 justify-between">
            <span className="text-xs text-muted-foreground">
              Created {new Date(product.created_at).toLocaleDateString()}
            </span>
            {!isCreator && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                Maker
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/products/edit/${product.id}`}>
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit
              </Link>
            </Button>
            {isCreator && (
              <Button variant="outline" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {product.status === 'approved' && (
              <Button variant="outline" size="sm" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  View
                </a>
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/products/${product.id}`}>
                <Eye className="h-3.5 w-3.5 mr-1" />
                Preview
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <DeleteProductDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default UserProductCard;
