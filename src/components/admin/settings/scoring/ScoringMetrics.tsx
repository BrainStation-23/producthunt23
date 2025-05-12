
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CircleCheck, Award, TrendingUp, GitPullRequest } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ScoringMetricsProps {
  metrics: {
    total_products: number;
    evaluated_products: number;
    average_score: number;
    high_scoring_count: number;
    low_scoring_count: number;
    evaluation_completion: number;
  } | null;
  isLoading: boolean;
}

export const ScoringMetrics: React.FC<ScoringMetricsProps> = ({ metrics, isLoading }) => {
  const metricItems = [
    {
      title: "Products Evaluated",
      value: metrics?.evaluated_products || 0,
      description: `Out of ${metrics?.total_products || 0} products`,
      icon: CircleCheck,
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Average Score",
      value: metrics?.average_score ? metrics.average_score.toFixed(1) : "0.0",
      description: "For evaluated products only",
      icon: Award,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "High Scoring",
      value: metrics?.high_scoring_count || 0,
      description: "Products with score > 8.0",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "Completion Rate",
      value: metrics?.evaluation_completion ? `${Math.round(metrics.evaluation_completion)}%` : "0%",
      description: "Of all products evaluated",
      icon: GitPullRequest,
      color: "text-amber-500",
      bg: "bg-amber-100 dark:bg-amber-900/20"
    }
  ];

  if (isLoading) {
    return (
      <>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-16 mb-1" />
              <Skeleton className="h-4 w-28" />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  return (
    <>
      {metricItems.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <div className={`${item.bg} p-2 rounded-full`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
