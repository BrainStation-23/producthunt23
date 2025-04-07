
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Judge } from '../../types';

interface Product {
  id: string;
  name: string;
  tagline: string;
  image_url: string | null;
  status: string;
}

interface Assignment {
  id: string;
  judge_id: string;
  product_id: string;
  assigned_at: string;
  product: Product;
}

export const useJudgeAssignments = (judge: Judge, onAssignmentsUpdated: () => void) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [deletingAssignmentId, setDeletingAssignmentId] = useState<string | null>(null);

  // Fetch assignments for the selected judge
  const { 
    data: assignments, 
    isLoading,
    refetch: refetchAssignments
  } = useQuery({
    queryKey: ['judge-assignments', judge.id],
    queryFn: async () => {
      // Get the assignments
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('judge_assignments')
        .select('id, judge_id, product_id, assigned_at')
        .eq('judge_id', judge.id);

      if (assignmentError) {
        toast.error(`Failed to load assignments: ${assignmentError.message}`);
        throw assignmentError;
      }

      if (!assignmentData || assignmentData.length === 0) {
        return [];
      }

      const productIds = assignmentData.map(a => a.product_id);
      
      // Fetch all products in one query
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, tagline, image_url, status')
        .in('id', productIds);
        
      if (productsError) {
        toast.error(`Failed to load products: ${productsError.message}`);
        throw productsError;
      }
      
      // Map products to assignments
      const assignmentsWithProducts = assignmentData.map(assignment => {
        const product = productsData.find(p => p.id === assignment.product_id);
        return {
          ...assignment,
          product
        };
      });

      return assignmentsWithProducts as Assignment[];
    },
    enabled: !!judge.id
  });

  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      setDeletingAssignmentId(assignmentId);
      
      const { error } = await supabase
        .from('judge_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      await refetchAssignments();
      onAssignmentsUpdated();
      toast.success("Product assignment removed successfully");
    } catch (error: any) {
      toast.error(`Failed to remove assignment: ${error.message}`);
    } finally {
      setDeletingAssignmentId(null);
    }
  };

  const handleAssignmentsChanged = () => {
    refetchAssignments();
    onAssignmentsUpdated();
  };

  // Filter assignments based on search and status
  const filteredAssignments = assignments?.filter(assignment => {
    const matchesSearch = 
      searchQuery === '' || 
      assignment.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.product.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      assignment.product.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    assignDialogOpen,
    setAssignDialogOpen,
    deletingAssignmentId,
    assignments,
    filteredAssignments,
    isLoading,
    handleDeleteAssignment,
    handleAssignmentsChanged
  };
};

export type { Assignment, Product };
