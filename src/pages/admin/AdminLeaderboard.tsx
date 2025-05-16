
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import LeaderboardTable from '@/components/admin/settings/scoring/LeaderboardTable';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { exportLeaderboardToCsv } from '@/utils/csvExport';
import { ExportCsvButton } from '@/components/admin/settings/scoring/ExportCsvButton';

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
        // The total_score is already scaled to 0-100 by the database function
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

  const handleExportCsv = () => {
    if (leaderboard && leaderboard.length > 0) {
      exportLeaderboardToCsv(leaderboard, 'product-leaderboard');
    } else {
      toast({
        title: "Cannot export empty data",
        description: "There is no leaderboard data available to export.",
        variant: "destructive",
      });
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Leaderboard</h1>
          <p className="text-muted-foreground mb-6">
            View overall product rankings based on judge evaluations.
          </p>
        </div>
        <ExportCsvButton 
          onClick={handleExportCsv} 
          isDisabled={!leaderboard || leaderboard.length === 0} 
        />
      </div>

      <Card className="p-6">
        <LeaderboardTable data={leaderboard || []} />
      </Card>
    </div>
  );
};

export default AdminLeaderboard;
