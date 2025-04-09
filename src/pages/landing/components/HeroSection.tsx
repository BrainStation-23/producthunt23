
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FeaturedProduct } from '../types';
import { 
  getBrandName, 
  getBrandSlogan, 
  getBrandDescription,
  getPrimaryColorClass,
  getPrimaryColorHoverClass,
  appConfig 
} from '@/config/appConfig';

interface HeroSectionProps {
  featuredProduct: FeaturedProduct | null;
  isLoading: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ featuredProduct, isLoading }) => {
  const primaryColorClass = getPrimaryColorClass();
  const primaryColorHoverClass = getPrimaryColorHoverClass();
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="outline" className="animate-slide-in animate-once">Today's trending products</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-slide-in animate-once animate-delay-100">
              {getBrandSlogan()}
            </h1>
            <p className="text-xl text-muted-foreground animate-slide-in animate-once animate-delay-200">
              {getBrandDescription()}
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
            {isLoading ? (
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
            ) : featuredProduct ? (
              <Link to={`/products/${featuredProduct.id}`} className="block">
                <div className="glass-card rounded-xl p-2 shadow-xl animate-fade-in animate-once animate-delay-200">
                  <div className="bg-white rounded-lg overflow-hidden">
                    <img 
                      src={featuredProduct.image_url || "/placeholder.svg"} 
                      alt={featuredProduct.name} 
                      className="w-full h-auto object-cover"
                    />
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className={`${primaryColorClass} ${primaryColorHoverClass}`}>New</Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm font-medium">{featuredProduct.upvotes || 0}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg">{featuredProduct.name}</h3>
                      <p className="text-sm text-muted-foreground">{featuredProduct.tagline}</p>
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
                        <Badge className={`${primaryColorClass} ${primaryColorHoverClass}`}>New</Badge>
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
            <div className={`absolute -z-10 top-8 left-8 right-8 bottom-8 bg-${appConfig.primaryColorClass}-100 rounded-xl transform rotate-2`} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
