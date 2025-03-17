
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import UserFilters from '@/components/admin/UserFilters';
import UsersTable from '@/components/admin/UsersTable';
import UserPagination from '@/components/admin/UserPagination';

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
  } = useUserManagement();

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
      />
      
      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default AdminUsers;
