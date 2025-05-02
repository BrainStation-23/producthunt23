
import React from 'react';
import { SystemLogsPanel } from './system-health/SystemLogsPanel';
import { PerformanceMetrics } from './system-health/PerformanceMetrics';
import { ServiceStatusCard } from './system-health/ServiceStatusCard';
import StorageCleanupPanel from './system-health/StorageCleanupPanel';

const SystemHealthDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">System Health</h2>
        <p className="text-muted-foreground">
          Monitor the health and performance of your platform.
        </p>
      </div>

      {/* Service Status Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <ServiceStatusCard 
          service="Database" 
          status="operational" 
          latency="45ms" 
          uptime="99.99%" 
        />
        <ServiceStatusCard 
          service="Storage" 
          status="operational" 
          latency="120ms" 
          uptime="99.95%" 
        />
        <ServiceStatusCard 
          service="Authentication" 
          status="operational" 
          latency="85ms" 
          uptime="99.97%" 
        />
      </div>
      
      {/* Performance Metrics */}
      <PerformanceMetrics />
      
      {/* Storage Cleanup Panel */}
      <StorageCleanupPanel />
      
      {/* System Logs Panel */}
      <SystemLogsPanel />
    </div>
  );
};

export default SystemHealthDashboard;
