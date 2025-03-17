
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductFormValues } from '@/types/product';
import { useProductForm } from '@/components/products/form/useProductForm';

// Import form sections
import BasicInfoSection from '@/components/products/form/BasicInfoSection';
import CategoriesSection from '@/components/products/form/CategoriesSection';
import TechnologiesSection from '@/components/products/form/TechnologiesSection';
import ScreenshotsSection from '@/components/products/form/ScreenshotsSection';
import VideosSection from '@/components/products/form/VideosSection';
import AgreementSection from '@/components/products/form/AgreementSection';
import FormActions from '@/components/products/form/FormActions';

const SubmitProductForm: React.FC = () => {
  const { user } = useAuth();
  const { form, isSubmitting, handleSubmit } = useProductForm(user?.id);

  const onSubmit = (data: ProductFormValues) => {
    handleSubmit(data, false);
  };

  const onSaveAsDraft = () => {
    handleSubmit(form.getValues(), true);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicInfoSection form={form} />

        <Tabs defaultValue="categories">
          <TabsList className="grid grid-cols-4 w-full mb-4">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="technologies">Technologies</TabsTrigger>
            <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
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
        </Tabs>

        <AgreementSection form={form} />

        <FormActions 
          isSubmitting={isSubmitting}
          onSaveAsDraft={onSaveAsDraft}
        />
      </form>
    </Form>
  );
};

export default SubmitProductForm;
