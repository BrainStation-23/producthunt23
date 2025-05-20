
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
}

const GradingTable = ({ judgingSummary, overallScore }: GradingTableProps) => {
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
      
      <div className="max-w-lg mx-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%] text-center">Criteria</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ratingResults.map((item) => (
              <TableRow key={item.criteria_id}>
                <TableCell className="font-medium">{item.criteria_name}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="font-bold">
                    {item.avg_rating !== null ? item.avg_rating.toFixed(1) : 'N/A'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            
            {overallScore !== null && (
              <TableRow className="font-bold">
                <TableCell>Overall Score</TableCell>
                <TableCell className="text-right">
                  <Badge className="bg-primary">
                    {overallScore.toFixed(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GradingTable;
