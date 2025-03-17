
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

  // Get total count including replies
  const getTotalCommentCount = (comments: Comment[]): number => {
    let count = comments.length;
    for (const comment of comments) {
      if (comment.replies && comment.replies.length > 0) {
        count += getTotalCommentCount(comment.replies);
      }
    }
    return count;
  };

  const totalComments = getTotalCommentCount(comments);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments ({totalComments})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {comments.map((comment) => (
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
