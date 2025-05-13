
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProductSelector } from './ProductSelector';
import ProductJudgeStatus from '../status/ProductJudgeStatus';

interface AssignmentHeaderProps {
  products: any[] | null;
  selectedProduct: string | null;
  onProductChange: (productId: string) => void;
  onAssignClick: () => void;
  isLoading: boolean;
  productStatus: { isAssigned: boolean; isJudged: boolean } | null;
}

export const AssignmentHeader: React.FC<AssignmentHeaderProps> = ({
  products,
  selectedProduct,
  onProductChange,
  onAssignClick,
  isLoading,
  productStatus
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:items-center">
      <ProductSelector 
        products={products}
        selectedProduct={selectedProduct}
        onProductChange={onProductChange}
        isLoading={isLoading}
      />

      {selectedProduct && productStatus && (
        <ProductJudgeStatus {...productStatus} />
      )}
      
      <Button 
        onClick={onAssignClick}
        disabled={!selectedProduct || isLoading}
        className="sm:ml-auto"
      >
        <Plus className="h-4 w-4 mr-2" />
        Assign Judge
      </Button>
    </div>
  );
};
