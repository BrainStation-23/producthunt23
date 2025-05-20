
import React from 'react';
import { Award } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

interface JudgingSummaryItem {
  criteria_id: string;
  criteria_name: string;
  criteria_type: string;
  avg_rating: number | null;
  count_judges: number;
  count_true: number;
  count_false: number;
  weight: number;
}

interface GradingTableProps {
  judgingSummary: JudgingSummaryItem[];
  overallScore: number | null;
  detailed?: boolean;
}

const GradingTable = ({ judgingSummary, overallScore, detailed = false }: GradingTableProps) => {
  if (!judgingSummary || judgingSummary.length === 0) {
    return null;
  }

  const ratingResults = judgingSummary.filter(item => 
    item.criteria_type === 'rating' && item.avg_rating !== null
  );

  if (ratingResults.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center">
        <Award className="mr-2" /> 
        Evaluation Results
      </h3>
      
      <div className={`${detailed ? 'w-full' : 'max-w-lg'} mx-auto`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%] text-left">Criteria</TableHead>
              <TableHead className="text-center">Score</TableHead>
              {detailed && <TableHead className="text-center">Weight</TableHead>}
              {detailed && <TableHead className="text-right">Judges</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {ratingResults.map((item) => (
              <TableRow key={item.criteria_id}>
                <TableCell className="font-medium text-left">{item.criteria_name}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={detailed ? "outline" : "default"} className={`font-bold ${detailed ? 'px-3 py-0.5' : ''}`}>
                    {item.avg_rating !== null ? item.avg_rating.toFixed(1) : 'N/A'}
                  </Badge>
                </TableCell>
                {detailed && (
                  <TableCell className="text-center text-muted-foreground">
                    {item.weight}%
                  </TableCell>
                )}
                {detailed && (
                  <TableCell className="text-right text-muted-foreground">
                    {item.count_judges}
                  </TableCell>
                )}
              </TableRow>
            ))}
            
            {overallScore !== null && (
              <TableRow className="font-bold border-t-2">
                <TableCell className="text-left">Overall Score</TableCell>
                <TableCell className="text-center">
                  <Badge className="bg-primary px-3 py-0.5">
                    {overallScore.toFixed(1)}
                  </Badge>
                </TableCell>
                {detailed && <TableCell className="text-center">100%</TableCell>}
                {detailed && <TableCell className="text-right">-</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GradingTable;
