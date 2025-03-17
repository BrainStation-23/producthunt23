import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link2, Upload } from 'lucide-react';
import { validateImageFile, uploadImageToStorage } from '@/utils/fileUploadUtils';

interface ProfileData {
  username: string | null;
  bio: string | null;
  website: string | null;
  avatar_url: string | null;
}

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    username: '',
    bio: '',
    website: '',
    avatar_url: null
  });
  const [directAvatarUrl, setDirectAvatarUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('username, bio, website, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setFormData({
            username: data.username || '',
            bio: data.bio || '',
            website: data.website || '',
            avatar_url: data.avatar_url
          });
          
          if (data.avatar_url) {
            setDirectAvatarUrl(data.avatar_url);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          bio: formData.bio,
          website: formData.website
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Validate the file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create a path that includes the user's ID to ensure uniqueness and proper organization
      const filePath = `${user.id}/avatar`;
      
      // Upload the file using the utility function with the new bucket name
      const publicUrl = await uploadImageToStorage(
        file, 
        'profile_pictures',
        (progress) => setUploadProgress(progress),
        filePath // Pass the custom path
      );
      
      // Update profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      // Update local state
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      setDirectAvatarUrl(publicUrl);
      
      toast.success('Avatar uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle direct URL input
  const handleDirectUrlSave = async () => {
    if (!user || !directAvatarUrl.trim()) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: directAvatarUrl })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setFormData(prev => ({ ...prev, avatar_url: directAvatarUrl }));
      
      toast.success('Avatar URL updated successfully');
    } catch (error: any) {
      console.error('Error updating avatar URL:', error);
      toast.error(error.message || 'Failed to update avatar URL');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDirectUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirectAvatarUrl(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-[1fr_250px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-36" />
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-9 w-32" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    placeholder="https://example.com" 
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
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
                Choose how to update your profile picture.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                {formData.avatar_url ? (
                  <AvatarImage src={formData.avatar_url} alt="Profile" />
                ) : (
                  <AvatarFallback className="text-xl">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </TabsTrigger>
                  <TabsTrigger value="url">
                    <Link2 className="mr-2 h-4 w-4" />
                    Image URL
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="mt-4">
                  <div className="flex flex-col items-center space-y-4">
                    {isUploading && uploadProgress > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                    
                    <Label 
                      htmlFor="avatar" 
                      className="cursor-pointer bg-muted hover:bg-muted/80 text-sm px-3 py-2 rounded-md transition-colors"
                    >
                      {isUploading ? 'Uploading...' : 'Choose File'}
                    </Label>
                    <Input 
                      id="avatar" 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                    />
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or GIF, max 5MB
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="url" className="mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="direct-url">Image URL</Label>
                      <Input
                        id="direct-url"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={directAvatarUrl}
                        onChange={handleDirectUrlChange}
                      />
                    </div>
                    <Button 
                      onClick={handleDirectUrlSave} 
                      disabled={isSaving || !directAvatarUrl}
                      className="w-full"
                    >
                      {isSaving ? 'Saving...' : 'Use This Image'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
