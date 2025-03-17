import React from 'react';
import { Comment } from '@/types/comment';
import CommentItem from './CommentItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  refreshComments: () => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, isLoading, refreshComments }) => {
  // Build a hierarchical structure of comments
  const buildCommentHierarchy = (flatComments: Comment[]): Comment[] => {
    const commentMap: Record<string, Comment> = {};
    const rootComments: Comment[] = [];
    
    // First pass: Create a map of comments by ID and initialize replies array
    flatComments.forEach(comment => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });
    
    // Second pass: Organize comments into a tree structure
    flatComments.forEach(comment => {
      const processedComment = commentMap[comment.id];
      
      if (comment.parent_id === null) {
        // This is a root comment
        rootComments.push(processedComment);
      } else if (commentMap[comment.parent_id]) {
        // This is a reply, add it to its parent's replies
        if (!commentMap[comment.parent_id].replies) {
          commentMap[comment.parent_id].replies = [];
        }
        commentMap[comment.parent_id].replies!.push(processedComment);
      } else {
        // Parent comment might have been deleted, add as root
        rootComments.push(processedComment);
      }
    });
    
    // Sort root comments by created_at (newest first)
    return rootComments.sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  };

  const structuredComments = buildCommentHierarchy(comments);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (comments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            No comments yet. Be the first to comment!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {structuredComments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              refreshComments={refreshComments}
              depth={0}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentList;
