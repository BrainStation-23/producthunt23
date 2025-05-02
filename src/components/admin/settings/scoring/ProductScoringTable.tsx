
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
import { Loader2, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductScoringTableProps {
  productId: string | null;
}

export const ProductScoringTable: React.FC<ProductScoringTableProps> = ({ productId }) => {
  const { toast } = useToast();
  
  const { data: scoringSummary, isLoading, error } = useQuery({
    queryKey: ['product-scoring', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      try {
        const { data, error } = await supabase
          .rpc('get_product_judging_summary', {
            product_uuid: productId
          });
          
        if (error) {
          toast({
            title: "Error fetching scoring data",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        return data;
      } catch (err) {
        console.error("Error in scoring data fetch:", err);
        throw err;
      }
    },
    enabled: !!productId,
    meta: {
      onError: (err: Error) => {
        console.error("Query error:", err);
      }
    }
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <AlertCircle className="h-8 w-8 text-destructive mb-2" />
        <p>Error loading scoring data</p>
        <p className="text-sm mt-2">Please try again later</p>
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

  const getRatingColor = (rating: number | null) => {
    if (rating === null) return "";
    if (rating >= 8) return "text-green-500";
    if (rating >= 6) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Criteria</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-center">Judges</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scoringSummary.map((score) => (
            <TableRow key={score.criteria_id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span className="truncate">{score.criteria_name}</span>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>{score.criteria_description || "No description available"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {score.criteria_description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {score.criteria_description}
                  </p>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {score.criteria_type || "Rating"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge>{score.count_judges || 0}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {score.criteria_type === 'boolean' ? (
                  <div className="text-sm">
                    <span className="text-green-500 font-medium">{score.count_true || 0} Yes</span> / 
                    <span className="text-red-500 font-medium ml-1">{score.count_false || 0} No</span>
                  </div>
                ) : (
                  <span className={cn("font-mono font-medium", getRatingColor(score.avg_rating))}>
                    {score.avg_rating ? score.avg_rating.toFixed(1) : "-"}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
