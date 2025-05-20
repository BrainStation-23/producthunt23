
import React from 'react';
import UserFormDialog from './UserFormDialog';

interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  product_count: number;
  website?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  github?: string | null;
}

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  user,
  open,
  onOpenChange,
  onUserUpdated,
}) => {
  if (!user) return null;
  
  return (
    <UserFormDialog
      isEditing={true}
      user={user}
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onUserUpdated}
      title="Edit User"
      description="Update user information, access level, and social profiles."
    />
  );
};

export default EditUserDialog;
