
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface ExportCsvButtonProps {
  onClick: () => void;
  isDisabled?: boolean;
}

export const ExportCsvButton: React.FC<ExportCsvButtonProps> = ({ 
  onClick,
  isDisabled = false
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={isDisabled}
      className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
    >
      <FileText className="h-4 w-4" />
      Export CSV
    </Button>
  );
};
