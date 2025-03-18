
import React, { ReactNode } from 'react';

interface ProfileHeaderProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
      <div>
        <div className="flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
