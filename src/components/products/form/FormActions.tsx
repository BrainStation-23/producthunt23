
import React from 'react';
import { Button } from '@/components/ui/button';
import { ProductFormValues } from '@/types/product';
import { Save, Send, Eye } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
  onSaveAsDraft: () => void;
  onPreview: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isSubmitting, 
  onSaveAsDraft,
  onPreview 
}) => {
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
      <Button 
        type="button" 
        variant="outline" 
        onClick={onSaveAsDraft}
        disabled={isSubmitting}
      >
        <Save className="mr-2 h-4 w-4" />
        Save as Draft
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        <Send className="mr-2 h-4 w-4" />
        Submit for Review
      </Button>
    </div>
  );
};

export default FormActions;
