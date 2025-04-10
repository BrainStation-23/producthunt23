
import React from 'react';
import { useProductComments } from '@/hooks/useProductComments';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

interface ProductCommentsProps {
  productId: string;
}

const ProductComments: React.FC<ProductCommentsProps> = ({ productId }) => {
  const { comments, isLoading, refreshComments } = useProductComments(productId);

  return (
    <div className="space-y-6">
      <CommentForm productId={productId} onCommentAdded={refreshComments} parentId={null} />
      <CommentList comments={comments} isLoading={isLoading} refreshComments={refreshComments} />
    </div>
  );
};

export default ProductComments;
