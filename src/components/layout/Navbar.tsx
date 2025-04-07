import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProductSearch from '@/components/search/ProductSearch';

interface NavbarProps {
  isLoggedIn?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn = false }) => {
  const { user, userRole, signOut } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Determine if user is actually logged in from auth context
  const userIsLoggedIn = !!user;
  
  // Determine dashboard path based on role
  const dashboardPath = 
    userRole === 'admin' ? '/admin' : 
    userRole === 'judge' ? '/judge' : 
    '/user';

  // Fetch avatar URL from profiles table when user changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setAvatarUrl(null);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        setAvatarUrl(data?.avatar_url || null);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center space-x-2">
            <div className="rounded-full bg-hunt-600 w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="hidden md:inline-block font-bold text-xl">ProductHunt</span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center px-4">
          <div className="relative w-full max-w-md">
            <ProductSearch placeholder="Search products..." />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {userIsLoggedIn ? (
            <>
              <Button variant="ghost" asChild className="hidden md:flex items-center gap-2">
                <Link to={dashboardPath}>
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
              </Button>
              
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Bell className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt="User profile" />
                      ) : (
                        <AvatarFallback>
                          {user?.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">User</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`${dashboardPath}/profile`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={dashboardPath}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`${dashboardPath}/settings`}>Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
