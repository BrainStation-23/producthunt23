
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export const useUserFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Add debouncing for search queries
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Reset to the first page when search query or role filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is now handled by the debounced value, so we just prevent default form submission
  };

  return {
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
  };
};
