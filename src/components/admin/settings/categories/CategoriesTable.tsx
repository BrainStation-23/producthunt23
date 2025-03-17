
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Check, X, Pencil } from 'lucide-react';
import { Category } from './types';

interface CategoriesTableProps {
  categories: Category[];
  isLoading: boolean;
  searchTerm: string;
  toggleCategoryStatus: (category: Category) => void;
  toggleCategoryFeatured: (category: Category) => void;
  openEditSheet: (category: Category) => void;
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  isLoading,
  searchTerm,
  toggleCategoryStatus,
  toggleCategoryFeatured,
  openEditSheet
}) => {
  // Filtered categories based on search
  const filteredCategories = categories.filter(
    category => category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                Loading categories...
              </TableCell>
            </TableRow>
          ) : filteredCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                {searchTerm ? 'No categories found for your search' : 'No categories found'}
              </TableCell>
            </TableRow>
          ) : (
            filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <Button
                    variant={category.status === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleCategoryStatus(category)}
                    className={
                      category.status === 'active' 
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'text-muted-foreground'
                    }
                  >
                    {category.status === 'active' ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <X className="h-4 w-4 mr-1" />
                    )}
                    {category.status === 'active' ? 'Active' : 'Inactive'}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant={category.is_featured ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleCategoryFeatured(category)}
                    className={
                      category.is_featured 
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'text-muted-foreground'
                    }
                  >
                    {category.is_featured ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <X className="h-4 w-4 mr-1" />
                    )}
                    {category.is_featured ? 'Featured' : 'Not Featured'}
                  </Button>
                </TableCell>
                <TableCell>
                  {new Date(category.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditSheet(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoriesTable;
