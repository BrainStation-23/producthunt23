
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import LeaderboardTable from '@/components/admin/settings/scoring/LeaderboardTable';
import useDocumentTitle from '@/hooks/useDocumentTitle';

// Define the correct type for leaderboard items
interface LeaderboardItem {
  product_id: string;
  product_name: string;
  product_image: string | null;
  total_score: number;
  avg_rating: number;
  judges_count: number;
  rank: number | bigint;
}

const AdminLeaderboard = () => {
  const { toast } = useToast();
  useDocumentTitle('Product Leaderboard | Admin');

  const { data: leaderboard, isLoading, error } = useQuery({
    queryKey: ['product-leaderboard'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_product_leaderboard');
          
        if (error) {
          toast({
            title: "Error loading leaderboard",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        
        // Ensure the data is in the correct format
        const formattedData = data?.map((item: any) => ({
          ...item,
          // Ensure rank is properly converted if needed
          rank: typeof item.rank === 'bigint' ? Number(item.rank) : item.rank
        }));
        
        return formattedData;
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        throw err;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Failed to load leaderboard data
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Leaderboard</h1>
        <p className="text-muted-foreground mb-6">
          View overall product rankings based on judge evaluations.
        </p>
      </div>

      <Card className="p-6">
        <LeaderboardTable data={leaderboard || []} />
      </Card>
    </div>
  );
};

export default AdminLeaderboard;
