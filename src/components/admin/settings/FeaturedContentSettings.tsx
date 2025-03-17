
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogClose 
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Plus, ArrowUp, ArrowDown, X } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types/product';

interface FeaturedProduct {
  id: string;
  product_id: string;
  display_order: number;
  created_at: string;
  product?: Product;
}

const FeaturedContentSettings: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  // Fetch featured products
  const { 
    data: featuredProducts = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      // First get the featured products
      const { data: featuredData, error: featuredError } = await supabase
        .from('featured_products')
        .select('*')
        .order('display_order');
      
      if (featuredError) {
        console.error('Error fetching featured products:', featuredError);
        toast.error('Failed to load featured products');
        throw featuredError;
      }

      // Get the associated product details
      const featuredProductIds = featuredData.map(item => item.product_id);
      
      if (featuredProductIds.length === 0) {
        return [];
      }

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', featuredProductIds);
      
      if (productsError) {
        console.error('Error fetching product details:', productsError);
        toast.error('Failed to load product details');
        throw productsError;
      }

      // Combine the data
      const result = featuredData.map(featured => {
        const product = productsData.find(p => p.id === featured.product_id);
        return {
          ...featured,
          product
        };
      });
      
      return result as FeaturedProduct[];
    }
  });

  // Fetch available products for adding to featured
  const searchProducts = async (searchTerm: string) => {
    try {
      // Get the current featured product IDs
      const featuredIds = featuredProducts.map(item => item.product_id);
      
      // Filter out products that are already featured
      const { data, error } = await supabase
        .from('products')
        .select('*')  // Select all fields to match the Product type
        .eq('status', 'approved')
        .not('id', 'in', featuredIds.length > 0 ? `(${featuredIds.join(',')})` : '()')
        .ilike('name', `%${searchTerm}%`)
        .limit(10);
      
      if (error) throw error;
      
      // Ensure we have a valid Product type array
      setAvailableProducts(data || []);
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Failed to search products');
    }
  };

  // Handle product search for dialog
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.length >= 2) {
      searchProducts(value);
    } else {
      setAvailableProducts([]);
    }
  };

  // Add a product to featured
  const addFeaturedProduct = async () => {
    if (!selectedProductId) {
      toast.error('Please select a product');
      return;
    }

    try {
      // Get the highest current display order
      const maxOrder = featuredProducts.length > 0 
        ? Math.max(...featuredProducts.map(item => item.display_order))
        : 0;

      const { error } = await supabase
        .from('featured_products')
        .insert([{
          product_id: selectedProductId,
          display_order: maxOrder + 1
        }]);
      
      if (error) throw error;
      
      toast.success('Product added to featured');
      setIsAddDialogOpen(false);
      setSelectedProductId(null);
      setSearchTerm('');
      setAvailableProducts([]);
      refetch();
    } catch (error) {
      console.error('Error adding featured product:', error);
      toast.error('Failed to add featured product');
    }
  };

  // Remove from featured
  const removeFeaturedProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('featured_products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Product removed from featured');
      refetch();
    } catch (error) {
      console.error('Error removing featured product:', error);
      toast.error('Failed to remove featured product');
    }
  };

  // Change display order
  const changeDisplayOrder = async (id: string, currentOrder: number, direction: 'up' | 'down') => {
    try {
      // Find the product to swap with
      const sortedProducts = [...featuredProducts].sort((a, b) => a.display_order - b.display_order);
      const currentIndex = sortedProducts.findIndex(p => p.id === id);
      
      if (
        (direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === sortedProducts.length - 1)
      ) {
        return; // Already at top or bottom
      }
      
      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const productToSwap = sortedProducts[swapIndex];
      
      // Perform the swap
      const batch = [];
      
      batch.push(
        supabase
          .from('featured_products')
          .update({ display_order: productToSwap.display_order })
          .eq('id', id)
      );
      
      batch.push(
        supabase
          .from('featured_products')
          .update({ display_order: currentOrder })
          .eq('id', productToSwap.id)
      );
      
      await Promise.all(batch);
      
      toast.success('Display order updated');
      refetch();
    } catch (error) {
      console.error('Error changing display order:', error);
      toast.error('Failed to update display order');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground">
            Manage products that appear in the featured section.
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Featured Product
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Added On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Loading featured products...
                </TableCell>
              </TableRow>
            ) : featuredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No featured products found
                </TableCell>
              </TableRow>
            ) : (
              [...featuredProducts]
                .sort((a, b) => a.display_order - b.display_order)
                .map((featured) => (
                  <TableRow key={featured.id}>
                    <TableCell className="font-medium">
                      {featured.display_order}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {featured.product?.image_url && (
                          <img
                            src={featured.product.image_url}
                            alt={featured.product?.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{featured.product?.name || 'Unknown Product'}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                            {featured.product?.tagline}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(featured.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => changeDisplayOrder(featured.id, featured.display_order, 'up')}
                          disabled={featured.display_order === 1}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => changeDisplayOrder(featured.id, featured.display_order, 'down')}
                          disabled={featured.display_order === featuredProducts.length}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFeaturedProduct(featured.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Featured Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Featured Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="productSearch">Search Products</Label>
              <Input
                id="productSearch"
                placeholder="Type to search products..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            
            <div className="max-h-72 overflow-auto border rounded-md divide-y">
              {availableProducts.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  {searchTerm.length < 2 
                    ? 'Type at least 2 characters to search' 
                    : 'No products found'}
                </div>
              ) : (
                availableProducts.map(product => (
                  <div 
                    key={product.id}
                    className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-muted transition-colors ${
                      selectedProductId === product.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedProductId(product.id)}
                  >
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                        {product.tagline}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={addFeaturedProduct} disabled={!selectedProductId}>Add to Featured</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeaturedContentSettings;
