
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@supabase/supabase-js';
import { GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';

interface ProfileFormProps {
  user: User | null;
  formData: {
    username: string | null;
    bio: string | null;
    website: string | null;
    twitter: string | null;
    linkedin: string | null;
    github: string | null;
  };
  isSaving: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => Promise<void>;
}

// Helper functions for form placeholders
const formatGithubPlaceholder = (value: string | null): string => {
  if (!value) return 'https://github.com/username';
  return value.includes('github.com') ? value : `https://github.com/${value}`;
};

const formatTwitterPlaceholder = (value: string | null): string => {
  if (!value) return 'https://twitter.com/username';
  if (value.startsWith('@')) return `https://twitter.com/${value.substring(1)}`;
  return value.includes('twitter.com') ? value : `https://twitter.com/${value}`;
};

const formatLinkedInPlaceholder = (value: string | null): string => {
  if (!value) return 'https://linkedin.com/in/username';
  return value.includes('linkedin.com') ? value : `https://linkedin.com/in/${value}`;
};

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

          <div className="pt-2 border-t">
            <h3 className="text-lg font-medium mb-3">Social Media Profiles</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <TwitterLogoIcon className="h-4 w-4" />
                  Twitter
                </Label>
                <Input 
                  id="twitter" 
                  name="twitter"
                  type="url" 
                  value={formData.twitter || ''}
                  onChange={onInputChange}
                  placeholder={formatTwitterPlaceholder(formData.twitter)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your Twitter username or full profile URL
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <LinkedInLogoIcon className="h-4 w-4" />
                  LinkedIn
                </Label>
                <Input 
                  id="linkedin" 
                  name="linkedin"
                  type="url" 
                  value={formData.linkedin || ''}
                  onChange={onInputChange}
                  placeholder={formatLinkedInPlaceholder(formData.linkedin)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your LinkedIn username or full profile URL
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="github" className="flex items-center gap-2">
                  <GitHubLogoIcon className="h-4 w-4" />
                  GitHub
                </Label>
                <Input 
                  id="github" 
                  name="github"
                  type="url" 
                  value={formData.github || ''}
                  onChange={onInputChange}
                  placeholder={formatGithubPlaceholder(formData.github)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your GitHub username or full profile URL
                </p>
              </div>
            </div>
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
