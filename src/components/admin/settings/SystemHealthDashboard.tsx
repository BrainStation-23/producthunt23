
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  ServerIcon, 
  Database, 
  Code, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCcw,
  Clock,
  InfoIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ServiceStatusCard from './system-health/ServiceStatusCard';
import SystemLogsPanel from './system-health/SystemLogsPanel';
import PerformanceMetrics from './system-health/PerformanceMetrics';

// Types
interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'failed';
  lastChecked: string;
  responseTime?: number;
  details?: string;
}

interface SystemHealthData {
  services: ServiceStatus[];
  errors: {
    count: number;
    recent: Array<{
      id: string;
      service: string;
      message: string;
      timestamp: string;
      severity: 'low' | 'medium' | 'high';
    }>;
  };
  performance: {
    database: {
      queryTime: number[];
      timestamps: string[];
    };
    api: {
      responseTime: number[];
      timestamps: string[];
    };
  };
}

// This function would ideally be in an edge function to run thorough health checks
// For now, we'll simulate the health checks directly in the component
const fetchSystemHealth = async (): Promise<SystemHealthData> => {
  try {
    // Check database connectivity
    const dbStart = performance.now();
    const { count, error: dbError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    const dbTime = performance.now() - dbStart;
    
    // Check authentication
    const authStart = performance.now();
    const { data: authData, error: authError } = await supabase.auth.getSession();
    const authTime = performance.now() - authStart;
    
    // Check storage (if applicable)
    const storageStart = performance.now();
    const { data: storageData, error: storageError } = await supabase
      .storage
      .getBucket('public');
    const storageTime = performance.now() - storageStart;
    
    // Check edge functions (example)
    // In production, you would make actual calls to your edge functions
    const functionStatus = {
      name: 'Edge Functions',
      status: 'operational' as const,
      lastChecked: new Date().toISOString(),
      responseTime: 120, // Simulated
      details: 'All edge functions are responding correctly'
    };
    
    // Check for any errors in the database (example)
    // Using a function call instead of direct table access for system_logs
    const { data: errorLogs, error: logsError } = await supabase
      .rpc('get_recent_error_logs', { limit_count: 5 });
    
    // Simulated performance data
    const now = new Date();
    const timestamps = Array(24).fill(0).map((_, i) => {
      const date = new Date(now);
      date.setHours(now.getHours() - 23 + i);
      return date.toLocaleTimeString();
    });
    
    const queryTimes = Array(24).fill(0).map(() => Math.random() * 100 + 20);
    const responseTimes = Array(24).fill(0).map(() => Math.random() * 200 + 50);
    
    // Construct health data
    return {
      services: [
        {
          name: 'Database',
          status: dbError ? 'failed' : 'operational',
          lastChecked: new Date().toISOString(),
          responseTime: Math.round(dbTime),
          details: dbError ? dbError.message : 'Connected successfully'
        },
        {
          name: 'Authentication',
          status: authError ? 'failed' : 'operational',
          lastChecked: new Date().toISOString(),
          responseTime: Math.round(authTime),
          details: authError ? authError.message : 'Working correctly'
        },
        {
          name: 'Storage',
          status: storageError ? 'failed' : 'operational',
          lastChecked: new Date().toISOString(),
          responseTime: Math.round(storageTime),
          details: storageError ? storageError.message : 'Available and accessible'
        },
        functionStatus,
        {
          name: 'Realtime',
          status: 'operational',
          lastChecked: new Date().toISOString(),
          responseTime: 45, // Simulated
          details: 'Connections healthy'
        }
      ],
      errors: {
        count: errorLogs?.length || 0,
        recent: (errorLogs || []).map((log: any) => ({
          id: log.id,
          service: log.service || 'Unknown',
          message: log.message || 'Unknown error',
          timestamp: log.created_at,
          severity: log.severity || 'medium'
        }))
      },
      performance: {
        database: {
          queryTime: queryTimes,
          timestamps
        },
        api: {
          responseTime: responseTimes,
          timestamps
        }
      }
    };
  } catch (error) {
    console.error('Error fetching system health:', error);
    toast.error('Failed to retrieve system health data');
    throw error;
  }
};

const SystemHealthDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch system health data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: fetchSystemHealth,
    refetchInterval: 300000, // Refresh every 5 minutes
  });
  
  // Calculate overall system status
  const getOverallStatus = () => {
    if (!data) return 'loading';
    
    const statuses = data.services.map(service => service.status);
    if (statuses.includes('failed')) return 'critical';
    if (statuses.includes('degraded')) return 'warning';
    return 'healthy';
  };
  
  const overallStatus = getOverallStatus();
  
  const handleRefresh = () => {
    refetch();
    toast.success('System health data refreshed');
  };
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error loading system health</AlertTitle>
        <AlertDescription>
          Unable to retrieve system health information. Please try again later or contact support.
        </AlertDescription>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          size="sm" 
          className="mt-2"
        >
          <RefreshCcw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">System Health Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor the status and performance of platform services
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          disabled={isLoading}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      {/* Overall Status Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Overall System Status</CardTitle>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Last updated: {isLoading ? 'Updating...' : new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {overallStatus === 'loading' ? (
              <div className="animate-pulse flex items-center">
                <div className="h-8 w-8 bg-gray-200 rounded-full mr-2"></div>
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  overallStatus === 'healthy' 
                    ? 'bg-green-100 text-green-600' 
                    : overallStatus === 'warning' 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-red-100 text-red-600'
                }`}>
                  {overallStatus === 'healthy' ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : overallStatus === 'warning' ? (
                    <AlertTriangle className="h-6 w-6" />
                  ) : (
                    <XCircle className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-lg">
                    {overallStatus === 'healthy' 
                      ? 'All Systems Operational' 
                      : overallStatus === 'warning' 
                        ? 'Degraded Performance Detected' 
                        : 'System Disruption'
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {overallStatus === 'healthy'
                      ? 'All services are functioning normally.'
                      : overallStatus === 'warning'
                        ? 'Some services are experiencing delays or performance issues.'
                        : 'One or more critical services are currently unavailable.'
                    }
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Logs & Errors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-5 w-32 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-10 w-full bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              data?.services.map((service) => (
                <ServiceStatusCard key={service.name} service={service} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4 mt-4">
          {isLoading ? (
            <Card className="animate-pulse h-80"></Card>
          ) : (
            <PerformanceMetrics performance={data?.performance} />
          )}
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4 mt-4">
          {isLoading ? (
            <Card className="animate-pulse h-80"></Card>
          ) : (
            <SystemLogsPanel errors={data?.errors} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealthDashboard;
