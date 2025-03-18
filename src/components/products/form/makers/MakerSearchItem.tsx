
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
  return (
    <CommandItem
      key={profile.id}
      onSelect={() => onSelect(profile)}
      className="flex items-center justify-between py-2 cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile.avatar_url || ''} alt={profile.username || profile.email || ''} />
          <AvatarFallback>
            {(profile.username || profile.email || '').substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{profile.username || profile.email}</span>
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
