
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/components/ui/sonner';

const UserProfile: React.FC = () => {
  const handleSave = () => {
    toast.success('Profile updated successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account details and public profile.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-[1fr_250px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Enter your last name" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" disabled />
                  <p className="text-xs text-muted-foreground">
                    Your email is used for login and cannot be changed.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="username" />
                  <p className="text-xs text-muted-foreground">
                    This will be your public username on the platform.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    className="min-h-32"
                  />
                  <p className="text-xs text-muted-foreground">
                    A brief description that will appear on your public profile.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" type="url" placeholder="https://example.com" />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input id="twitter" placeholder="@username" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input id="github" placeholder="username" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Upload a profile picture to personalize your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-xl">U</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">Upload Picture</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">Change Password</Button>
              <Separator />
              <Button variant="destructive" className="w-full">Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
