
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  SearchX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface LogError {
  id: string;
  service: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

interface ErrorsData {
  count: number;
  recent: LogError[];
}

interface SystemLogsPanelProps {
  errors?: ErrorsData;
}

const SystemLogsPanel: React.FC<SystemLogsPanelProps> = ({ errors }) => {
  if (!errors) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
          <CardDescription>No log data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Medium
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Info className="h-3 w-3 mr-1" />
            Low
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>
              Recent error logs and system warnings
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-auto">
            {errors.count} {errors.count === 1 ? 'Issue' : 'Issues'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {errors.recent && errors.recent.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errors.recent.map((error) => (
                <TableRow key={error.id}>
                  <TableCell className="font-medium">{error.service}</TableCell>
                  <TableCell className="max-w-md truncate">{error.message}</TableCell>
                  <TableCell>
                    {new Date(error.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>{getSeverityBadge(error.severity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <SearchX className="h-12 w-12 text-muted-foreground opacity-20 mb-2" />
            <h3 className="font-medium">No errors found</h3>
            <p className="text-sm text-muted-foreground max-w-md mt-1">
              No system errors or warnings have been recorded in the recent logs.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View All Logs</Button>
      </CardFooter>
    </Card>
  );
};

export default SystemLogsPanel;
