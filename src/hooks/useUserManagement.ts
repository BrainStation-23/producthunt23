
import { useUserFilters } from './user-management/useUserFilters';
import { useUserFetch } from './user-management/useUserFetch';
import { useUserExport } from './user-management/useUserExport';
import { useUserRole } from './user-management/useUserRole';
import { useUserDelete } from './user-management/useUserDelete';

export const useUserManagement = () => {
  const {
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    handleSearch,
  } = useUserFilters();

  const { users, isLoading, refetch } = useUserFetch({
    searchQuery: debouncedSearchQuery,
    roleFilter,
    currentPage,
    setTotalPages
  });
  
  const { exportUsers } = useUserExport(debouncedSearchQuery, roleFilter);
  const { handleRoleChange } = useUserRole(refetch);
  const { deleteUser } = useUserDelete(refetch);

  return {
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
    exportUsers,
    refetch,
  };
};
