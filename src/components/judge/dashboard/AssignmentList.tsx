
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { AssignedProduct } from '@/components/admin/settings/judging/types';
import { format } from 'date-fns';
import { Clock, AlertCircle, CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssignmentListProps {
  products: AssignedProduct[];
  isLoading: boolean;
}

const AssignmentList: React.FC<AssignmentListProps> = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-36" />
                </div>
                <Skeleton className="h-9 w-28" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="text-center p-6">
          <p className="text-muted-foreground">No assignments found for this category.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription className="line-clamp-1">{product.tagline}</CardDescription>
              </div>
              <StatusBadge status={product.evaluation_status || 'pending'} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                {product.deadline && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Due: {format(new Date(product.deadline), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <PriorityBadge priority={product.priority || 'medium'} />
                  {product.categories && product.categories.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {product.categories[0]}
                    </Badge>
                  )}
                </div>
                {product.notes && (
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    Note: {product.notes}
                  </p>
                )}
              </div>
              <Button asChild>
                <Link to={`/judge/evaluations/${product.id}`} className="w-full md:w-auto">
                  {product.evaluation_status === 'completed'
                    ? 'View Evaluation'
                    : product.evaluation_status === 'in_progress'
                    ? 'Continue Evaluation'
                    : 'Start Evaluation'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface StatusBadgeProps {
  status: 'pending' | 'in_progress' | 'completed';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1",
        status === 'completed' && "border-green-200 text-green-700 bg-green-50",
        status === 'in_progress' && "border-blue-200 text-blue-700 bg-blue-50",
        status === 'pending' && "border-amber-200 text-amber-700 bg-amber-50"
      )}
    >
      {status === 'completed' && <CheckCircle className="h-3 w-3" />}
      {status === 'in_progress' && <Clock className="h-3 w-3" />}
      {status === 'pending' && <AlertCircle className="h-3 w-3" />}
      <span className="capitalize">
        {status === 'in_progress' ? 'In Progress' : status}
      </span>
    </Badge>
  );
};

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        priority === 'high' && "border-red-200 text-red-700 bg-red-50",
        priority === 'medium' && "border-amber-200 text-amber-700 bg-amber-50",
        priority === 'low' && "border-green-200 text-green-700 bg-green-50"
      )}
    >
      {priority} Priority
    </Badge>
  );
};

export default AssignmentList;
