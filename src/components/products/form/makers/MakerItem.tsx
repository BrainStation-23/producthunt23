
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { Maker } from '@/types/product';

interface MakerItemProps {
  maker: Maker;
  index: number;
  onRemove: (index: number) => void;
}

export const MakerItem: React.FC<MakerItemProps> = ({ maker, index, onRemove }) => {
  const getInitials = (maker: Maker) => {
    const displayName = maker.username || maker.email;
    if (!displayName) return '?';
    
    if (displayName.includes('@')) {
      return displayName.split('@')[0].substring(0, 2).toUpperCase();
    }
    
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-center gap-2 bg-secondary rounded-full py-1 pl-1 pr-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={maker.avatar_url || ''} alt={maker.username || maker.email} />
        <AvatarFallback>{getInitials(maker)}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{maker.username || maker.email}</span>
      {maker.isCreator && (
        <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">Creator</span>
      )}
      {!maker.isCreator && (
        <button 
          type="button" 
          className="ml-1 text-muted-foreground hover:text-destructive transition-colors" 
          onClick={() => onRemove(index)}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default MakerItem;
