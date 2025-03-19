
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Shield, ShieldOff, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
}

const UserActions: React.FC<UserActionsProps> = ({ 
  user, 
  handleRoleChange, 
  onViewProfile, 
  onEditUser,
  onUserUpdated
}) => {
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const { session } = useAuth();
  
  const handleSuspendUser = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-user-management', {
        body: {
          action: 'suspend_user',
          data: { user_id: user.id, suspended: true }
        },
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onViewProfile(user)}>
            View profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEditUser(user)}>
            Edit user
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {user.role === 'admin' ? (
            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'user')}>
              <ShieldOff className="mr-2 h-4 w-4" />
              Remove admin role
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')}>
              <Shield className="mr-2 h-4 w-4" />
              Make admin
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-500"
            onClick={() => setSuspendDialogOpen(true)}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Suspend user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
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
              onClick={handleSuspendUser}
              className="bg-red-500 hover:bg-red-600"
            >
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserActions;
