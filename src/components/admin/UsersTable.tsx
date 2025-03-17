
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import UserTableRow from './UserTableRow';

interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  product_count: number;
}

interface UsersTableProps {
  users: User[] | undefined;
  isLoading: boolean;
  searchQuery: string;
  handleRoleChange: (userId: string, newRole: 'admin' | 'user') => Promise<void>;
}

const UsersTable: React.FC<UsersTableProps> = ({ 
  users, 
  isLoading, 
  searchQuery,
  handleRoleChange
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Products</TableHead>
            <TableHead className="hidden md:table-cell">Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-10" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-9 w-20" /></TableCell>
              </TableRow>
            ))
          ) : users && users.length > 0 ? (
            users.map((user) => (
              <UserTableRow 
                key={user.id} 
                user={user} 
                handleRoleChange={handleRoleChange} 
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Search className="h-10 w-10 mb-2 opacity-20" />
                  <p>No users found</p>
                  {searchQuery && (
                    <p className="text-sm">Try adjusting your search query</p>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
