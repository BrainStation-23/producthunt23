
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SubmitProductForm from '@/components/products/SubmitProductForm';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LogIn, Info, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const EditProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!user) {
    return (
      <div className="container py-4 sm:py-8 max-w-4xl mx-auto px-4 sm:px-6">
        <Alert>
          <AlertDescription className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>You need to be logged in to edit a product.</div>
            <Button onClick={() => navigate('/login')} className="whitespace-nowrap">
              <LogIn className="mr-2 h-4 w-4" /> Log In
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!productId) {
    return (
      <div className="container py-4 sm:py-8 max-w-4xl mx-auto px-4 sm:px-6">
        <Alert>
          <AlertDescription>
            No product ID provided. Please select a product to edit.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-4 sm:py-8 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col gap-4 mb-4 sm:mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/user/products')}
              className="p-0 h-8 w-8"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Product</h1>
          </div>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Make changes to the product details and save to update.
          </p>
        </div>

        {!isMobile && (
          <Card className="w-full md:w-auto">
            <CardContent className="p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Editing tips:</p>
                <ul className="list-disc pl-4 mt-1 space-y-1 text-muted-foreground">
                  <li>All fields with * are required</li>
                  <li>Update screenshots for better visibility</li>
                  <li>Ensure categories are relevant</li>
                  <li>Consider adding product videos</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <SubmitProductForm productId={productId} mode="edit" />
    </div>
  );
};

export default EditProductPage;
