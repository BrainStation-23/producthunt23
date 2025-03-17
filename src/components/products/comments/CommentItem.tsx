
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Comment } from '@/types/comment';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const username = comment.profile?.username || 'Anonymous';
  const avatarUrl = comment.profile?.avatar_url || '';
  const initials = username.substring(0, 2).toUpperCase();
  const formattedDate = comment.created_at 
    ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) 
    : 'recently';

  return (
    <div className="flex items-start space-x-4">
      <Avatar className="w-10 h-10">
        <AvatarImage src={avatarUrl} alt={username} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h4 className="font-medium">{username}</h4>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentItem;
