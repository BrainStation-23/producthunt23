
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

interface ScoringData {
  criteria_id: string;
  criteria_name: string;
  criteria_type: string;
  description?: string;
  avg_rating: number;
  count_judges: number;
  count_true: number;
  count_false: number;
  weight: number;
}

export const ProductScoringTable: React.FC<ProductScoringTableProps> = ({ productId }) => {
  const { toast } = useToast();
  
  const { data: scoringSummary, isLoading, error } = useQuery({
    queryKey: ['product-scoring', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      try {
        // First get evaluation data
        const { data: evaluationData, error: evalError } = await supabase
          .from('judging_submissions')
          .select('criteria_id, judge_id, rating_value, boolean_value')
          .eq('product_id', productId);
          
        if (evalError) {
          throw evalError;
        }
        
        // Then get criteria data
        const { data: criteriaData, error: criteriaError } = await supabase
          .from('judging_criteria')
          .select('id, name, type, description, weight');
          
        if (criteriaError) {
          throw criteriaError;
        }
        
        // Process and summarize the data
        const summary = criteriaData.map((criteria: any) => {
          const criteriaSubmissions = evaluationData.filter((sub: any) => 
            sub.criteria_id === criteria.id
          );
          
          const judges = new Set(criteriaSubmissions.map((sub: any) => sub.judge_id)).size;
          
          // Calculate stats based on criteria type
          if (criteria.type === 'boolean') {
            const trueCount = criteriaSubmissions.filter((sub: any) => sub.boolean_value === true).length;
            const falseCount = criteriaSubmissions.filter((sub: any) => sub.boolean_value === false).length;
            
            return {
              criteria_id: criteria.id,
              criteria_name: criteria.name,
              criteria_type: criteria.type,
              description: criteria.description,
              avg_rating: null,
              count_judges: judges,
              count_true: trueCount,
              count_false: falseCount,
              weight: criteria.weight
            };
          } else {
            // Handle rating type criteria
            const validRatings = criteriaSubmissions
              .filter((sub: any) => sub.rating_value !== null)
              .map((sub: any) => sub.rating_value);
              
            const avgRating = validRatings.length > 0 
              ? validRatings.reduce((sum: number, val: number) => sum + val, 0) / validRatings.length
              : null;
              
            return {
              criteria_id: criteria.id,
              criteria_name: criteria.name,
              criteria_type: criteria.type,
              description: criteria.description,
              avg_rating: avgRating,
              count_judges: judges,
              count_true: 0,
              count_false: 0,
              weight: criteria.weight
            };
          }
        });
        
        return summary;
      } catch (err) {
        console.error("Error in scoring data fetch:", err);
        toast({
          title: "Error fetching scoring data",
          description: "Unable to load product evaluation data",
          variant: "destructive",
        });
        throw err;
      }
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
          {scoringSummary.map((score: ScoringData) => (
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
                        <p>{score.description || "No description available"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {score.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {score.description}
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
