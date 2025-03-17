
import React from 'react';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import CtaSection from './components/CtaSection';
import { useLandingData } from './hooks/useLandingData';

const LandingPage: React.FC = () => {
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

  const featuredProduct = featuredProducts && featuredProducts.length > 0 ? featuredProducts[0] : null;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <HeroSection 
        featuredProduct={featuredProduct}
        isLoading={isProductsLoading}
      />
      
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
