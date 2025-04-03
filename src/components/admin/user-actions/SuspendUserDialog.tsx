
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface User {
  id: string;
  email: string;
  username: string | null;
}

interface SuspendUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const SuspendUserDialog: React.FC<SuspendUserDialogProps> = ({
  user,
  open,
  onOpenChange,
  onConfirm,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suspend User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to suspend {user.username || user.email}? 
            They will not be able to log in until the account is reactivated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600"
          >
            Suspend
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SuspendUserDialog;
