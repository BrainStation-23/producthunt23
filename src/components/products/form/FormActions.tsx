
import React from 'react';
import { Button } from '@/components/ui/button';
import { ProductFormValues } from '@/types/product';
import { Save, Send, Eye, Edit } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
  onSaveAsDraft: () => void;
  onPreview: () => void;
  mode?: 'create' | 'edit';
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isSubmitting, 
  onSaveAsDraft,
  onPreview,
  mode = 'create'
}) => {
  const isEditing = mode === 'edit';

  return (
    <div className="flex gap-4 justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={onPreview}
        disabled={isSubmitting}
      >
        <Eye className="mr-2 h-4 w-4" />
        Preview
      </Button>
      
      {!isEditing && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSaveAsDraft}
          disabled={isSubmitting}
        >
          <Save className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
      )}
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isEditing ? (
          <>
            <Edit className="mr-2 h-4 w-4" />
            Update Product
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Submit for Review
          </>
        )}
      </Button>
    </div>
  );
};

export default FormActions;
