
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Judge } from '../JudgeAssignmentPanel';
import { ProductAssignDialog } from './ProductAssignDialog';

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

interface JudgeAssignmentDetailProps {
  judge: Judge;
  onAssignmentsUpdated: () => void;
}

export const JudgeAssignmentDetail: React.FC<JudgeAssignmentDetailProps> = ({
  judge,
  onAssignmentsUpdated
}) => {
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

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-muted/20">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            {judge.avatar_url ? <AvatarImage src={judge.avatar_url} /> : null}
            <AvatarFallback>
              {(judge.username ? judge.username[0] : judge.email[0]).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{judge.username || 'No username'}</h3>
            <p className="text-sm text-muted-foreground">{judge.email}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => setAssignDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Assign Products
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-1">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredAssignments && filteredAssignments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{assignment.product.name}</div>
                      <div className="text-sm text-muted-foreground">{assignment.product.tagline}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      assignment.product.status === 'approved' 
                        ? 'bg-green-50 text-green-700' 
                        : assignment.product.status === 'rejected'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {assignment.product.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(assignment.assigned_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDeleteAssignment(assignment.id)}
                      disabled={deletingAssignmentId === assignment.id}
                    >
                      {deletingAssignmentId === assignment.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'No products match your filters'
                : 'No products assigned to this judge yet'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={() => setAssignDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Assign First Product
              </Button>
            )}
          </div>
        )}
      </ScrollArea>

      <ProductAssignDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        judgeId={judge.id}
        onAssignmentAdded={handleAssignmentsChanged}
      />
    </div>
  );
};
