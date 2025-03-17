
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-5xl mx-auto py-8">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm">
              This product could not be found or has been removed.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default ProductNotFound;
