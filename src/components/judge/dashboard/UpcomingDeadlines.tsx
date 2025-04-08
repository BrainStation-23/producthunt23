
import React from 'react';
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CalendarClock, AlertCircle, ArrowRight } from 'lucide-react';
import { AssignedProduct } from '@/components/admin/settings/judging/types';

interface UpcomingDeadlinesProps {
  upcomingDeadlines: AssignedProduct[];
}

const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ upcomingDeadlines }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Upcoming Deadlines
          </CardTitle>
          <Button variant="outline" asChild>
            <Link to="/judge/evaluations">
              View All Assignments
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <CardDescription>
          Evaluations due within the next 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingDeadlines.length > 0 ? (
          <div className="space-y-3">
            {upcomingDeadlines.map((product) => (
              <div key={product.id} className="flex items-start justify-between gap-2 border-b pb-3">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.tagline}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    Due: {new Date(product.deadline!).toLocaleDateString()}
                  </p>
                  <span className={`inline-flex text-xs items-center px-2 py-1 rounded-full ${
                    product.priority === 'high' 
                      ? 'bg-red-100 text-red-700' 
                      : product.priority === 'medium' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-green-100 text-green-700'
                  }`}>
                    {product.priority.charAt(0).toUpperCase() + product.priority.slice(1)} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p>No upcoming deadlines</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlines;
