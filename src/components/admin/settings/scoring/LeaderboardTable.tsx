
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingUp } from 'lucide-react';

interface LeaderboardItem {
  product_id: string;
  product_name: string;
  product_image: string | null;
  total_score: number;
  avg_rating: number;
  judges_count: number;
  rank: number | bigint; // Updated to accept bigint as well
}

interface LeaderboardTableProps {
  data: LeaderboardItem[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-14">Rank</TableHead>
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Score (0-100)</TableHead>
          <TableHead className="text-right">Avg Rating</TableHead>
          <TableHead className="text-right">Judges</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.product_id} className="group">
            <TableCell className="font-mono">
              {item.rank === 1 && <TrendingUp className="h-4 w-4 text-primary inline mr-1" />}
              #{item.rank.toString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                {item.product_image ? (
                  <div className="h-10 w-10 rounded overflow-hidden shrink-0">
                    <img 
                      src={item.product_image} 
                      alt={item.product_name}
                      className="h-full w-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-muted-foreground">
                      {item.product_name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="font-medium">{item.product_name}</span>
              </div>
            </TableCell>
            <TableCell className="text-right font-medium">
              {item.total_score.toFixed(2)}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {item.avg_rating.toFixed(1)}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {item.judges_count}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LeaderboardTable;
