
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useProductDetail } from '@/hooks/useProductDetail';
import { useJudgeAssignments } from '@/hooks/useJudgeAssignments';
import { useJudgingCriteria } from '@/hooks/useJudgingCriteria';
import ProductOverview from '@/components/judge/evaluation/ProductOverview';
import EvaluationCriteriaForm from '@/components/judge/evaluation/EvaluationCriteriaForm';
import { ChevronLeft, Save, CheckCircle, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';
import { AssignedProduct } from '@/components/admin/settings/judging/types';

const ProductEvaluation: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { product, isLoading: isProductLoading } = useProductDetail(productId);
  const { criteria, isLoading: isCriteriaLoading } = useJudgingCriteria();
  const { assignedProducts, updateEvaluationStatus } = useJudgeAssignments();
  
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const currentProduct = assignedProducts.find(p => p.id === productId);
  
  useEffect(() => {
    if (currentProduct) {
      setStatus(currentProduct.evaluation_status || 'pending');
      setPriority(currentProduct.priority || 'medium');
      setNotes(currentProduct.notes || '');
      setDeadline(currentProduct.deadline ? new Date(currentProduct.deadline) : undefined);
    }
  }, [currentProduct]);

  const handleSaveStatus = async () => {
    if (!productId) return;
    
    setIsSaving(true);
    try {
      await updateEvaluationStatus.mutateAsync({
        productId,
        status,
        priority,
        notes,
        deadline: deadline ? deadline.toISOString() : null
      });
    } catch (error) {
      console.error('Error saving evaluation status:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = (newStatus: 'pending' | 'in_progress' | 'completed') => {
    setStatus(newStatus);
    
    if (newStatus === 'in_progress' && status === 'pending') {
      updateEvaluationStatus.mutate({
        productId: productId!,
        status: newStatus,
        priority,
        notes,
        deadline: deadline ? deadline.toISOString() : null
      });
    }
  };

  const handleCompleteEvaluation = async () => {
    if (!productId) return;
    
    const allCriteriaEvaluated = true;
    
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
        deadline: deadline ? deadline.toISOString() : null
      });
      
      toast.success('Evaluation completed successfully');
      navigate('/judge');
    } catch (error) {
      console.error('Error completing evaluation:', error);
    } finally {
      setIsSaving(false);
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
              <Button className="mt-4" onClick={() => navigate('/judge')}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
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
    deadline: deadline ? deadline.toISOString() : null,
    notes: notes
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate('/judge')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold tracking-tight mt-2">Product Evaluation</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={status} onValueChange={(value) => handleStatusChange(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priority} onValueChange={(value) => setPriority(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleSaveStatus} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            Save Status
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <ProductOverview product={assignedProduct} />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Evaluation Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <DatePicker 
                  date={deadline} 
                  onSelect={setDeadline} 
                  className="w-full mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Private notes about this evaluation</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Add your private notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[150px] mt-2"
                />
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
