
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';
import AssignJudgeDialog from './AssignJudgeDialog';
import ProductJudgeStatus from './status/ProductJudgeStatus';
import { AssignmentTable } from './assignment/AssignmentTable';
import type { Assignment } from './assignment/hooks/useJudgeAssignments';

const AssignmentManager: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [deletingAssignmentId, setDeletingAssignmentId] = useState<string | null>(null);

  // Fetch pending and approved products
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['assignable-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, tagline, image_url, status')
        .in('status', ['pending', 'approved'])
        .order('created_at', { ascending: false });

      if (error) {
        toast.error(`Failed to load products: ${error.message}`);
        throw error;
      }

      return data;
    }
  });

  // Fetch assignments for the selected product
  const { 
    data: assignments, 
    isLoading: isLoadingAssignments,
    refetch: refetchAssignments
  } = useQuery({
    queryKey: ['product-assignments', selectedProduct],
    queryFn: async () => {
      if (!selectedProduct) return [];

      // First get the assignments
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('judge_assignments')
        .select('id, judge_id, product_id, assigned_at')
        .eq('product_id', selectedProduct);

      if (assignmentError) {
        toast.error(`Failed to load assignments: ${assignmentError.message}`);
        throw assignmentError;
      }

      if (!assignmentData || assignmentData.length === 0) {
        return [];
      }

      // Get all judge IDs from assignments
      const judgeIds = assignmentData.map(assignment => assignment.judge_id);
      
      // Fetch evaluation data for this product
      const { data: evaluationsData, error: evaluationsError } = await supabase
        .from('judging_submissions')
        .select('judge_id, product_id')
        .eq('product_id', selectedProduct)
        .in('judge_id', judgeIds);
        
      if (evaluationsError) {
        console.error('Error fetching evaluations:', evaluationsError);
        // Continue without evaluation data
      }
      
      // Create a map of judges who have submitted evaluations
      const judgedMap = new Map();
      if (evaluationsData) {
        evaluationsData.forEach(evaluation => {
          judgedMap.set(evaluation.judge_id, true);
        });
      }

      // Then fetch judge details for each assignment
      const assignmentsWithDetails = await Promise.all(
        assignmentData.map(async (assignment) => {
          const { data: judgeData, error: judgeError } = await supabase
            .from('profiles')
            .select('id, username, email, avatar_url')
            .eq('id', assignment.judge_id)
            .single();

          if (judgeError) {
            console.error('Error fetching judge data:', judgeError);
            return null;
          }

          const { data: productData, error: productError } = await supabase
            .from('products')
            .select('id, name, tagline, image_url, status')
            .eq('id', assignment.product_id)
            .single();

          if (productError) {
            console.error('Error fetching product data:', productError);
            return null;
          }

          // Add hasSubmissions property based on our evaluations data
          const hasSubmissions = judgedMap.has(assignment.judge_id);
          
          return {
            ...assignment,
            judge: judgeData,
            product: {
              ...productData,
              hasSubmissions
            }
          };
        })
      );

      // Filter out any null results from failed fetches
      return assignmentsWithDetails.filter(Boolean) as Assignment[];
    },
    enabled: !!selectedProduct
  });

  // Get product judging status
  const getProductJudgingStatus = (productId: string) => {
    if (!assignments || assignments.length === 0) {
      return { isAssigned: false, isJudged: false };
    }
    
    const isAssigned = true; // If we have assignments, it's assigned
    const isJudged = assignments.some(a => a.product.hasSubmissions);
    
    return { isAssigned, isJudged };
  };

  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId);
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      setDeletingAssignmentId(assignmentId);
      
      const { error } = await supabase
        .from('judge_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      await refetchAssignments();
      toast.success("Judge assignment removed successfully");
    } catch (error: any) {
      toast.error(`Failed to remove assignment: ${error.message}`);
    } finally {
      setDeletingAssignmentId(null);
    }
  };

  const isLoading = isLoadingProducts || (selectedProduct && isLoadingAssignments);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Product Assignments</h3>
        <p className="text-muted-foreground mb-4">Assign products to judges for evaluation.</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:items-center">
        <div className="w-full sm:w-64">
          <Select 
            value={selectedProduct || ''}
            onValueChange={handleProductChange}
            disabled={isLoading || !products || products.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products?.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProduct && (
          <ProductJudgeStatus 
            {...getProductJudgingStatus(selectedProduct)}
          />
        )}
        
        <Button 
          onClick={() => setAssignDialogOpen(true)}
          disabled={!selectedProduct || isLoading}
          className="sm:ml-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Assign Judge
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : selectedProduct ? (
        assignments && assignments.length > 0 ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>
                Assigned Judges
              </CardTitle>
              <CardDescription>
                Judges assigned to evaluate {products?.find(p => p.id === selectedProduct)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AssignmentTable
                assignments={assignments}
                deletingAssignmentId={deletingAssignmentId}
                onDeleteAssignment={handleDeleteAssignment}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No judges assigned to this product yet.</p>
            <Button 
              className="mt-4" 
              onClick={() => setAssignDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Assign First Judge
            </Button>
          </Card>
        )
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Select a product to manage judge assignments.</p>
        </Card>
      )}

      {selectedProduct && (
        <AssignJudgeDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          productId={selectedProduct}
          onAssignmentAdded={() => {
            refetchAssignments();
            toast.success("Judge assigned successfully");
          }}
        />
      )}
    </div>
  );
};

export default AssignmentManager;
