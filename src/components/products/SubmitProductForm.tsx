
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Form } from '@/components/ui/form';
import { ProductFormValues } from '@/types/product';
import { useProductForm } from '@/hooks/useProductForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { TabItem } from '@/components/products/form/types';

// Import form sections
import BasicInfoSection from '@/components/products/form/BasicInfoSection';
import CategoriesSection from '@/components/products/form/CategoriesSection';
import TechnologiesSection from '@/components/products/form/TechnologiesSection';
import ScreenshotsSection from '@/components/products/form/ScreenshotsSection';
import VideosSection from '@/components/products/form/VideosSection';
import MakersSection from '@/components/products/form/makers/MakersSection';
import AgreementSection from '@/components/products/form/AgreementSection';
import FormActions from '@/components/products/form/FormActions';
import FormLoadingSkeleton from '@/components/products/form/FormLoadingSkeleton';
import MobileTabNavigation from '@/components/products/form/MobileTabNavigation';
import DesktopTabNavigation from '@/components/products/form/DesktopTabNavigation';

interface SubmitProductFormProps {
  productId?: string;
  mode?: 'create' | 'edit';
}

const SubmitProductForm: React.FC<SubmitProductFormProps> = ({ 
  productId,
  mode = 'create'
}) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { 
    form, 
    isSubmitting, 
    isLoading, 
    productStatus,
    handleSubmit,
    handleSubmitForReview
  } = useProductForm({
    userId: user?.id,
    productId
  });
  const [currentTab, setCurrentTab] = useState<string>("categories");

  const onSubmit = (data: ProductFormValues) => {
    handleSubmit(data, false);
  };

  const onSaveAsDraft = () => {
    handleSubmit(form.getValues(), true);
  };

  if (isLoading) {
    return <FormLoadingSkeleton />;
  }

  const tabItems: TabItem[] = [
    { id: "categories", label: "Categories" },
    { id: "technologies", label: "Technologies" },
    { id: "screenshots", label: "Screenshots" },
    { id: "videos", label: "Videos" },
    { id: "makers", label: "Makers" }
  ];

  const renderTabContent = () => {
    switch (currentTab) {
      case "categories":
        return <CategoriesSection form={form} />;
      case "technologies":
        return <TechnologiesSection form={form} />;
      case "screenshots":
        return <ScreenshotsSection form={form} />;
      case "videos":
        return <VideosSection form={form} />;
      case "makers":
        return <MakersSection form={form} />;
      default:
        return <CategoriesSection form={form} />;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
        <BasicInfoSection form={form} />

        {isMobile ? (
          <div className="space-y-4">
            <MobileTabNavigation 
              tabItems={tabItems}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
            
            <div className="mt-4 space-y-4">
              {renderTabContent()}
            </div>
          </div>
        ) : (
          <DesktopTabNavigation 
            tabItems={tabItems}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          >
            {renderTabContent()}
          </DesktopTabNavigation>
        )}

        {mode === 'create' && <AgreementSection form={form} />}

        <FormActions 
          isSubmitting={isSubmitting}
          onSaveAsDraft={onSaveAsDraft}
          onSubmitForReview={handleSubmitForReview}
          mode={mode}
          status={productStatus}
        />
      </form>
    </Form>
  );
};

export default SubmitProductForm;
