
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/components/admin/settings/categories/types';

interface CategorySelectorProps {
  selected: string[];
  onSelect: (categories: string[]) => void;
}

// Local type that matches the query response
interface CategoryItem {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selected, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, status')
          .eq('status', 'active')
          .order('name');
        
        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }
        
        setCategories(data || []);
      } catch (error) {
        console.error('Unexpected error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCategory = (categoryId: string) => {
    if (selected.includes(categoryId)) {
      onSelect(selected.filter(id => id !== categoryId));
    } else {
      onSelect([...selected, categoryId]);
    }
  };

  const removeCategory = (categoryId: string) => {
    onSelect(selected.filter(id => id !== categoryId));
  };

  const getCategoryNameById = (id: string): string => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : id;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selected.length === 0 ? (
          <p className="text-muted-foreground">No categories selected</p>
        ) : (
          selected.map(categoryId => (
            <Badge key={categoryId} variant="secondary" className="flex items-center gap-2 pr-1 py-1">
              {getCategoryNameById(categoryId)}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 rounded-full" 
                onClick={() => removeCategory(categoryId)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" type="button" disabled={isLoading}>
            {isLoading ? 'Loading Categories...' : 'Select Categories'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Categories</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Search categories..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <ScrollArea className="h-[300px] pr-4">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <p>Loading categories...</p>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="flex justify-center py-4">
                  <p>No categories found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCategories.map(category => (
                    <div 
                      key={category.id} 
                      className={`
                        flex items-center justify-between p-2 rounded-md cursor-pointer
                        ${selected.includes(category.id) ? 'bg-primary/10' : 'hover:bg-muted'}
                      `}
                      onClick={() => toggleCategory(category.id)}
                    >
                      <span>{category.name}</span>
                      {selected.includes(category.id) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategorySelector;
