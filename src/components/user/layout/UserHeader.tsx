
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ChevronLeft } from 'lucide-react';
import UserNotifications from './UserNotifications';
import ProductSearch from '@/components/search/ProductSearch';

interface UserHeaderProps {
  avatarUrl: string | null;
  hasNotifications: boolean;
  getUserInitials: () => string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ 
  avatarUrl, 
  hasNotifications,
  getUserInitials
}) => {
  const navigate = useNavigate();
  
  const goToProfile = () => {
    navigate('/user/profile');
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <SidebarTrigger>
        <ChevronLeft className="h-4 w-4" />
      </SidebarTrigger>
      
      <div className="w-full flex-1">
        <ProductSearch 
          placeholder="Search products..." 
          className="w-full"
          onSearch={(term) => {
            // This will use ProductSearch's built-in navigation
            // No need for additional navigation logic here
          }}
        />
      </div>
      
      <UserNotifications hasNotifications={hasNotifications} />
      
      <Button 
        variant="ghost" 
        className="relative h-8 w-8 rounded-full p-0" 
        onClick={goToProfile}
      >
        <Avatar className="h-8 w-8">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="User avatar" />
          ) : (
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          )}
        </Avatar>
      </Button>
    </header>
  );
};

export default UserHeader;
