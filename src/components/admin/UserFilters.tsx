
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Upload } from 'lucide-react';

interface UserFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: string | null;
  setRoleFilter: (role: string | null) => void;
  handleSearch: (e: React.FormEvent) => void;
  onExportUsers: () => void;
  onOpenImport: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  handleSearch,
  onExportUsers,
  onOpenImport,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-grow">
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
          <Button 
            variant={roleFilter === "judge" ? "default" : "outline"} 
            size="sm"
            onClick={() => setRoleFilter("judge")}
          >
            Judges
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onExportUsers}
          className="flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onOpenImport}
          className="flex items-center"
        >
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
      </div>
    </div>
  );
};

export default UserFilters;
