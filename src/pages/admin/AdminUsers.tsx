
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, MoreHorizontal, Shield, ShieldOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  product_count: number;
}

const ITEMS_PER_PAGE = 10;

const AdminUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      // First get users from auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers({
        page: currentPage,
        perPage: ITEMS_PER_PAGE
      });

      if (authError) throw authError;

      if (!authUsers || !authUsers.users) {
        return [];
      }

      // Extract user IDs to fetch profiles and roles
      const userIds = authUsers.users.map(user => user.id);
      
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .in('user_id', userIds);

      if (rolesError) throw rolesError;

      // Count products by user - use count aggregation differently
      const { data: productCounts, error: productsError } = await supabase
        .from('products')
        .select('created_by, count(*)')
        .in('created_by', userIds)
        .groupBy('created_by');

      if (productsError) throw productsError;

      // Combine data
      const users: User[] = authUsers.users.map(authUser => {
        const profile = profiles?.find(p => p.id === authUser.id);
        const role = userRoles?.find(r => r.user_id === authUser.id)?.role || 'user';
        const productCount = productCounts?.find(p => p.created_by === authUser.id)?.count || 0;
        
        return {
          id: authUser.id,
          email: authUser.email || '',
          username: profile?.username || authUser.email?.split('@')[0] || 'User',
          avatar_url: profile?.avatar_url,
          role: role,
          created_at: authUser.created_at,
          product_count: parseInt(productCount as any, 10)
        };
      });

      // Filter by search query if provided
      let filteredUsers = users;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredUsers = users.filter(user => 
          user.username?.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
        );
      }

      // Filter by role if provided
      if (roleFilter) {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
      }

      // Calculate total pages
      setTotalPages(Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));

      return filteredUsers;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['adminUsers', searchQuery, roleFilter, currentPage],
    queryFn: fetchUsers
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      // Check if user already has a role entry
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let updateError;

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', userId);
        
        updateError = error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: newRole });
        
        updateError = error;
      }

      if (updateError) throw updateError;
      
      toast.success(`User role updated to ${newRole}`);
      refetch();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

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
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={roleFilter === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setRoleFilter(null)}
          >
            All
          </Button>
          <Button 
            variant={roleFilter === "user" ? "default" : "outline"} 
            size="sm"
            onClick={() => setRoleFilter("user")}
          >
            Users
          </Button>
          <Button 
            variant={roleFilter === "admin" ? "default" : "outline"} 
            size="sm"
            onClick={() => setRoleFilter("admin")}
          >
            Admins
          </Button>
        </div>
      </div>
      
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
                        <DropdownMenuItem className="text-red-500">
                          Suspend user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
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
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default AdminUsers;
