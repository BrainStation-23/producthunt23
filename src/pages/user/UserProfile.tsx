
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { validateImageFile, uploadImageToStorage } from '@/utils/fileUploadUtils';
import ProfileHeader from '@/components/user/profile/ProfileHeader';
import ProfileForm from '@/components/user/profile/ProfileForm';
import AvatarUploader from '@/components/user/profile/AvatarUploader';
import ProfileSkeleton from '@/components/user/profile/ProfileSkeleton';

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
    }
  };

  // Handle direct URL input
  const handleDirectUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirectAvatarUrl(e.target.value);
  };

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

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-6">
      <ProfileHeader 
        title="Your Profile" 
        description="Manage your account details and public profile."
      />
      
      <div className="grid gap-6 md:grid-cols-[1fr_250px]">
        <div className="space-y-6">
          <ProfileForm 
            user={user}
            formData={formData}
            isSaving={isSaving}
            onInputChange={handleInputChange}
            onSave={handleSave}
          />
        </div>
        
        <div className="space-y-6">
          <AvatarUploader 
            user={user}
            avatarUrl={formData.avatar_url}
            directAvatarUrl={directAvatarUrl}
            isUploading={isUploading}
            isSaving={isSaving}
            uploadProgress={uploadProgress}
            onFileUpload={handleAvatarUpload}
            onDirectUrlChange={handleDirectUrlChange}
            onDirectUrlSave={handleDirectUrlSave}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
