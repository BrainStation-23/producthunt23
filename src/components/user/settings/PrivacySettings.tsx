
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const PrivacySettings: React.FC = () => {
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    activityVisibility: 'followers',
    allowTagging: true,
    showOnlineStatus: true,
    allowDataCollection: true
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (key: 'allowTagging' | 'showOnlineStatus' | 'allowDataCollection') => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectChange = (value: string, key: 'profileVisibility' | 'activityVisibility') => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // In a real app, you'd save these settings to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      toast.success('Privacy settings updated successfully');
    } catch (error) {
      toast.error('Failed to update privacy settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>
          Control your privacy and data settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profileVisibility">Profile Visibility</Label>
            <Select 
              value={settings.profileVisibility}
              onValueChange={(value) => handleSelectChange(value, 'profileVisibility')}
            >
              <SelectTrigger id="profileVisibility">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="followers">Followers Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Control who can see your profile information.
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="activityVisibility">Activity Visibility</Label>
            <Select 
              value={settings.activityVisibility}
              onValueChange={(value) => handleSelectChange(value, 'activityVisibility')}
            >
              <SelectTrigger id="activityVisibility">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="followers">Followers Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Control who can see your activities like comments and upvotes.
            </p>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowTagging" className="text-base">Allow Tagging</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to tag you in comments and posts.
              </p>
            </div>
            <Switch 
              id="allowTagging" 
              checked={settings.allowTagging}
              onCheckedChange={() => handleToggle('allowTagging')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="showOnlineStatus" className="text-base">Show Online Status</Label>
              <p className="text-sm text-muted-foreground">
                Show when you're online to other users.
              </p>
            </div>
            <Switch 
              id="showOnlineStatus" 
              checked={settings.showOnlineStatus}
              onCheckedChange={() => handleToggle('showOnlineStatus')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowDataCollection" className="text-base">Data Collection</Label>
              <p className="text-sm text-muted-foreground">
                Allow us to collect anonymous usage data to improve our service.
              </p>
            </div>
            <Switch 
              id="allowDataCollection" 
              checked={settings.allowDataCollection}
              onCheckedChange={() => handleToggle('allowDataCollection')}
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

export default PrivacySettings;
