
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import UserSidebar from '@/components/user/layout/UserSidebar';
import UserHeader from '@/components/user/layout/UserHeader';
import { useUserProfile } from '@/components/user/layout/useUserProfile';

const UserLayout: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { avatarUrl, hasNotifications, getUserInitials } = useUserProfile();

  const handleLogout = () => {
    signOut();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <UserSidebar onLogout={handleLogout} />
        </Sidebar>
        
        <div className="flex-1">
          <UserHeader 
            avatarUrl={avatarUrl} 
            hasNotifications={hasNotifications}
            getUserInitials={getUserInitials}
          />
          
          <main className="grid flex-1 p-4 sm:p-6">
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserLayout;
