
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

interface ProductScoringTableProps {
  productId: string | null;
}

export const ProductScoringTable: React.FC<ProductScoringTableProps> = ({ productId }) => {
  const { data: scoringSummary, isLoading } = useQuery({
    queryKey: ['product-scoring', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      const { data, error } = await supabase
        .rpc('get_product_judging_summary', {
          product_uuid: productId
        });
        
      if (error) throw error;
      return data;
    },
    enabled: !!productId
  });

  if (!productId) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Select a product to view its scoring details
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!scoringSummary || scoringSummary.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No evaluations found for this product
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Criteria</TableHead>
          <TableHead className="text-right">Judges</TableHead>
          <TableHead className="text-right">Average Rating</TableHead>
          <TableHead className="text-right">Yes/No Responses</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scoringSummary.map((score) => (
          <TableRow key={score.criteria_id}>
            <TableCell className="font-medium">{score.criteria_name}</TableCell>
            <TableCell className="text-right">{score.count_judges}</TableCell>
            <TableCell className="text-right">
              {score.avg_rating ? score.avg_rating.toFixed(1) : '-'}
            </TableCell>
            <TableCell className="text-right">
              {score.count_true || score.count_false ? (
                `${score.count_true || 0} Yes / ${score.count_false || 0} No`
              ) : '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
