
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AdminNotificationsProps {
  hasNotifications: boolean;
}

const AdminNotifications: React.FC<AdminNotificationsProps> = ({ hasNotifications }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0 relative">
          <Bell className="h-4 w-4" />
          {hasNotifications && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="border-b p-4">
          <div className="text-sm font-medium">Admin Notifications</div>
        </div>
        <div className="p-4 text-sm text-center text-muted-foreground">
          {hasNotifications ? 
            "You have new system notifications" : 
            "No new notifications"}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminNotifications;
