
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@supabase/supabase-js';
import { GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { ProfileData } from '@/hooks/useProfileForm';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface ProfileFormProps {
  user: User | null;
  formData: ProfileData;
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
  // Check which social profiles are verified
  const verifiedSocials = formData.verified_socials || [];
  const isGithubVerified = verifiedSocials.includes('github');
  const isLinkedinVerified = verifiedSocials.includes('linkedin');
  const isTwitterVerified = verifiedSocials.includes('twitter');

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
                  {isTwitterVerified && (
                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  )}
                </Label>
                <Input 
                  id="twitter" 
                  name="twitter"
                  type="url" 
                  value={formData.twitter || ''}
                  onChange={onInputChange}
                  placeholder="https://twitter.com/username" 
                  readOnly={isTwitterVerified}
                  className={isTwitterVerified ? "bg-gray-50" : ""}
                />
                {isTwitterVerified && (
                  <p className="text-xs text-muted-foreground">
                    Your Twitter profile is verified and cannot be changed.
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <LinkedInLogoIcon className="h-4 w-4" />
                  LinkedIn
                  {isLinkedinVerified && (
                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  )}
                </Label>
                <Input 
                  id="linkedin" 
                  name="linkedin"
                  type="url" 
                  value={formData.linkedin || ''}
                  onChange={onInputChange}
                  placeholder="https://linkedin.com/in/username" 
                  readOnly={isLinkedinVerified}
                  className={isLinkedinVerified ? "bg-gray-50" : ""}
                />
                {isLinkedinVerified && (
                  <p className="text-xs text-muted-foreground">
                    Your LinkedIn profile is verified and cannot be changed.
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="github" className="flex items-center gap-2">
                  <GitHubLogoIcon className="h-4 w-4" />
                  GitHub
                  {isGithubVerified && (
                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  )}
                </Label>
                <Input 
                  id="github" 
                  name="github"
                  type="url" 
                  value={formData.github || ''}
                  onChange={onInputChange}
                  placeholder="https://github.com/username" 
                  readOnly={isGithubVerified}
                  className={isGithubVerified ? "bg-gray-50" : ""}
                />
                {isGithubVerified && (
                  <p className="text-xs text-muted-foreground">
                    Your GitHub profile is verified and cannot be changed.
                  </p>
                )}
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
