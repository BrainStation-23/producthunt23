
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface HeroSectionProps {
  featuredProducts: FeaturedProduct[] | null;
  isLoading: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ featuredProducts, isLoading }) => {
  const primaryColorClass = getPrimaryColorClass();
  const primaryColorHoverClass = getPrimaryColorHoverClass();
  
  const hasFeaturedProducts = featuredProducts && featuredProducts.length > 0;
  
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
          
          {(isLoading || hasFeaturedProducts) && (
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
              ) : hasFeaturedProducts ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {featuredProducts.map((product) => (
                      <CarouselItem key={product.id}>
                        <Link to={`/products/${product.id}`} className="block">
                          <div className="glass-card rounded-xl p-2 shadow-xl animate-fade-in animate-once animate-delay-200">
                            <div className="bg-white rounded-lg overflow-hidden">
                              <img 
                                src={product.image_url || "/placeholder.svg"} 
                                alt={product.name} 
                                className="w-full h-48 object-cover"
                              />
                              <div className="p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  <Badge className={`${primaryColorClass} ${primaryColorHoverClass}`}>Featured</Badge>
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    <span className="ml-1 text-sm font-medium">{product.upvotes || 0}</span>
                                  </div>
                                </div>
                                <h3 className="font-semibold text-lg">{product.name}</h3>
                                <p className="text-sm text-muted-foreground">{product.tagline}</p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2" />
                </Carousel>
              ) : null}
              <div className={`absolute -z-10 top-8 left-8 right-8 bottom-8 bg-${appConfig.primaryColorClass}-100 rounded-xl transform rotate-2`} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
