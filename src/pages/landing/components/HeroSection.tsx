
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
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface HeroSectionProps {
  featuredProducts: FeaturedProduct[] | null;
  isLoading: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ featuredProducts, isLoading }) => {
  const primaryColorClass = getPrimaryColorClass();
  const primaryColorHoverClass = getPrimaryColorHoverClass();
  const isMobile = useIsMobile();
  
  const hasFeaturedProducts = featuredProducts && featuredProducts.length > 0;
  
  return (
    <section className="py-8 md:py-16 lg:py-24 bg-gradient-to-b from-background to-muted/20 overflow-x-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          <div className="space-y-4 md:space-y-6">
            <Badge variant="outline" className="animate-slide-in animate-once">Today's trending products</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight animate-slide-in animate-once animate-delay-100">
              {getBrandSlogan()}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground animate-slide-in animate-once animate-delay-200">
              {getBrandDescription()}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-in animate-once animate-delay-300">
              <Button asChild size={isMobile ? "default" : "lg"} className="font-medium w-full sm:w-auto">
                <Link to="/register">Join for free</Link>
              </Button>
              <Button asChild variant="outline" size={isMobile ? "default" : "lg"} className="font-medium w-full sm:w-auto">
                <Link to="/products" className="flex items-center justify-center">
                  Browse products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          {(isLoading || hasFeaturedProducts) && (
            <div className="relative mt-8 md:mt-0 w-full">
              {isLoading ? (
                <div className="glass-card rounded-xl p-2 shadow-xl w-full">
                  <div className="bg-white rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-36 md:h-48" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              ) : hasFeaturedProducts ? (
                <div className="w-full overflow-hidden">
                  <Carousel className="w-full">
                    <CarouselContent className="ml-0">
                      {featuredProducts.map((product) => (
                        <CarouselItem key={product.id} className="pl-4 md:pl-6 w-full">
                          <Link to={`/products/${product.id}`} className="block w-full">
                            <div className="glass-card rounded-xl p-2 shadow-xl animate-fade-in animate-once animate-delay-200 w-full">
                              <div className="bg-white rounded-lg overflow-hidden">
                                <div className="w-full">
                                  <AspectRatio ratio={16/9} className="bg-muted">
                                    <img 
                                      src={product.image_url || "/placeholder.svg"} 
                                      alt={product.name} 
                                      className="w-full h-full object-contain"
                                    />
                                  </AspectRatio>
                                </div>
                                <div className="p-4 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Badge className={`${primaryColorClass} ${primaryColorHoverClass}`}>Featured</Badge>
                                    <div className="flex items-center">
                                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                      <span className="ml-1 text-sm font-medium">{product.upvotes || 0}</span>
                                    </div>
                                  </div>
                                  <h3 className="font-semibold text-lg">{product.name}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">{product.tagline}</p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="hidden md:flex absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2" />
                  </Carousel>
                </div>
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
