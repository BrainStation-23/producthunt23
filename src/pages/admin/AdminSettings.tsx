
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GeneralSettings from '@/components/admin/settings/GeneralSettings';
import CategoriesSettings from '@/components/admin/settings/CategoriesSettings';
import FeaturedContentSettings from '@/components/admin/settings/FeaturedContentSettings';
import SystemHealthDashboard from '@/components/admin/settings/SystemHealthDashboard';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  useDocumentTitle('Admin Settings');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your platform settings and configurations.
        </p>
      </div>
      
      <Tabs 
        defaultValue="general" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="featured">Featured Content</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <GeneralSettings />
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <CategoriesSettings />
        </TabsContent>
        
        <TabsContent value="featured" className="space-y-4">
          <FeaturedContentSettings />
        </TabsContent>
        
        <TabsContent value="health" className="space-y-4">
          <SystemHealthDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
