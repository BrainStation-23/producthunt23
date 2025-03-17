
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCategoriesOperations } from './categories/useCategoriesOperations';
import CategoriesTable from './categories/CategoriesTable';
import CategorySearch from './categories/CategorySearch';
import AddCategoryDialog from './categories/AddCategoryDialog';
import EditCategorySheet from './categories/EditCategorySheet';

const CategoriesSettings: React.FC = () => {
  const {
    categories,
    isLoading,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditSheetOpen,
    setIsEditSheetOpen,
    newCategoryName,
    setNewCategoryName,
    editingCategory,
    editName,
    setEditName,
    isFeatured,
    setIsFeatured,
    handleAddCategory,
    handleUpdateCategory,
    toggleCategoryFeatured,
    toggleCategoryStatus,
    openEditSheet
  } = useCategoriesOperations();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Categories Management</h2>
          <p className="text-muted-foreground">Manage product categories and their status.</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <CategorySearch 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />

      <CategoriesTable 
        categories={categories}
        isLoading={isLoading}
        searchTerm={searchTerm}
        toggleCategoryStatus={toggleCategoryStatus}
        toggleCategoryFeatured={toggleCategoryFeatured}
        openEditSheet={openEditSheet}
      />

      <AddCategoryDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        handleAddCategory={handleAddCategory}
      />

      <EditCategorySheet 
        isOpen={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        editingCategory={editingCategory}
        editName={editName}
        setEditName={setEditName}
        isFeatured={isFeatured}
        setIsFeatured={setIsFeatured}
        handleUpdateCategory={handleUpdateCategory}
        toggleCategoryStatus={toggleCategoryStatus}
      />
    </div>
  );
};

export default CategoriesSettings;
