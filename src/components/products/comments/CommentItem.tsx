
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
  depth: number;
}

// Maximum nesting level to display
const MAX_NESTING_DEPTH = 5;

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  refreshComments, 
  depth = 0
}) => {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  
  // Get username and avatar URL from the profile, with better fallbacks
  const username = comment.profile?.username || 'User';
  const avatarUrl = comment.profile?.avatar_url || '';
  
  // Generate meaningful initials from username or email
  const getInitials = () => {
    if (comment.profile?.username) {
      // Get first two letters of username
      return comment.profile.username.substring(0, 2).toUpperCase();
    } else {
      // If we have user_id but no profile info, use "U" as fallback
      return "U";
    }
  };
  
  const initials = getInitials();
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

  // Calculate the appropriate left padding based on nesting depth
  const nestingIndent = depth > 0 ? `ml-${Math.min(depth * 4, 16)}` : '';
  
  // Decide on the border style based on depth
  const borderStyle = depth > 0 
    ? 'border-l-2 border-gray-100 dark:border-gray-800 pl-4' 
    : '';

  return (
    <div className={`${borderStyle} ${nestingIndent} relative`}>
      {/* Visual connector line for deeply nested comments */}
      {depth > 1 && (
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
      )}
      
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
              {user && depth < MAX_NESTING_DEPTH && (
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
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              refreshComments={refreshComments}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
