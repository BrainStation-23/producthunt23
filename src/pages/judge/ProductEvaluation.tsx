
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useProductDetail } from '@/hooks/useProductDetail';
import { useJudgeAssignments } from '@/hooks/useJudgeAssignments';
import { useJudgingCriteria } from '@/hooks/useJudgingCriteria';
import ProductOverview from '@/components/judge/evaluation/ProductOverview';
import EvaluationCriteriaForm from '@/components/judge/evaluation/EvaluationCriteriaForm';
import { ChevronLeft, Save, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AssignedProduct } from '@/components/admin/settings/judging/types';

const ProductEvaluation: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { product, isLoading: isProductLoading, screenshots } = useProductDetail(productId);
  const { criteria, isLoading: isCriteriaLoading } = useJudgingCriteria();
  const { assignedProducts, updateEvaluationStatus } = useJudgeAssignments();
  
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const currentProduct = assignedProducts.find(p => p.id === productId);
  const status = currentProduct?.evaluation_status || 'pending';
  const priority = currentProduct?.priority || 'medium';
  
  useEffect(() => {
    if (currentProduct) {
      setNotes(currentProduct.notes || '');
    }
  }, [currentProduct]);

  const handleSaveNotes = async () => {
    if (!productId) return;
    
    setIsSaving(true);
    try {
      await updateEvaluationStatus.mutateAsync({
        productId,
        status,
        priority,
        notes,
        deadline: new Date().toISOString() // Automatically set deadline to now
      });
      toast.success('Notes saved successfully');
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Error saving notes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteEvaluation = async () => {
    if (!productId) return;
    
    const allCriteriaEvaluated = true; // This would need actual validation logic
    
    if (!allCriteriaEvaluated) {
      toast.error('Please complete the evaluation for all criteria before submitting');
      return;
    }
    
    setIsSaving(true);
    try {
      await updateEvaluationStatus.mutateAsync({
        productId,
        status: 'completed',
        priority,
        notes,
        deadline: new Date().toISOString()
      });
      
      toast.success('Evaluation completed successfully');
      navigate('/judge/evaluations');
    } catch (error) {
      console.error('Error completing evaluation:', error);
      toast.error('Error completing evaluation');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Low Priority</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Medium Priority</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Priority</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isProductLoading || isCriteriaLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading evaluation...</p>
        </div>
      </div>
    );
  }

  if (!product) {
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
  }

  const assignedProduct: AssignedProduct = {
    ...product,
    assigned_at: currentProduct?.assigned_at || new Date().toISOString(),
    evaluation_status: status,
    priority: priority,
    deadline: new Date().toISOString(),
    notes: notes
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate('/judge/evaluations')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Evaluations
          </Button>
          <h1 className="text-3xl font-bold tracking-tight mt-2">Product Evaluation</h1>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(status)}
          {getPriorityBadge(priority)}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <ProductOverview product={assignedProduct} screenshots={screenshots} />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Evaluation Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Private notes about this evaluation</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Add your private notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[150px] mt-2"
                />
                <Button 
                  onClick={handleSaveNotes} 
                  disabled={isSaving}
                  className="mt-2"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <EvaluationCriteriaForm 
                productId={productId!} 
                criteria={criteria}
              />
              
              <Separator className="my-6" />
              
              <div className="flex justify-end">
                <Button 
                  size="lg" 
                  onClick={handleCompleteEvaluation}
                  disabled={isSaving || status === 'completed'}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Complete Evaluation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductEvaluation;
