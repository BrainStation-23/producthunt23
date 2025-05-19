
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { FeaturedCategory, FeaturedProduct } from '../types';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategorySectionProps {
  categories: FeaturedCategory[] | undefined;
  isCategoriesLoading: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categoryProducts: FeaturedProduct[] | undefined;
  isCategoryProductsLoading: boolean;
  hasError: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  isCategoriesLoading,
  selectedCategory,
  setSelectedCategory,
  categoryProducts,
  isCategoryProductsLoading,
  hasError
}) => {
  const isMobile = useIsMobile();

  return (
    <section className="py-8 md:py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter md:text-4xl">Browse by Category</h2>
          <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed">
            Discover products in categories that interest you most
          </p>
        </div>
        
        <Tabs 
          defaultValue={categories?.[0]?.slug || 'all'} 
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full mt-8"
        >
          <div className="flex justify-center overflow-x-auto pb-2">
            {isCategoriesLoading ? (
              <div className="flex gap-2 mb-8">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-24 rounded-md" />
                ))}
              </div>
            ) : (
              <TabsList className="mb-8 flex overflow-x-auto">
                {categories?.map((category) => (
                  <TabsTrigger key={category.id} value={category.slug}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}
          </div>
          
          {/* Only render content for selected category */}
          <TabsContent value={selectedCategory} className="space-y-4">
            {isCategoryProductsLoading ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="group relative overflow-hidden rounded-lg border bg-background p-2">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-2">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <div className="flex justify-between mt-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : categoryProducts && categoryProducts.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {categoryProducts.map((product) => (
                  <Link key={product.id} to={`/products/${product.id}`}>
                    <div className="group relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:shadow-md">
                      <div className="aspect-video overflow-hidden rounded-md bg-muted">
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={`${product.name} thumbnail`}
                          width={400}
                          height={225}
                          className="h-full w-full object-cover transition-all group-hover:scale-105"
                        />
                      </div>
                      <div className="p-2">
                        <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.tagline}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{product.profile_username?.charAt(0) || 'U'}</AvatarFallback>
                              {product.profile_avatar_url && (
                                <AvatarImage src={product.profile_avatar_url} />
                              )}
                            </Avatar>
                            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                              {product.profile_username || 'Maker'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-xs">{product.upvotes || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-lg">No products found in this category</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/products">Browse all products</Link>
                </Button>
              </div>
            )}
            
            <div className="flex justify-center">
              <Button asChild variant="outline" className="gap-1">
                <Link to="/products">
                  View all products
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default CategorySection;
