
import React from 'react';
import { CommandItem } from '@/components/ui/command';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus } from 'lucide-react';

interface ProfileSearchResult {
  id: string;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
}

interface MakerSearchItemProps {
  profile: ProfileSearchResult;
  onSelect: (profile: ProfileSearchResult) => void;
}

export const MakerSearchItem: React.FC<MakerSearchItemProps> = ({ profile, onSelect }) => {
  // Get a displayable name for the profile
  const displayName = profile.username || profile.email || 'Unknown User';
  
  // Get initials for the avatar fallback
  const getInitials = () => {
    if (!displayName || displayName === 'Unknown User') return 'UN';
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
    <CommandItem
      key={profile.id}
      onSelect={() => onSelect(profile)}
      className="flex items-center justify-between py-2 cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile.avatar_url || ''} alt={displayName} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{displayName}</span>
          {profile.username && profile.email && (
            <span className="text-xs text-muted-foreground">{profile.email}</span>
          )}
        </div>
      </div>
      <UserPlus className="h-4 w-4 text-muted-foreground hover:text-primary" />
    </CommandItem>
  );
};

export default MakerSearchItem;
