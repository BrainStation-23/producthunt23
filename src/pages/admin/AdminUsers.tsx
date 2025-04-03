
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import UserFilters from '@/components/admin/UserFilters';
import UsersTable from '@/components/admin/UsersTable';
import UserPagination from '@/components/admin/UserPagination';
import AddUserDialog from '@/components/admin/AddUserDialog';
import UserProfileDialog from '@/components/admin/UserProfileDialog';
import EditUserDialog from '@/components/admin/EditUserDialog';

interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  product_count: number;
}

const AdminUsers: React.FC = () => {
  const {
    users,
    isLoading,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    handleSearch,
    handleRoleChange,
    deleteUser,
    refetch,
  } = useUserManagement();

  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setProfileDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage all users on the platform.</p>
        </div>
        <Button className="sm:w-auto w-full" onClick={() => setAddUserDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <UserFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        handleSearch={handleSearch}
      />
      
      <UsersTable
        users={users}
        isLoading={isLoading}
        searchQuery={searchQuery}
        handleRoleChange={handleRoleChange}
        onViewProfile={handleViewProfile}
        onEditUser={handleEditUser}
        onUserUpdated={refetch}
        deleteUser={deleteUser}
      />
      
      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      <AddUserDialog 
        open={addUserDialogOpen} 
        onOpenChange={setAddUserDialogOpen}
        onUserAdded={refetch}
      />

      <UserProfileDialog
        user={selectedUser}
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        onEditUser={() => {
          setProfileDialogOpen(false);
          setEditDialogOpen(true);
        }}
      />

      <EditUserDialog
        user={selectedUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUserUpdated={refetch}
      />
    </div>
  );
};

export default AdminUsers;
