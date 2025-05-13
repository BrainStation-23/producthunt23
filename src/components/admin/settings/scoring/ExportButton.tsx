
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';

interface ExportButtonProps {
  onClick: () => void;
  isDisabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  onClick,
  isDisabled = false
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={isDisabled}
      className="flex items-center gap-2 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
    >
      <FileSpreadsheet className="h-4 w-4" />
      Export Excel
    </Button>
  );
};
