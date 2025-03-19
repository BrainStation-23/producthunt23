
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  product_count: number;
}

interface UserProfileDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditUser: () => void;
}

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  user,
  open,
  onOpenChange,
  onEditUser,
}) => {
  if (!user) return null;

  const handleEditClick = () => {
    onOpenChange(false); // Close this dialog first
    setTimeout(() => {
      onEditUser(); // Then open the edit dialog
    }, 100); // Small delay to ensure proper state transition
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Detailed information about this user.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-24 w-24">
            {user.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={user.username || ''} />
            ) : null}
            <AvatarFallback className="text-xl">
              {(user.username ? user.username[0] : user.email[0]).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-medium">{user.username || 'No username'}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-2">
              <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                {user.role}
              </Badge>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">User ID:</span>
            <span className="font-mono text-xs truncate max-w-[200px]">{user.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Joined:</span>
            <span>{formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Products:</span>
            <span>{user.product_count}</span>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={handleEditClick}>
            Edit User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
