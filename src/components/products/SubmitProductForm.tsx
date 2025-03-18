
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductFormValues } from '@/types/product';
import { useProductForm } from '@/hooks/useProductForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

// Import form sections
import BasicInfoSection from '@/components/products/form/BasicInfoSection';
import CategoriesSection from '@/components/products/form/CategoriesSection';
import TechnologiesSection from '@/components/products/form/TechnologiesSection';
import ScreenshotsSection from '@/components/products/form/ScreenshotsSection';
import VideosSection from '@/components/products/form/VideosSection';
import MakersSection from '@/components/products/form/makers/MakersSection';
import AgreementSection from '@/components/products/form/AgreementSection';
import FormActions from '@/components/products/form/FormActions';
import ProductPreview from '@/components/products/ProductPreview';

interface SubmitProductFormProps {
  productId?: string;
  mode?: 'create' | 'edit';
}

const SubmitProductForm: React.FC<SubmitProductFormProps> = ({ 
  productId,
  mode = 'create'
}) => {
  const { user } = useAuth();
  const { form, isSubmitting, isLoading, handleSubmit } = useProductForm({
    userId: user?.id,
    productId
  });
  const [previewOpen, setPreviewOpen] = useState(false);

  const onSubmit = (data: ProductFormValues) => {
    handleSubmit(data, false);
  };

  const onSaveAsDraft = () => {
    handleSubmit(form.getValues(), true);
  };

  const openPreview = () => {
    setPreviewOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-1/2" />
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-40 w-full" />
        </div>
        
        <div className="flex justify-end space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <BasicInfoSection form={form} />

          <Tabs defaultValue="categories">
            <TabsList className="grid grid-cols-1 md:grid-cols-5 w-full mb-4">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="technologies">Technologies</TabsTrigger>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="makers">Makers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories" className="space-y-4">
              <CategoriesSection form={form} />
            </TabsContent>

            <TabsContent value="technologies" className="space-y-4">
              <TechnologiesSection form={form} />
            </TabsContent>

            <TabsContent value="screenshots" className="space-y-4">
              <ScreenshotsSection form={form} />
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              <VideosSection form={form} />
            </TabsContent>
            
            <TabsContent value="makers" className="space-y-4">
              <MakersSection form={form} />
            </TabsContent>
          </Tabs>

          {mode === 'create' && <AgreementSection form={form} />}

          <FormActions 
            isSubmitting={isSubmitting}
            onSaveAsDraft={onSaveAsDraft}
            onPreview={openPreview}
            mode={mode}
          />
        </form>
      </Form>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Preview</DialogTitle>
            <DialogDescription>
              This is how your product will appear to users.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <ProductPreview formData={form.getValues()} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubmitProductForm;
