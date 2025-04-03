
import React from 'react';
import NotificationsPopover from '@/components/notifications/NotificationsPopover';

interface UserNotificationsProps {
  hasNotifications?: boolean;
}

const UserNotifications: React.FC<UserNotificationsProps> = ({ hasNotifications }) => {
  return <NotificationsPopover variant="user" />;
};

export default UserNotifications;
