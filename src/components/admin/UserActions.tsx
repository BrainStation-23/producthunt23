
import React, { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import UserActionsDropdown from './user-actions/UserActionsDropdown';
import SuspendUserDialog from './user-actions/SuspendUserDialog';
import DeleteUserDialog from './user-actions/DeleteUserDialog';

interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  product_count: number;
}

interface UserActionsProps {
  user: User;
  handleRoleChange: (userId: string, newRole: 'admin' | 'user') => Promise<void>;
  onViewProfile: (user: User) => void;
  onEditUser: (user: User) => void;
  onUserUpdated: () => void;
  deleteUser: (userId: string) => Promise<boolean>;
}

const UserActions: React.FC<UserActionsProps> = ({ 
  user, 
  handleRoleChange, 
  onViewProfile, 
  onEditUser,
  onUserUpdated,
  deleteUser
}) => {
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { session } = useAuth();
  
  const handleSuspendUser = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-suspend-user', {
        body: { user_id: user.id, suspended: true },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (error) throw error;
      
      toast.success(`User ${user.username || user.email} has been suspended`);
      onUserUpdated();
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error(error.message || 'Failed to suspend user');
    } finally {
      setSuspendDialogOpen(false);
    }
  };

  const handleDeleteUserAction = async () => {
    try {
      setIsDeleting(true);
      console.log(`Attempting to delete user ${user.id}`);
      
      const success = await deleteUser(user.id);
      
      if (success) {
        console.log('User deleted successfully');
        setDeleteDialogOpen(false);
      }
    } catch (error: any) {
      console.error('Error in handleDeleteUser:', error);
      toast.error(error?.message || 'Error deleting user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewProfileAction = () => {
    setDropdownOpen(false);
    onViewProfile(user);
  };

  const handleEditUserAction = () => {
    setDropdownOpen(false);
    onEditUser(user);
  };

  const handleRoleChangeAction = async (newRole: 'admin' | 'user') => {
    setDropdownOpen(false);
    await handleRoleChange(user.id, newRole);
  };

  const handleSuspendClick = () => {
    setDropdownOpen(false);
    setSuspendDialogOpen(true);
  };
  
  const handleDeleteClick = () => {
    setDropdownOpen(false);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <UserActionsDropdown
        user={user}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        handleViewProfile={handleViewProfileAction}
        handleEditUser={handleEditUserAction}
        handleRoleChangeAction={handleRoleChangeAction}
        handleSuspendClick={handleSuspendClick}
        handleDeleteClick={handleDeleteClick}
      />

      <SuspendUserDialog
        user={user}
        open={suspendDialogOpen}
        onOpenChange={setSuspendDialogOpen}
        onConfirm={handleSuspendUser}
      />
      
      <DeleteUserDialog
        user={user}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteUserAction}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default UserActions;
