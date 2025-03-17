
import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Shield, ShieldOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserActionsProps {
  userId: string;
  userRole: string;
  handleRoleChange: (userId: string, newRole: 'admin' | 'user') => Promise<void>;
}

const UserActions: React.FC<UserActionsProps> = ({ userId, userRole, handleRoleChange }) => {
  return (
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
        <DropdownMenuItem>View profile</DropdownMenuItem>
        <DropdownMenuItem>Edit user</DropdownMenuItem>
        <DropdownMenuSeparator />
        {userRole === 'admin' ? (
          <DropdownMenuItem onClick={() => handleRoleChange(userId, 'user')}>
            <ShieldOff className="mr-2 h-4 w-4" />
            Remove admin role
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => handleRoleChange(userId, 'admin')}>
            <Shield className="mr-2 h-4 w-4" />
            Make admin
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500">
          Suspend user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActions;
