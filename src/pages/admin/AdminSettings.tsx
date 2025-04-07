
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import CategoriesSettings from '@/components/admin/settings/CategoriesSettings';
import FeaturedContentSettings from '@/components/admin/settings/FeaturedContentSettings';
import GeneralSettings from '@/components/admin/settings/GeneralSettings';
import JudgingSettings from '@/components/admin/settings/judging/JudgingSettings';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('categories');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure platform settings and manage content.
        </p>
      </div>
      
      <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-transparent p-0 mb-8 grid grid-cols-4 md:grid-cols-5 gap-2">
          <TabsTrigger value="categories" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Categories
          </TabsTrigger>
          <TabsTrigger value="featured" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Featured Content
          </TabsTrigger>
          <TabsTrigger value="judging" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Judging
          </TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            General
          </TabsTrigger>
        </TabsList>
        
        <Card className="p-6">
          <TabsContent value="categories" className="mt-0">
            <CategoriesSettings />
          </TabsContent>
          
          <TabsContent value="featured" className="mt-0">
            <FeaturedContentSettings />
          </TabsContent>
          
          <TabsContent value="judging" className="mt-0">
            <JudgingSettings />
          </TabsContent>
          
          <TabsContent value="general" className="mt-0">
            <GeneralSettings />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
