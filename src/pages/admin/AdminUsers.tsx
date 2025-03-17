
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const AdminUsers: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage all users on the platform.</p>
        </div>
        <Button className="sm:w-auto w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="w-full pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">All</Button>
          <Button variant="outline" size="sm">Active</Button>
          <Button variant="outline" size="sm">Suspended</Button>
          <Button variant="outline" size="sm">Admin</Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>NA</AvatarFallback>
                  </Avatar>
                  <span>No users found</span>
                </div>
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell><Badge variant="outline">-</Badge></TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Users will appear here once Supabase is connected
        </p>
      </div>
    </div>
  );
};

export default AdminUsers;
