
import React from 'react';
import { Button } from '@/components/ui/button';
import { ProductFormValues } from '@/types/product';

interface FormActionsProps {
  isSubmitting: boolean;
  onSaveAsDraft: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ isSubmitting, onSaveAsDraft }) => {
  return (
    <div className="flex gap-4 justify-end">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onSaveAsDraft}
        disabled={isSubmitting}
      >
        Save as Draft
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        Submit for Review
      </Button>
    </div>
  );
};

export default FormActions;
