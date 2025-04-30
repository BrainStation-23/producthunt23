
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import ProductImage from './card/ProductImage';
import ProductCategories from './card/ProductCategories';
import ProductTechnologies from './card/ProductTechnologies';
import ProductCardActions from './card/ProductCardActions';
import useProductUpvote from './card/useProductUpvote';
import useProductComments from './card/useProductComments';
import { ProductCardSkeleton } from './card/ProductCardSkeleton';

interface Product {
  id: string;
  name: string;
  description: string;
  tagline: string;
  image_url: string | null;
  website_url: string | null;
  categories: string[] | null;
  categoryNames?: string[];
  productTechnologies?: string[];
  upvotes: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { upvotes, hasUpvoted, handleUpvote } = useProductUpvote({
    productId: product.id,
    initialUpvotes: product.upvotes
  });
  
  const { commentCount } = useProductComments(product.id);

  return (
    <Card key={product.id} className="overflow-hidden h-full flex flex-col">
      <Link to={`/products/${product.id}`} className="flex-grow flex flex-col">
        <ProductImage imageUrl={product.image_url} productName={product.name} />
        
        <CardHeader className="p-4 pb-0">
          <CardTitle className="line-clamp-1 text-xl">{product.name}</CardTitle>
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.tagline}</p>
        </CardHeader>
        
        <CardContent className="p-4 space-y-2 flex-grow">
          <ProductCategories categories={product.categoryNames} />
          <ProductTechnologies technologies={product.productTechnologies} />
        </CardContent>
      </Link>
      
      <CardFooter className="p-0">
        <ProductCardActions 
          productId={product.id}
          websiteUrl={product.website_url}
          upvotes={upvotes}
          commentCount={commentCount}
          hasUpvoted={hasUpvoted}
          onUpvote={handleUpvote}
        />
      </CardFooter>
    </Card>
  );
};

export { ProductCardSkeleton };
export default ProductCard;
