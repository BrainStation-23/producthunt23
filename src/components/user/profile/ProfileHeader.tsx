
import React from 'react';

interface ProfileHeaderProps {
  title: string;
  description: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default ProfileHeader;
