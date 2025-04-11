
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface PerformanceData {
  database?: {
    queryTime: number[];
    timestamps: string[];
  };
  api?: {
    responseTime: number[];
    timestamps: string[];
  };
}

interface PerformanceMetricsProps {
  performance?: PerformanceData;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ performance }) => {
  const [activeMetric, setActiveMetric] = useState('database');
  
  if (!performance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>No performance data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  // Format data for charts
  const formatChartData = (metric: 'database' | 'api') => {
    if (!performance[metric]) return [];
    
    const { timestamps, queryTime, responseTime } = performance[metric] as any;
    
    return timestamps.map((time: string, index: number) => ({
      time,
      value: metric === 'database' ? queryTime[index] : responseTime[index]
    }));
  };
  
  const databaseData = formatChartData('database');
  const apiData = formatChartData('api');
  
  // Calculate average and max values
  const calculateStats = (data: any[]) => {
    if (!data.length) return { avg: 0, max: 0 };
    
    const values = data.map(item => item.value);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = Math.round(sum / values.length);
    const max = Math.round(Math.max(...values));
    
    return { avg, max };
  };
  
  const dbStats = calculateStats(databaseData);
  const apiStats = calculateStats(apiData);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>
          Monitor response times and query execution performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeMetric} onValueChange={setActiveMetric}>
          <TabsList className="mb-4">
            <TabsTrigger value="database">Database Query Times</TabsTrigger>
            <TabsTrigger value="api">API Response Times</TabsTrigger>
          </TabsList>
          
          <TabsContent value="database" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Avg. Query Time</p>
                    <h3 className="text-2xl font-bold">{dbStats.avg} ms</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Max Query Time</p>
                    <h3 className="text-2xl font-bold">{dbStats.max} ms</h3>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={databaseData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    label={{ 
                      value: 'Time (ms)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fontSize: 12 }
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-md shadow-md p-2 text-xs">
                            <p className="font-medium">{label}</p>
                            <p>Query Time: {payload[0].value} ms</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Query Time"
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
                    <h3 className="text-2xl font-bold">{apiStats.avg} ms</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Max Response Time</p>
                    <h3 className="text-2xl font-bold">{apiStats.max} ms</h3>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={apiData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    label={{ 
                      value: 'Time (ms)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fontSize: 12 }
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-md shadow-md p-2 text-xs">
                            <p className="font-medium">{label}</p>
                            <p>Response Time: {payload[0].value} ms</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Response Time"
                    stroke="#82ca9d" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
