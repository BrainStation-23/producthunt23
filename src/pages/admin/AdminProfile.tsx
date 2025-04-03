
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileContainer from '@/components/common/profile/ProfileContainer';

const AdminProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <ProfileContainer 
      user={user}
      title="Admin Profile"
      description="Manage your admin account details and public profile."
    />
  );
};

export default AdminProfile;
