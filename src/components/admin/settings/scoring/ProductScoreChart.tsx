
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
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
        
        // Filter out boolean criteria for the chart
        return data.filter((item: any) => item.criteria_type !== 'boolean');
      } catch (err) {
        console.error("Error in scoring data fetch:", err);
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
              <ChartTooltip
                content={(props) => (
                  <ChartTooltipContent {...props} formatter={(value, name) => {
                    return [`Score: ${value}/10 • ${props.payload?.[0]?.payload?.judges || 0} judge(s)`, ''];
                  }} />
                )}
              />
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
