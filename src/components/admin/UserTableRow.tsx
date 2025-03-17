
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserActions from './UserActions';

interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  product_count: number;
}

interface UserTableRowProps {
  user: User;
  handleRoleChange: (userId: string, newRole: 'admin' | 'user') => Promise<void>;
}

const UserTableRow: React.FC<UserTableRowProps> = ({ user, handleRoleChange }) => {
  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            {user.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={user.username || ''} />
            ) : null}
            <AvatarFallback>
              {(user.username ? user.username[0] : user.email[0]).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.username || 'No username'}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
          {user.role}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge variant="outline" className="text-green-500 bg-green-50">
          Active
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{user.product_count}</TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <UserActions 
          userId={user.id} 
          userRole={user.role} 
          handleRoleChange={handleRoleChange} 
        />
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
