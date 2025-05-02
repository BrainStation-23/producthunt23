import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { validateImageFile, uploadImageToStorage } from '@/utils/fileUploadUtils';
import { User } from '@supabase/supabase-js';

export interface ProfileData {
  username: string | null;
  bio: string | null;
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  github: string | null;
  avatar_url: string | null;
  verified_socials?: string[];
}

export function useProfileForm(user: User | null) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    username: '',
    bio: '',
    website: '',
    twitter: '',
    linkedin: '',
    github: '',
    avatar_url: null,
    verified_socials: []
  });
  const [directAvatarUrl, setDirectAvatarUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('username, bio, website, twitter, linkedin, github, avatar_url, verified_socials')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setFormData({
          username: data.username || '',
          bio: data.bio || '',
          website: data.website || '',
          twitter: data.twitter || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          avatar_url: data.avatar_url,
          verified_socials: data.verified_socials || []
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Check if the LinkedIn URL is the generic one - if so, remove it from verified socials
      const isGenericLinkedIn = formData.linkedin === 'https://linkedin.com/in/profile';
      let verified_socials = [...(formData.verified_socials || [])];
      
      if (isGenericLinkedIn && verified_socials.includes('linkedin')) {
        // Remove 'linkedin' from verified socials
        verified_socials = verified_socials.filter(social => social !== 'linkedin');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          bio: formData.bio,
          website: formData.website,
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          github: formData.github,
          verified_socials: verified_socials
        })
        .eq('id', user.id);

      if (error) throw error;
      
      // Update the local formData with the possibly modified verified_socials
      setFormData(prev => ({
        ...prev,
        verified_socials: verified_socials
      }));
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }
    
    try {
      setIsUploading(true);
      
      const filePath = `${user.id}/avatar`;
      
      const publicUrl = await uploadImageToStorage(
        file, 
        'profile_pictures',
        (progress) => setUploadProgress(progress),
        filePath
      );
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
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
      
      setFormData(prev => ({ ...prev, avatar_url: directAvatarUrl }));
      
      toast.success('Avatar URL updated successfully');
    } catch (error: any) {
      console.error('Error updating avatar URL:', error);
      toast.error(error.message || 'Failed to update avatar URL');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading,
    isSaving,
    isUploading,
    formData,
    directAvatarUrl,
    uploadProgress,
    fetchProfile,
    handleInputChange,
    handleSave,
    handleAvatarUpload,
    handleDirectUrlChange,
    handleDirectUrlSave
  };
}
