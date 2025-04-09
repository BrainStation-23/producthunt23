import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Shield, ShieldOff, AlertTriangle, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  product_count: number;
}

interface UserActionsDropdownProps {
  user: User;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  handleViewProfile: () => void;
  handleEditUser: () => void;
  handleRoleChangeAction: (newRole: 'admin' | 'user' | 'judge') => Promise<void>;
  handleSuspendClick: () => void;
  handleDeleteClick: () => void;
}

const UserActionsDropdown: React.FC<UserActionsDropdownProps> = ({
  user,
  dropdownOpen,
  setDropdownOpen,
  handleViewProfile,
  handleEditUser,
  handleRoleChangeAction,
  handleSuspendClick,
  handleDeleteClick,
}) => {
  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleViewProfile}>
          View profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditUser}>
          Edit user
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {user.role === 'admin' ? (
          <>
            <DropdownMenuItem onClick={() => handleRoleChangeAction('user')}>
              <ShieldOff className="mr-2 h-4 w-4" />
              Remove admin role
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleChangeAction('judge')}>
              <Shield className="mr-2 h-4 w-4" />
              Make judge
            </DropdownMenuItem>
          </>
        ) : user.role === 'judge' ? (
          <>
            <DropdownMenuItem onClick={() => handleRoleChangeAction('user')}>
              <ShieldOff className="mr-2 h-4 w-4" />
              Remove judge role
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleChangeAction('admin')}>
              <Shield className="mr-2 h-4 w-4" />
              Make admin
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => handleRoleChangeAction('admin')}>
              <Shield className="mr-2 h-4 w-4" />
              Make admin
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleChangeAction('judge')}>
              <Shield className="mr-2 h-4 w-4" />
              Make judge
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-500"
          onClick={handleSuspendClick}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Suspend user
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-500"
          onClick={handleDeleteClick}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionsDropdown;
