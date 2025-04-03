
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import AdminNotifications from './AdminNotifications';
import ProductSearch from '@/components/search/ProductSearch';

interface AdminHeaderProps {
  avatarUrl: string | null;
  getAdminInitials: () => string;
  hasNotifications?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  avatarUrl, 
  getAdminInitials,
  hasNotifications
}) => {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <SidebarTrigger>
        <ChevronLeft className="h-4 w-4" />
      </SidebarTrigger>
      
      <div className="w-full flex-1">
        <ProductSearch 
          placeholder="Search products, users..." 
          className="w-full"
          onSearch={(term) => {
            // This will use ProductSearch's built-in navigation
            // No need for additional navigation logic here
          }}
        />
      </div>
      
      <AdminNotifications />
      
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
