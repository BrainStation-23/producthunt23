
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
  // Organize comments into hierarchical structure
  const groupCommentsByParent = (allComments: Comment[]) => {
    const topLevelComments: Comment[] = [];
    const commentsByParent: Record<string, Comment[]> = {};

    // First, separate top-level from replies
    allComments.forEach(comment => {
      if (!comment.parent_id) {
        topLevelComments.push({ ...comment, replies: [] });
      } else {
        if (!commentsByParent[comment.parent_id]) {
          commentsByParent[comment.parent_id] = [];
        }
        commentsByParent[comment.parent_id].push(comment);
      }
    });

    // Now, attach replies to their parents
    const result = topLevelComments.map(topComment => {
      const replies = commentsByParent[topComment.id] || [];
      return { ...topComment, replies };
    });

    return result;
  };

  const structuredComments = groupCommentsByParent(comments);

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
              replies={comment.replies}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentList;
