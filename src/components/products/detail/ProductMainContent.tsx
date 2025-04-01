
import React from 'react';
import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';

interface ProductMainContentProps {
  product: Product;
}

const ProductMainContent: React.FC<ProductMainContentProps> = ({ product }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <article className="prose max-w-none dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </article>
      </CardContent>
    </Card>
  );
};

export default ProductMainContent;
