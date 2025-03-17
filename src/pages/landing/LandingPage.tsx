import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LandingPage: React.FC = () => {
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
              <div className="glass-card rounded-xl p-2 shadow-xl animate-fade-in animate-once animate-delay-200">
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
                        <span className="ml-1 text-sm font-medium">4.9</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg">Featured Product</h3>
                    <p className="text-sm text-muted-foreground">Revolutionizing how you work and play</p>
                  </div>
                </div>
              </div>
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
          
          <Tabs defaultValue="all" className="w-full mt-8">
            <div className="flex justify-center">
              <TabsList className="mb-8">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="tech">Tech</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="productivity">Productivity</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="group relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:shadow-md">
                    <div className="aspect-video overflow-hidden rounded-md bg-muted">
                      <img
                        src="/placeholder.svg"
                        alt={`Product thumbnail ${i}`}
                        width={400}
                        height={225}
                        className="h-full w-full object-cover transition-all group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="font-semibold">Product Name</h3>
                      <p className="text-sm text-muted-foreground">Brief product description.</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">By Maker</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-xs">4.5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center">
                <Button asChild variant="outline" className="gap-1">
                  <Link to="/products">
                    View all products
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
            
            {/* Other tabs content would be similar */}
            <TabsContent value="tech" className="space-y-4">
              {/* Similar content structure, filtered for tech */}
              <div className="flex justify-center">
                <p className="text-muted-foreground">Tech products will be loaded here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="design" className="space-y-4">
              {/* Similar content structure, filtered for design */}
              <div className="flex justify-center">
                <p className="text-muted-foreground">Design products will be loaded here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="productivity" className="space-y-4">
              {/* Similar content structure, filtered for productivity */}
              <div className="flex justify-center">
                <p className="text-muted-foreground">Productivity products will be loaded here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="marketing" className="space-y-4">
              {/* Similar content structure, filtered for marketing */}
              <div className="flex justify-center">
                <p className="text-muted-foreground">Marketing products will be loaded here</p>
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
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 font-medium">
                    <Link to="/learn-more">Learn more</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="/placeholder.svg" 
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
