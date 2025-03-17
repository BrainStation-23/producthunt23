
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Comment } from '@/types/comment';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2, Reply, MoreVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import CommentForm from './CommentForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CommentItemProps {
  comment: Comment;
  refreshComments: () => void;
  isReply?: boolean;
  replies?: Comment[];
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  refreshComments, 
  isReply = false, 
  replies = [] 
}) => {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const username = comment.profile?.username || 'Anonymous';
  const avatarUrl = comment.profile?.avatar_url || '';
  const initials = username.substring(0, 2).toUpperCase();
  const formattedDate = comment.created_at 
    ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) 
    : 'recently';
  
  const isCurrentUserComment = user?.id === comment.user_id;

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', comment.id);
        
      if (error) throw error;
      
      toast.success('Comment deleted successfully');
      refreshComments();
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleReplyClick = () => {
    setIsReplying(!isReplying);
  };

  const handleReplySubmitted = () => {
    setIsReplying(false);
    refreshComments();
  };

  return (
    <div className={`${isReply ? 'pl-8 border-l-2 border-gray-100 dark:border-gray-800 ml-4' : ''}`}>
      <div className="flex items-start space-x-4 group">
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium">{username}</h4>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>
            
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReplyClick}
                  className="h-8 px-2"
                >
                  <Reply className="h-4 w-4 mr-1" />
                  Reply
                </Button>
              )}
              
              {isCurrentUserComment && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 break-words">
            {comment.content}
          </div>
        </div>
      </div>
      
      {isReplying && (
        <div className="mt-4 ml-14">
          <CommentForm 
            productId={comment.product_id} 
            parentId={comment.id}
            onCommentAdded={handleReplySubmitted}
          />
        </div>
      )}
      
      {replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              refreshComments={refreshComments}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
