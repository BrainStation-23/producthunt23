
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/product';

// Type for featured category
interface FeaturedCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  display_order: number;
}

// Type for featured products
interface FeaturedProduct extends Product {
  display_order: number;
  profile_username?: string;
  profile_avatar_url?: string;
}

const LandingPage: React.FC = () => {
  // Fetch featured categories
  const { 
    data: categories, 
    isLoading: isCategoriesLoading,
    error: categoriesError 
  } = useQuery({
    queryKey: ['featuredCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_categories')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as FeaturedCategory[];
    }
  });

  // Default tab to 'all' or first available category
  const defaultCategory = categories?.length > 0 ? categories[0].slug : 'all';
  const [selectedCategory, setSelectedCategory] = React.useState<string>(defaultCategory);

  // Update selected category when categories are loaded
  React.useEffect(() => {
    if (categories?.length > 0) {
      setSelectedCategory(categories[0].slug);
    }
  }, [categories]);

  // Fetch featured products
  const { 
    data: featuredProducts, 
    isLoading: isProductsLoading,
    error: productsError 
  } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_featured_products');
      
      if (error) throw error;
      return data as FeaturedProduct[];
    }
  });

  // Fetch products by category when tab changes
  const { 
    data: categoryProducts, 
    isLoading: isCategoryProductsLoading,
    error: categoryProductsError 
  } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: async () => {
      if (selectedCategory === 'all') {
        const { data, error } = await supabase
          .from('products')
          .select('*, profiles:created_by(username, avatar_url)')
          .eq('status', 'approved')
          .limit(8);
        
        if (error) throw error;
        
        // Format data to match the expected shape
        return data.map(product => ({
          ...product,
          profile_username: product.profiles?.username,
          profile_avatar_url: product.profiles?.avatar_url
        })) as Product[];
      } else {
        const { data, error } = await supabase
          .from('products')
          .select('*, profiles:created_by(username, avatar_url)')
          .eq('status', 'approved')
          .contains('tags', [selectedCategory])
          .limit(8);
        
        if (error) throw error;
        
        // Format data to match the expected shape
        return data.map(product => ({
          ...product,
          profile_username: product.profiles?.username,
          profile_avatar_url: product.profiles?.avatar_url
        })) as Product[];
      }
    }
  });

  // Handle any errors
  if (categoriesError || productsError || categoryProductsError) {
    console.error('Error loading data:', categoriesError || productsError || categoryProductsError);
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="animate-slide-in animate-once">Today's trending products</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-slide-in animate-once animate-delay-100">
                Discover the best <span className="text-hunt-600">products</span> in tech
              </h1>
              <p className="text-xl text-muted-foreground animate-slide-in animate-once animate-delay-200">
                Join our community of product enthusiasts and discover the next big thing before anyone else.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-in animate-once animate-delay-300">
                <Button asChild size="lg" className="font-medium">
                  <Link to="/register">Join for free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-medium">
                  <Link to="/products" className="flex items-center">
                    Browse products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              {isProductsLoading ? (
                <div className="glass-card rounded-xl p-2 shadow-xl">
                  <div className="bg-white rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              ) : featuredProducts && featuredProducts.length > 0 ? (
                <Link to={`/products/${featuredProducts[0].id}`} className="block">
                  <div className="glass-card rounded-xl p-2 shadow-xl animate-fade-in animate-once animate-delay-200">
                    <div className="bg-white rounded-lg overflow-hidden">
                      <img 
                        src={featuredProducts[0].image_url || "/placeholder.svg"} 
                        alt={featuredProducts[0].name} 
                        className="w-full h-auto object-cover"
                      />
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-hunt-600 hover:bg-hunt-700">New</Badge>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-sm font-medium">{featuredProducts[0].upvotes || 0}</span>
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg">{featuredProducts[0].name}</h3>
                        <p className="text-sm text-muted-foreground">{featuredProducts[0].tagline}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link to="/products" className="block">
                  <div className="glass-card rounded-xl p-2 shadow-xl">
                    <div className="bg-white rounded-lg overflow-hidden">
                      <img 
                        src="/placeholder.svg" 
                        alt="Product Showcase" 
                        className="w-full h-auto object-cover"
                      />
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-hunt-600 hover:bg-hunt-700">New</Badge>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-sm font-medium">0</span>
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg">Featured Product</h3>
                        <p className="text-sm text-muted-foreground">No featured products found</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
              <div className="absolute -z-10 top-8 left-8 right-8 bottom-8 bg-hunt-100 rounded-xl transform rotate-2" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Browse by Category</h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed">
              Discover products in categories that interest you most
            </p>
          </div>
          
          <Tabs 
            defaultValue={defaultCategory} 
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full mt-8"
          >
            <div className="flex justify-center">
              {isCategoriesLoading ? (
                <div className="flex gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-10 w-24 rounded-md" />
                  ))}
                </div>
              ) : (
                <TabsList className="mb-8">
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
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.tagline}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{product.profile_username?.charAt(0) || 'U'}</AvatarFallback>
                                {product.profile_avatar_url && (
                                  <AvatarImage src={product.profile_avatar_url} />
                                )}
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                By {product.profile_username || 'Maker'}
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
      
      {/* CTA Section */}
      <section className="py-16 bg-hunt-50">
        <div className="container px-4 md:px-6">
          <div className="bg-hunt-600 text-white rounded-xl p-8 sm:p-12">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to launch your product?</h2>
                <p className="max-w-[600px] text-hunt-100 md:text-xl/relaxed lg:text-base/relaxed">
                  Join thousands of makers who have successfully launched their products on our platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" variant="secondary" className="font-medium">
                    <Link to="/submit">Submit your product</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 hover:text-white font-medium">
                    <Link to="/learn-more">Learn more</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                  alt="Product Launch" 
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
