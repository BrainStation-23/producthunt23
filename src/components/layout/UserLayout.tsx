
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Heart, 
  Settings, 
  LogOut,
  ChevronLeft,
  Bell,
  Search,
  MessageSquare,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';

const UserLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="flex h-14 items-center border-b px-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="rounded-full bg-hunt-600 w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="font-bold text-lg">My Account</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/user">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/user/products">
                        <Package className="h-4 w-4" />
                        <span>My Products</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/user/saved">
                        <Heart className="h-4 w-4" />
                        <span>Saved</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/user/messages">
                        <MessageSquare className="h-4 w-4" />
                        <span>Messages</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/user/profile">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/user/settings">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </SidebarTrigger>
            
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full bg-muted pl-8 py-2 rounded-md"
                  />
                </div>
              </form>
            </div>
            
            <Button variant="ghost" size="icon" className="shrink-0">
              <Bell className="h-4 w-4" />
            </Button>
            
            <Avatar className="h-8 w-8">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </header>
          
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
