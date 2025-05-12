
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ScoringMetricsData {
  total_products: number;
  evaluated_products: number;
  average_score: number;
  high_scoring_count: number;
  low_scoring_count: number;
  evaluation_completion: number;
}

export const useScoringMetrics = () => {
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['scoring-metrics'],
    queryFn: async (): Promise<ScoringMetricsData> => {
      try {
        // Get total number of products that need evaluation
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id');
          
        if (productsError) throw productsError;
        
        const { data: submissions, error: submissionsError } = await supabase
          .from('judging_submissions')
          .select('product_id, judge_id, rating_value');
          
        if (submissionsError) throw submissionsError;
        
        const totalProducts = products?.length || 0;
        
        // Group submissions by product
        const productScores: Record<string, number[]> = {};
        submissions?.forEach((sub: any) => {
          if (sub.rating_value !== null) {
            if (!productScores[sub.product_id]) {
              productScores[sub.product_id] = [];
            }
            productScores[sub.product_id].push(sub.rating_value);
          }
        });
        
        // Calculate products that have been evaluated
        const evaluatedProducts = Object.keys(productScores).length;
        
        // Calculate average scores only for products that have been evaluated
        const productAvgScores = Object.entries(productScores).map(([id, scores]) => {
          return {
            id,
            avgScore: scores.reduce((sum, score) => sum + score, 0) / scores.length
          };
        });
        
        // Calculate overall metrics only for evaluated products
        const averageScore = productAvgScores.length > 0 
          ? productAvgScores.reduce((sum, item) => sum + item.avgScore, 0) / productAvgScores.length
          : 0;
          
        const highScoringCount = productAvgScores.filter(p => p.avgScore >= 8).length;
        const lowScoringCount = productAvgScores.filter(p => p.avgScore < 6).length;
        
        // Calculate evaluation progress - percentage of products evaluated out of total
        const evaluationCompletion = totalProducts > 0 
          ? (evaluatedProducts / totalProducts) * 100
          : 0;
        
        return {
          total_products: totalProducts,
          evaluated_products: evaluatedProducts,
          average_score: averageScore,
          high_scoring_count: highScoringCount,
          low_scoring_count: lowScoringCount,
          evaluation_completion: evaluationCompletion
        };
      } catch (err) {
        console.error("Error fetching metrics:", err);
        toast({
          title: "Error loading metrics",
          description: "Failed to load scoring metrics",
          variant: "destructive"
        });
        return {
          total_products: 0,
          evaluated_products: 0,
          average_score: 0,
          high_scoring_count: 0,
          low_scoring_count: 0,
          evaluation_completion: 0
        };
      }
    }
  });
  
  return {
    metrics: data,
    isLoading,
    error
  };
};
