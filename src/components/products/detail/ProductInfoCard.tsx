
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import UpvoteActions from './info/UpvoteActions';
import WebsiteButton from './info/WebsiteButton';
import CategoryList from './info/CategoryList';
import TechnologiesList from './info/TechnologiesList';
import LaunchDate from './info/LaunchDate';

interface ProductInfoCardProps {
  product: Product;
  commentCount: number;
}

const ProductInfoCard: React.FC<ProductInfoCardProps> = ({ product, commentCount }) => {
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const fetchCategoryNames = async () => {
      if (!product.categories || product.categories.length === 0) return;
      
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', product.categories);
        
      if (error) {
        console.error('Error fetching category names:', error);
        return;
      }
      
      if (data) {
        const nameMap: Record<string, string> = {};
        data.forEach(category => {
          nameMap[category.id] = category.name;
        });
        setCategoryNames(nameMap);
      }
    };
    
    fetchCategoryNames();
  }, [product.categories]);

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <UpvoteActions 
            productId={product.id} 
            initialUpvotes={product?.upvotes || 0} 
            commentCount={commentCount} 
          />
        </div>

        <WebsiteButton url={product?.website_url} />
        <CategoryList categories={product?.categories} categoryNames={categoryNames} />
        <TechnologiesList technologies={product?.technologies} />
        <LaunchDate date={product?.created_at} />
      </CardContent>
    </Card>
  );
};

export default ProductInfoCard;
