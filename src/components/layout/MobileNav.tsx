
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LogOut,
  User,
  Bell,
  Search,
  Home,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { getDashboardPathForRole } from '@/utils/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import ProductSearch from '@/components/search/ProductSearch';

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ open, onOpenChange }) => {
  const { user, signOut } = useAuth();
  const { userRole } = useRole();
  
  // Determine if user is actually logged in
  const userIsLoggedIn = !!user;
  
  // Get dashboard path based on role
  const dashboardPath = getDashboardPathForRole(userRole);
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
    onOpenChange(false);
  };
  
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        
        <div className="p-4 space-y-4 overflow-y-auto">
          <div className="py-2 border-b">
            <ProductSearch 
              placeholder="Search products..." 
              className="w-full"
              onSearch={(term) => {
                onOpenChange(false);
              }}
            />
          </div>
          
          <div className="py-1">
            <Link to="/" className="flex items-center gap-2 p-2 hover:bg-muted rounded-md" onClick={() => onOpenChange(false)}>
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/products" className="flex items-center gap-2 p-2 hover:bg-muted rounded-md" onClick={() => onOpenChange(false)}>
              <ShoppingBag className="h-5 w-5" />
              <span>Products</span>
            </Link>
          </div>
          
          {userIsLoggedIn ? (
            <div className="space-y-2">
              <div className="py-1 border-t">
                <Link to={dashboardPath} className="flex items-center gap-2 p-2 hover:bg-muted rounded-md" onClick={() => onOpenChange(false)}>
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/notifications" className="flex items-center gap-2 p-2 hover:bg-muted rounded-md" onClick={() => onOpenChange(false)}>
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </Link>
                <Link to={`${dashboardPath}/profile`} className="flex items-center gap-2 p-2 hover:bg-muted rounded-md" onClick={() => onOpenChange(false)}>
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              </div>
              
              <div className="py-1 border-t">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start p-2 hover:bg-muted rounded-md"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Log out</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 pt-2 border-t">
              <Button asChild variant="default" className="w-full">
                <Link to="/login" onClick={() => onOpenChange(false)}>Log in</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/register" onClick={() => onOpenChange(false)}>Sign up</Link>
              </Button>
            </div>
          )}
        </div>
        
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNav;
