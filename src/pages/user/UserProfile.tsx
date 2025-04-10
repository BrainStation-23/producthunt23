
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileContainer from '@/components/common/profile/ProfileContainer';

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <ProfileContainer 
      user={user}
      title="Your Profile"
      description="Manage your account details and public profile."
    />
  );
};

export default UserProfile;
