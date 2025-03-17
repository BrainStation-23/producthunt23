
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SubmitProductForm from '@/components/products/SubmitProductForm';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LogIn, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SubmitProductPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <Alert>
          <AlertDescription className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>You need to be logged in to submit a product.</div>
            <Button onClick={() => navigate('/login')} className="whitespace-nowrap">
              <LogIn className="mr-2 h-4 w-4" /> Log In
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-start">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Submit Your Product</h1>
          <p className="text-muted-foreground mt-2">
            Share your product with the community. All submissions are reviewed by our team before being published.
          </p>
        </div>

        <Card className="w-full md:w-auto">
          <CardContent className="p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Submission tips:</p>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-muted-foreground">
                <li>Include high-quality screenshots</li>
                <li>Add a clear, descriptive tagline</li>
                <li>Provide a detailed description</li>
                <li>Tag with relevant categories</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <SubmitProductForm />
    </div>
  );
};

export default SubmitProductPage;
