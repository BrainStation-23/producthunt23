
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@supabase/supabase-js';

interface ProfileFormProps {
  user: User | null;
  formData: {
    username: string | null;
    bio: string | null;
    website: string | null;
  };
  isSaving: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => Promise<void>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  user, 
  formData, 
  isSaving, 
  onInputChange, 
  onSave 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal details and public profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={user?.email || ''} 
              disabled 
            />
            <p className="text-xs text-muted-foreground">
              Your email is used for login and cannot be changed here.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              name="username"
              value={formData.username || ''}
              onChange={onInputChange}
              placeholder="username" 
            />
            <p className="text-xs text-muted-foreground">
              This will be your public username on the platform.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio || ''}
              onChange={onInputChange}
              placeholder="Tell us about yourself"
              className="min-h-32"
            />
            <p className="text-xs text-muted-foreground">
              A brief description that will appear on your public profile.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input 
              id="website" 
              name="website"
              type="url" 
              value={formData.website || ''}
              onChange={onInputChange}
              placeholder="https://example.com" 
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
