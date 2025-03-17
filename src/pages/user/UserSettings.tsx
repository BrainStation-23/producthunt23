
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountSettings from '@/components/user/settings/AccountSettings';
import NotificationSettings from '@/components/user/settings/NotificationSettings';
import PrivacySettings from '@/components/user/settings/PrivacySettings';

const UserSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      
      <Tabs defaultValue="account" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <AccountSettings />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-4">
          <PrivacySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
