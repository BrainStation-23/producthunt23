
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useProductSave } from '@/hooks/useProductSave';

interface ProductSaveButtonProps {
  productId: string;
  variant?: "ghost" | "outline" | "default";
  iconOnly?: boolean;
}

const ProductSaveButton: React.FC<ProductSaveButtonProps> = ({ 
  productId, 
  variant = "ghost",
  iconOnly = false 
}) => {
  const { isSaved, isLoading, toggleSave } = useProductSave({ productId });

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSave();
      }}
      disabled={isLoading}
      className={`gap-1 ${iconOnly ? 'px-2' : ''}`}
      title={isSaved ? "Unsave product" : "Save product"}
    >
      {isSaved ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {!iconOnly && (isSaved ? "Saved" : "Save")}
    </Button>
  );
};

export default ProductSaveButton;
