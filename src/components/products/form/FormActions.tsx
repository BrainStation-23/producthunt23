
import React from 'react';
import { Button } from '@/components/ui/button';
import { ProductFormValues } from '@/types/product';
import { Save, Send, Eye, Edit, CheckCircle } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
  onSaveAsDraft: () => void;
  onPreview: () => void;
  onSubmitForReview?: () => void;
  mode?: 'create' | 'edit';
  status?: string;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isSubmitting, 
  onSaveAsDraft,
  onPreview,
  onSubmitForReview,
  mode = 'create',
  status
}) => {
  const isEditing = mode === 'edit';
  const canSubmitForReview = status === 'draft' || status === 'rejected';

  return (
    <div className="flex flex-wrap gap-4 justify-end">
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
      
      {isEditing && canSubmitForReview && onSubmitForReview && (
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onSubmitForReview}
          disabled={isSubmitting}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Submit for Review
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
