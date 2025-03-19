
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import { useAdminProfile } from '@/components/admin/layout/useAdminProfile';

const AdminLayout: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { avatarUrl, hasNotifications, getAdminInitials } = useAdminProfile();

  const handleLogout = () => {
    signOut();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <AdminSidebar onLogout={handleLogout} />
        </Sidebar>
        
        <div className="flex-1">
          <AdminHeader 
            avatarUrl={avatarUrl} 
            hasNotifications={hasNotifications}
            getAdminInitials={getAdminInitials}
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

export default AdminLayout;
