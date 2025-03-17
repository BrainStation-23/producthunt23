
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    productUpdates: true,
    newProducts: false,
    marketing: false,
    security: true
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // In a real app, you'd save these settings to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      toast.success('Notification settings updated successfully');
    } catch (error) {
      toast.error('Failed to update notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Control which notifications you receive from us.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for important updates.
              </p>
            </div>
            <Switch 
              id="emailNotifications" 
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="productUpdates" className="text-base">Product Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when your products receive updates or comments.
              </p>
            </div>
            <Switch 
              id="productUpdates" 
              checked={settings.productUpdates}
              onCheckedChange={() => handleToggle('productUpdates')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="newProducts" className="text-base">New Products</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about new product releases.
              </p>
            </div>
            <Switch 
              id="newProducts" 
              checked={settings.newProducts}
              onCheckedChange={() => handleToggle('newProducts')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing" className="text-base">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive marketing and promotional emails.
              </p>
            </div>
            <Switch 
              id="marketing" 
              checked={settings.marketing}
              onCheckedChange={() => handleToggle('marketing')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="security" className="text-base">Security Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get important security notifications about your account.
              </p>
            </div>
            <Switch 
              id="security" 
              checked={settings.security}
              onCheckedChange={() => handleToggle('security')}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationSettings;
