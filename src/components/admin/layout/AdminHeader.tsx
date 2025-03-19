
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  X,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/sonner';
import { SidebarTrigger } from '@/components/ui/sidebar';
import AdminNotifications from './AdminNotifications';

interface AdminHeaderProps {
  avatarUrl: string | null;
  hasNotifications: boolean;
  getAdminInitials: () => string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  avatarUrl, 
  hasNotifications,
  getAdminInitials
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`);
      // In a real app, this would perform a search or navigate to search results
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <SidebarTrigger>
        <ChevronLeft className="h-4 w-4" />
      </SidebarTrigger>
      
      <div className="w-full flex-1">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products, users..."
              className="w-full bg-muted pl-8 py-2 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                className="absolute right-2.5 top-2.5" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </form>
      </div>
      
      <AdminNotifications hasNotifications={hasNotifications} />
      
      <Link to="/user/profile">
        <Avatar className="h-8 w-8">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="Admin avatar" />
          ) : (
            <AvatarFallback>{getAdminInitials()}</AvatarFallback>
          )}
        </Avatar>
      </Link>
    </header>
  );
};

export default AdminHeader;
