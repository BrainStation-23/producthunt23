
import Papa from 'papaparse';
import { toast } from 'sonner';

interface LeaderboardItem {
  product_id: string;
  product_name: string;
  product_image: string | null;
  total_score: number;
  avg_rating: number;
  judges_count: number;
  rank: number | bigint;
}

export function exportLeaderboardToCsv(data: LeaderboardItem[], filename: string) {
  try {
    toast.info('Preparing CSV export...');
    
    // Format data for CSV (only include the fields we need)
    const csvData = data.map(item => ({
      rank: typeof item.rank === 'bigint' ? Number(item.rank) : item.rank,
      product_name: item.product_name,
      total_score: (item.total_score * 10).toFixed(2), // Convert to 100 scale (scores are out of 10)
      avg_rating: item.avg_rating.toFixed(1),
      judges_count: item.judges_count
    }));
    
    // Generate CSV string using PapaParse
    const csv = Papa.unparse(csvData);
    
    // Create blob and trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.toLowerCase().replace(/\s+/g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Leaderboard exported successfully');
  } catch (error) {
    console.error('Error exporting CSV:', error);
    toast.error('Failed to export CSV file');
  }
}
