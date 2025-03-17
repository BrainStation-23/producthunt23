
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FeaturedCategory } from '@/pages/landing/types';
import { Category } from '@/types/product';
import { Plus, Trash, MoveUp, MoveDown, Save, Check, Image } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

// Create a type for the icon names from Lucide
type IconName = keyof typeof LucideIcons;

// Simple component to render a Lucide icon by name
const DynamicIcon = ({ 
  name, 
  className 
}: { 
  name: string | null, 
  className?: string 
}) => {
  if (!name || !(name in LucideIcons)) {
    return <Image className={className || "h-4 w-4"} />;
  }
  
  const IconComponent = LucideIcons[name as IconName];
  return <IconComponent className={className || "h-4 w-4"} />;
};

const IconPicker = ({ value, onChange }: { value: string | null, onChange: (value: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get all icon names from lucide-react
  const iconNames = Object.keys(LucideIcons)
    .filter(key => key !== 'default' && key !== 'createLucideIcon')
    .filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {value && value in LucideIcons ? (
            <>
              <DynamicIcon name={value} className="h-4 w-4 mr-2" />
              <span>{value}</span>
            </>
          ) : (
            <>
              <Image className="h-4 w-4 mr-2" />
              Select icon
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <div className="p-2">
          <Input
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
        </div>
        <ScrollArea className="h-[300px]">
          <div className="grid grid-cols-3 gap-2 p-2">
            {iconNames.map((name) => (
              <Button
                key={name}
                variant="ghost"
                className="flex h-10 w-full items-center justify-start gap-2 px-2"
                onClick={() => {
                  onChange(name);
                }}
              >
                <DynamicIcon name={name} className="h-4 w-4" />
                <span className="text-xs truncate">{name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

// Helper function to generate a slug from a string
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '')  // Remove non-word characters except hyphens
    .replace(/--+/g, '-')     // Replace multiple hyphens with single hyphen
    .trim();
};

const FeaturedCategoriesSettings = () => {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    categoryId: '',
    icon: ''
  });

  // Fetch all available categories
  const { data: availableCategories, isLoading: loadingCategories } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    }
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
    mutationFn: async (category: {
      name: string;
      categoryId: string;
      icon: string;
    }) => {
      // Find the selected category from available categories
      const selectedCategory = availableCategories?.find(c => c.id === category.categoryId);
      if (!selectedCategory) {
        throw new Error('Selected category not found');
      }
      
      // Calculate max display order
      const maxOrder = categories && categories.length > 0 
        ? Math.max(...categories.map(c => c.display_order)) 
        : 0;
      
      // Generate slug from name
      const slug = generateSlug(category.name);
      
      const { data, error } = await supabase
        .from('featured_categories')
        .insert({
          name: category.name,
          slug: slug,
          icon: category.icon || null,
          display_order: maxOrder + 1
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredCategories'] });
      setNewCategory({ name: '', categoryId: '', icon: '' });
      toast.success('Category added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add category: ' + error.message);
    }
  });

  // Update category
  const updateCategory = useMutation({
    mutationFn: async (category: FeaturedCategory) => {
      // Generate a new slug if name was updated
      const originalCategory = categories?.find(c => c.id === category.id);
      const updatedData: Partial<FeaturedCategory> = {
        name: category.name,
        icon: category.icon
      };
      
      // Update slug if name changed
      if (originalCategory && originalCategory.name !== category.name) {
        updatedData.slug = generateSlug(category.name);
      }
      
      const { data, error } = await supabase
        .from('featured_categories')
        .update(updatedData)
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
        <h3 className="font-medium mb-3">Add New Featured Category</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!newCategory.name || !newCategory.categoryId) {
            toast.error('Name and category selection are required');
            return;
          }
          addCategory.mutate(newCategory);
        }} className="grid gap-4 md:grid-cols-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium">Display Name</label>
            <Input
              id="name"
              name="name"
              value={newCategory.name}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Display name"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <Select 
              value={newCategory.categoryId} 
              onValueChange={(value) => setNewCategory(prev => ({ ...prev, categoryId: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {loadingCategories ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : availableCategories?.length === 0 ? (
                  <SelectItem value="empty" disabled>No categories available</SelectItem>
                ) : (
                  availableCategories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="icon" className="text-sm font-medium">Icon</label>
            <IconPicker 
              value={newCategory.icon} 
              onChange={(value) => setNewCategory(prev => ({ ...prev, icon: value }))}
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
        <h3 className="font-medium mb-3">Existing Featured Categories</h3>
        {isLoading ? (
          <div className="text-center py-4">Loading categories...</div>
        ) : !categories || categories.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No featured categories found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Display Name</TableHead>
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
                    {category.slug}
                  </TableCell>
                  <TableCell>
                    {editMode === `${category.id}-icon` ? (
                      <div className="flex space-x-2">
                        <div className="w-full">
                          <IconPicker
                            value={category.icon}
                            onChange={(value) => {
                              const updatedCategories = categories.map(c => 
                                c.id === category.id ? { ...c, icon: value } : c
                              );
                              queryClient.setQueryData(['featuredCategories'], updatedCategories);
                            }}
                          />
                        </div>
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
                        className="cursor-pointer hover:underline flex items-center"
                        onClick={() => setEditMode(`${category.id}-icon`)}
                      >
                        {category.icon ? (
                          <>
                            <DynamicIcon name={category.icon} className="h-4 w-4 mr-2" />
                            <span>{category.icon}</span>
                          </>
                        ) : (
                          'No icon'
                        )}
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
