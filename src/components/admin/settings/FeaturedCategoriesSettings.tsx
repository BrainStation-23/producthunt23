
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FeaturedCategory } from '@/pages/landing/types';
import { Plus, Trash, MoveUp, MoveDown, Save } from 'lucide-react';
import { toast } from 'sonner';

const FeaturedCategoriesSettings = () => {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    icon: ''
  });

  // Fetch featured categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['featuredCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_categories')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as FeaturedCategory[];
    }
  });

  // Add new category
  const addCategory = useMutation({
    mutationFn: async (category: Omit<FeaturedCategory, 'id' | 'display_order' | 'created_at'>) => {
      // Calculate max display order
      const maxOrder = categories && categories.length > 0 
        ? Math.max(...categories.map(c => c.display_order)) 
        : 0;
      
      const { data, error } = await supabase
        .from('featured_categories')
        .insert({
          name: category.name,
          slug: category.slug,
          icon: category.icon || null,
          display_order: maxOrder + 1
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredCategories'] });
      setNewCategory({ name: '', slug: '', icon: '' });
      toast.success('Category added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add category: ' + error.message);
    }
  });

  // Update category
  const updateCategory = useMutation({
    mutationFn: async (category: FeaturedCategory) => {
      const { data, error } = await supabase
        .from('featured_categories')
        .update({
          name: category.name,
          slug: category.slug,
          icon: category.icon
        })
        .eq('id', category.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredCategories'] });
      setEditMode(null);
      toast.success('Category updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update category: ' + error.message);
    }
  });

  // Delete category
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('featured_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredCategories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete category: ' + error.message);
    }
  });

  // Reorder category
  const reorderCategory = useMutation({
    mutationFn: async ({ id, direction }: { id: string, direction: 'up' | 'down' }) => {
      if (!categories) return;
      
      const currentIndex = categories.findIndex(c => c.id === id);
      if (currentIndex === -1) return;
      
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= categories.length) return;
      
      const currentCategory = categories[currentIndex];
      const targetCategory = categories[targetIndex];
      
      // Swap display_order values
      const updates = [
        {
          id: currentCategory.id,
          display_order: targetCategory.display_order
        },
        {
          id: targetCategory.id,
          display_order: currentCategory.display_order
        }
      ];
      
      // Update both categories in transaction
      for (const update of updates) {
        const { error } = await supabase
          .from('featured_categories')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredCategories'] });
    },
    onError: (error) => {
      toast.error('Failed to reorder categories: ' + error.message);
    }
  });

  // Handle input changes for new category
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for new category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) {
      toast.error('Name and slug are required');
      return;
    }
    addCategory.mutate(newCategory);
  };

  // Handle category update
  const handleUpdateCategory = (id: string, field: string, value: string) => {
    if (!categories) return;
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    const updatedCategory = { ...category, [field]: value };
    updateCategory.mutate(updatedCategory);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Featured Categories</h2>
        <p className="text-muted-foreground">
          Manage featured categories that appear on the landing page.
        </p>
      </div>

      {/* Add new category form */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-medium mb-3">Add New Category</h3>
        <form onSubmit={handleAddCategory} className="grid gap-4 md:grid-cols-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input
              id="name"
              name="name"
              value={newCategory.name}
              onChange={handleInputChange}
              placeholder="Category name"
              required
            />
          </div>
          <div>
            <label htmlFor="slug" className="text-sm font-medium">Slug</label>
            <Input
              id="slug"
              name="slug"
              value={newCategory.slug}
              onChange={handleInputChange}
              placeholder="category-slug"
              required
            />
          </div>
          <div>
            <label htmlFor="icon" className="text-sm font-medium">Icon (optional)</label>
            <Input
              id="icon"
              name="icon"
              value={newCategory.icon}
              onChange={handleInputChange}
              placeholder="Icon name or URL"
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full" disabled={addCategory.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </form>
      </div>

      {/* Categories table */}
      <div>
        <h3 className="font-medium mb-3">Existing Categories</h3>
        {isLoading ? (
          <div className="text-center py-4">Loading categories...</div>
        ) : !categories || categories.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No categories found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    {category.display_order}
                    <div className="flex space-x-1 mt-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => reorderCategory.mutate({ id: category.id, direction: 'up' })}
                        disabled={category === categories[0]}
                      >
                        <MoveUp className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => reorderCategory.mutate({ id: category.id, direction: 'down' })}
                        disabled={category === categories[categories.length - 1]}
                      >
                        <MoveDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {editMode === `${category.id}-name` ? (
                      <div className="flex space-x-2">
                        <Input 
                          value={category.name}
                          onChange={(e) => {
                            const updatedCategories = categories.map(c => 
                              c.id === category.id ? { ...c, name: e.target.value } : c
                            );
                            queryClient.setQueryData(['featuredCategories'], updatedCategories);
                          }}
                          className="h-8"
                        />
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleUpdateCategory(category.id, 'name', category.name)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="cursor-pointer hover:underline" 
                        onClick={() => setEditMode(`${category.id}-name`)}
                      >
                        {category.name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode === `${category.id}-slug` ? (
                      <div className="flex space-x-2">
                        <Input 
                          value={category.slug}
                          onChange={(e) => {
                            const updatedCategories = categories.map(c => 
                              c.id === category.id ? { ...c, slug: e.target.value } : c
                            );
                            queryClient.setQueryData(['featuredCategories'], updatedCategories);
                          }}
                          className="h-8"
                        />
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleUpdateCategory(category.id, 'slug', category.slug)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="cursor-pointer hover:underline" 
                        onClick={() => setEditMode(`${category.id}-slug`)}
                      >
                        {category.slug}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode === `${category.id}-icon` ? (
                      <div className="flex space-x-2">
                        <Input 
                          value={category.icon || ''}
                          onChange={(e) => {
                            const updatedCategories = categories.map(c => 
                              c.id === category.id ? { ...c, icon: e.target.value } : c
                            );
                            queryClient.setQueryData(['featuredCategories'], updatedCategories);
                          }}
                          className="h-8"
                        />
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleUpdateCategory(category.id, 'icon', category.icon || '')}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="cursor-pointer hover:underline" 
                        onClick={() => setEditMode(`${category.id}-icon`)}
                      >
                        {category.icon || '-'}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteCategory.mutate(category.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default FeaturedCategoriesSettings;
