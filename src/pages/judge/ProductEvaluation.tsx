
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useJudgingCriteria } from '@/hooks/useJudgingCriteria';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Save, Check } from 'lucide-react';
import { AssignedProduct, EvaluationSubmission } from '@/components/admin/settings/judging/types';
import EvaluationCriteriaForm from '@/components/judge/evaluation/EvaluationCriteriaForm';
import ProductOverview from '@/components/judge/evaluation/ProductOverview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProductEvaluation: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { criteria, isLoading: isCriteriaLoading } = useJudgingCriteria();
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [currentTab, setCurrentTab] = useState('overview');

  // Fetch the product information
  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) throw error;
        
        // Create a proper AssignedProduct by adding the required field
        const productAsAssigned: AssignedProduct = {
          ...data,
          assigned_at: new Date().toISOString(), // Use current time as a fallback
        };
        
        return productAsAssigned;
      } catch (error: any) {
        toast.error('Failed to load product information');
        console.error('Error fetching product:', error);
        return null;
      }
    }
  });

  // Fetch existing evaluations if any
  const { data: existingEvaluations, isLoading: isEvaluationsLoading } = useQuery({
    queryKey: ['evaluations', productId],
    queryFn: async () => {
      try {
        // Fix: get user ID properly from Supabase auth
        const { data: authData } = await supabase.auth.getUser();
        const judgeId = authData.user?.id;
        
        if (!judgeId) {
          throw new Error('No authenticated user found');
        }
        
        const { data, error } = await supabase
          .from('judging_submissions')
          .select('*')
          .eq('product_id', productId)
          .eq('judge_id', judgeId);

        if (error) throw error;
        
        // Convert array to object keyed by criteria_id for easier form initialization
        const evaluationsMap: Record<string, any> = {};
        data.forEach((submission: any) => {
          evaluationsMap[submission.criteria_id] = {
            rating_value: submission.rating_value,
            boolean_value: submission.boolean_value,
            text_value: submission.text_value
          };
        });
        
        return evaluationsMap;
      } catch (error: any) {
        toast.error('Failed to load existing evaluations');
        console.error('Error fetching evaluations:', error);
        return {};
      }
    },
    meta: {
      onSuccess: (data: Record<string, any>) => {
        setFormValues(data || {});
      }
    }
  });

  const isLoading = isProductLoading || isCriteriaLoading || isEvaluationsLoading;

  // Save evaluations mutation
  const { mutate: saveEvaluations, isPending } = useMutation({
    mutationFn: async (finalSubmit: boolean) => {
      const submissions: EvaluationSubmission[] = [];
      
      // Prepare submissions from form values
      Object.entries(formValues).forEach(([criteriaId, values]) => {
        submissions.push({
          product_id: productId!,
          criteria_id: criteriaId,
          ...values
        });
      });

      // Get the user ID
      const { data: authData } = await supabase.auth.getUser();
      const judgeId = authData.user?.id;
      
      if (!judgeId) {
        throw new Error('No authenticated user found');
      }

      // Upsert submissions
      const { error } = await supabase
        .from('judging_submissions')
        .upsert(
          submissions.map(submission => ({
            judge_id: judgeId,
            product_id: submission.product_id,
            criteria_id: submission.criteria_id,
            rating_value: submission.rating_value,
            boolean_value: submission.boolean_value,
            text_value: submission.text_value
          }))
        );

      if (error) throw error;

      return finalSubmit;
    },
    onSuccess: (finalSubmit) => {
      if (finalSubmit) {
        toast.success('Evaluation submitted successfully');
        navigate('/judge');
      } else {
        toast.success('Progress saved');
      }
    },
    onError: (error) => {
      toast.error('Failed to save evaluation');
      console.error('Error saving evaluation:', error);
    }
  });

  const handleCriteriaChange = (criteriaId: string, field: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [criteriaId]: {
        ...(prev[criteriaId] || {}),
        [field]: value
      }
    }));
  };

  const handleSave = (finalSubmit: boolean = false) => {
    saveEvaluations(finalSubmit);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Loading evaluation...</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Product Evaluation</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8">Loading evaluation criteria...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/judge')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Product Not Found</h1>
        </div>
        
        <Card>
          <CardContent className="text-center py-8">
            <p>The requested product could not be found or you do not have permission to evaluate it.</p>
            <Button onClick={() => navigate('/judge')} className="mt-4">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/judge')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Evaluate: {product.name}</h1>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Product Overview</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation Form</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ProductOverview product={product} />
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setCurrentTab('evaluation')}>
              Continue to Evaluation
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="evaluation">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Criteria</CardTitle>
              <CardDescription>
                Please provide your assessment for each of the following criteria.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EvaluationCriteriaForm 
                criteria={criteria} 
                formValues={formValues} 
                onChange={handleCriteriaChange} 
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => handleSave(false)}
                disabled={isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Progress
              </Button>
              <Button 
                onClick={() => handleSave(true)}
                disabled={isPending}
              >
                <Check className="mr-2 h-4 w-4" />
                Submit Evaluation
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductEvaluation;
