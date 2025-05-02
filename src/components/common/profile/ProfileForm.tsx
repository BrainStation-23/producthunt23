
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
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProfileFormProps {
  user: User | null;
  formData: ProfileData;
  isSaving: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => Promise<void>;
}

// Helper function to check if a social URL appears to be generic
const isGenericUrl = (type: string, url: string | null): boolean => {
  if (!url) return false;
  
  switch (type) {
    case 'linkedin':
      return url === 'https://linkedin.com/in/profile';
    case 'github':
      return url.endsWith('/undefined') || url.endsWith('/null');
    case 'twitter':
      return url.endsWith('/undefined') || url.endsWith('/null');
    default:
      return false;
  }
};

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  user, 
  formData, 
  isSaving, 
  onInputChange, 
  onSave 
}) => {
  // Check which social profiles are verified
  const verifiedSocials = formData.verified_socials || [];
  const isGithubVerified = verifiedSocials.includes('github') && !isGenericUrl('github', formData.github);
  const isLinkedinVerified = verifiedSocials.includes('linkedin') && !isGenericUrl('linkedin', formData.linkedin);
  const isTwitterVerified = verifiedSocials.includes('twitter') && !isGenericUrl('twitter', formData.twitter);

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
                  {isTwitterVerified ? (
                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  ) : verifiedSocials.includes('twitter') && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" /> Incomplete
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>We couldn't retrieve your Twitter profile URL.<br />Please enter it manually.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Label>
                <Input 
                  id="twitter" 
                  name="twitter"
                  type="url" 
                  value={formData.twitter || ''}
                  onChange={onInputChange}
                  placeholder="https://twitter.com/username" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <LinkedInLogoIcon className="h-4 w-4" />
                  LinkedIn
                  {isLinkedinVerified ? (
                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  ) : verifiedSocials.includes('linkedin') && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" /> Incomplete
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>We couldn't retrieve your LinkedIn profile URL.<br />Please enter it manually.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Label>
                <Input 
                  id="linkedin" 
                  name="linkedin"
                  type="url" 
                  value={formData.linkedin || ''}
                  onChange={onInputChange}
                  placeholder="https://linkedin.com/in/username" 
                />
                {isLinkedinVerified && (
                  <p className="text-xs text-green-600">
                    Your LinkedIn profile has been verified.
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="github" className="flex items-center gap-2">
                  <GitHubLogoIcon className="h-4 w-4" />
                  GitHub
                  {isGithubVerified ? (
                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  ) : verifiedSocials.includes('github') && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" /> Incomplete
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>We couldn't retrieve your GitHub profile URL.<br />Please enter it manually.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Label>
                <Input 
                  id="github" 
                  name="github"
                  type="url" 
                  value={formData.github || ''}
                  onChange={onInputChange}
                  placeholder="https://github.com/username" 
                />
                {isGithubVerified && (
                  <p className="text-xs text-green-600">
                    Your GitHub profile has been verified.
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
