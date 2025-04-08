
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const ProductNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-lg font-semibold">Product not found</p>
            <p className="text-muted-foreground mt-1">
              The product you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button className="mt-4" onClick={() => navigate('/judge/evaluations')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Evaluations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductNotFound;
