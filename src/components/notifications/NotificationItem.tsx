
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Notification } from '@/hooks/useNotifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const navigate = useNavigate();
  const formattedDate = new Date(notification.created_at).toLocaleDateString();
  
  const handleClick = () => {
    if (notification.link) {
      // Mark as read when clicked
      if (!notification.read) {
        onMarkAsRead(notification.id);
      }
      navigate(notification.link);
    }
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'product_pending':
        return <Bell className="h-4 w-4 text-amber-500" />;
      case 'product_approved':
        return <CheckCheck className="h-4 w-4 text-green-500" />;
      case 'product_rejected':
        return <Bell className="h-4 w-4 text-red-500" />;
      case 'report':
        return <Bell className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div 
      className={cn(
        'flex items-start p-3 cursor-pointer hover:bg-muted/50 border-b',
        notification.read ? 'opacity-70' : 'bg-muted/20'
      )}
      onClick={handleClick}
    >
      <div className="mr-3 mt-1">{getNotificationIcon()}</div>
      <div className="flex-1">
        <div className="font-medium">{notification.title}</div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
          {!notification.read && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
            >
              Mark as read
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
