
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from '@/components/ui/sheet';
import { Category } from './types';

interface EditCategorySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: Category | null;
  editName: string;
  setEditName: (name: string) => void;
  isFeatured: boolean;
  setIsFeatured: (featured: boolean) => void;
  handleUpdateCategory: () => void;
  toggleCategoryStatus: (category: Category) => void;
}

const EditCategorySheet: React.FC<EditCategorySheetProps> = ({
  isOpen,
  onOpenChange,
  editingCategory,
  editName,
  setEditName,
  isFeatured,
  setIsFeatured,
  handleUpdateCategory,
  toggleCategoryStatus
}) => {
  if (!editingCategory) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Category</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editCategoryName">Category Name</Label>
            <Input
              id="editCategoryName"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isFeatured" 
                checked={isFeatured}
                onCheckedChange={(checked) => setIsFeatured(!!checked)}
              />
              <Label htmlFor="isFeatured">Featured Category</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Featured categories will appear on the landing page.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm ${
                editingCategory.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {editingCategory.status === 'active' ? 'Active' : 'Inactive'}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toggleCategoryStatus(editingCategory)}
              >
                Toggle Status
              </Button>
            </div>
          </div>
        </div>
        <SheetFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateCategory}>
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditCategorySheet;
