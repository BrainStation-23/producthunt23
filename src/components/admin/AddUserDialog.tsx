
import React from 'react';
import UserFormDialog from './UserFormDialog';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ 
  open, 
  onOpenChange, 
  onUserAdded 
}) => {
  return (
    <UserFormDialog
      isEditing={false}
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onUserAdded}
      title="Add New User"
      description="Create a new user account. The user will be able to log in immediately."
    />
  );
};

export default AddUserDialog;
