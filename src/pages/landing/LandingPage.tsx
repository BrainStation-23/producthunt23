
import React from 'react';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import CtaSection from './components/CtaSection';
import { useLandingData } from './hooks/useLandingData';
import ProductSearch from '@/components/search/ProductSearch';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { getBrandSlogan } from '@/config/appConfig';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const LandingPage: React.FC = () => {
  // Set document title using our custom hook with slogan
  useDocumentTitle(getBrandSlogan());
  const isMobile = useIsMobile();
  
  const {
    categories,
    isCategoriesLoading,
    featuredProducts,
    isProductsLoading,
    categoryProducts,
    isCategoryProductsLoading,
    selectedCategory,
    setSelectedCategory,
    hasError
  } = useLandingData();

  return (
    <div className="animate-fade-in overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection 
        featuredProducts={featuredProducts}
        isLoading={isProductsLoading}
      />
      
      {/* Mobile Search (visible on small screens only) */}
      <div className="md:hidden container px-4 -mt-4 mb-6 mx-auto">
        <Card className="p-3">
          <ProductSearch className="w-full" />
        </Card>
      </div>
      
      {/* Categories Section */}
      <CategorySection 
        categories={categories}
        isCategoriesLoading={isCategoriesLoading}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoryProducts={categoryProducts}
        isCategoryProductsLoading={isCategoryProductsLoading}
        hasError={hasError}
      />
      
      {/* CTA Section */}
      <CtaSection />
    </div>
  );
};

export default LandingPage;
