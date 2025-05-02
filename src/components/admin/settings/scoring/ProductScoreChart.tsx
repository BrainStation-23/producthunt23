
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductScoreChartProps {
  productId: string;
}

export const ProductScoreChart: React.FC<ProductScoreChartProps> = ({ productId }) => {
  const { toast } = useToast();
  
  const { data: scoringSummary, isLoading, error } = useQuery({
    queryKey: ['product-scoring', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      try {
        // Get criteria
        const { data: criteriaData, error: criteriaError } = await supabase
          .from('judging_criteria')
          .select('id, name, type, description');
        
        if (criteriaError) throw criteriaError;
        
        // Get submissions for this product
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('judging_submissions')
          .select('criteria_id, judge_id, rating_value, boolean_value')
          .eq('product_id', productId);
        
        if (submissionsError) throw submissionsError;
        
        // Process the data to get the summary
        const summary = criteriaData.map((criteria: any) => {
          // Get all submissions for this criteria
          const criteriaSubmissions = submissionsData.filter((sub: any) => 
            sub.criteria_id === criteria.id
          );
          
          // Count judges
          const judgeCount = new Set(criteriaSubmissions.map((sub: any) => sub.judge_id)).size;
          
          if (criteria.type === 'boolean') {
            // For boolean criteria, count true/false values
            const trueCount = criteriaSubmissions.filter((sub: any) => sub.boolean_value === true).length;
            const falseCount = criteriaSubmissions.filter((sub: any) => sub.boolean_value === false).length;
            
            return {
              criteria_id: criteria.id,
              criteria_name: criteria.name,
              criteria_type: criteria.type,
              description: criteria.description,
              avg_rating: null,
              count_judges: judgeCount,
              count_true: trueCount,
              count_false: falseCount
            };
          } else {
            // For rating criteria, calculate average
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
              count_judges: judgeCount,
              count_true: 0,
              count_false: 0
            };
          }
        });
        
        // Filter out boolean criteria for the chart
        return summary.filter((item: any) => item.criteria_type !== 'boolean');
      } catch (err) {
        console.error("Error in scoring data fetch:", err);
        toast({
          title: "Error fetching scoring data",
          description: "Failed to load evaluation data",
          variant: "destructive",
        });
        throw err;
      }
    },
    enabled: !!productId
  });
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return "#22c55e"; // green-500
    if (score >= 6) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

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
        <p>Error loading chart data</p>
      </div>
    );
  }
  
  if (!scoringSummary || scoringSummary.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No rating data available for chart visualization
      </div>
    );
  }
  
  // Prepare data for chart
  const chartData = scoringSummary
    .filter((item: any) => item.avg_rating !== null)
    .map((item: any) => ({
      name: item.criteria_name,
      value: item.avg_rating,
      judges: item.count_judges
    }));
  
  // Get boolean criteria for cards
  const booleanCriteria = scoringSummary
    .filter((item: any) => item.criteria_type === 'boolean');
  
  // Custom tooltip content
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-2 border rounded-md shadow-md text-xs">
          <p className="font-medium">{data.name}</p>
          <p>Score: {data.value.toFixed(1)}/10</p>
          <p>{data.judges} judge(s)</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div className="h-80 w-full">
        <ChartContainer config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, bottom: 10, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                domain={[0, 10]} 
                tickCount={6} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip content={CustomTooltip} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getScoreColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      
      {booleanCriteria.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {booleanCriteria.map((item: any) => (
            <Card key={item.criteria_id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{item.criteria_name}</CardTitle>
                <CardDescription className="text-xs">
                  {item.count_judges} judge(s) responded
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-green-500 font-medium">{item.count_true || 0} Yes</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-red-500 font-medium">{item.count_false || 0} No</span>
                  </div>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-green-500 h-full" 
                    style={{ 
                      width: `${item.count_true ? (item.count_true / (item.count_true + item.count_false) * 100) : 0}%` 
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
