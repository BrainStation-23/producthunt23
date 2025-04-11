
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  ServerIcon,
  Database,
  Code,
  Shield,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'failed';
  lastChecked: string;
  responseTime?: number;
  details?: string;
}

interface ServiceStatusCardProps {
  service: ServiceStatus;
}

const ServiceStatusCard: React.FC<ServiceStatusCardProps> = ({ service }) => {
  // Service icon mapping
  const getServiceIcon = () => {
    switch (service.name.toLowerCase()) {
      case 'database':
        return <Database className="h-5 w-5" />;
      case 'authentication':
        return <Shield className="h-5 w-5" />;
      case 'edge functions':
        return <Code className="h-5 w-5" />;
      case 'realtime':
        return <Zap className="h-5 w-5" />;
      default:
        return <ServerIcon className="h-5 w-5" />;
    }
  };
  
  // Status badge configuration
  const getStatusBadge = () => {
    switch (service.status) {
      case 'operational':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Operational
          </Badge>
        );
      case 'degraded':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Degraded
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {getServiceIcon()}
            <CardTitle className="text-base">{service.name}</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {service.responseTime !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Response Time:</span>
              <span className="font-medium">{service.responseTime}ms</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Checked:</span>
            <span className="font-medium">
              {new Date(service.lastChecked).toLocaleTimeString()}
            </span>
          </div>
          {service.details && (
            <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
              {service.details}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceStatusCard;
