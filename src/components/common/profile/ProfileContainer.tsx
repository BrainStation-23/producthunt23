
import React from 'react';
import { User } from '@supabase/supabase-js';
import ProfileHeader from '@/components/user/profile/ProfileHeader';
import ProfileForm from '@/components/common/profile/ProfileForm';
import AvatarUploader from '@/components/common/profile/AvatarUploader';
import ProfileSkeleton from '@/components/user/profile/ProfileSkeleton';
import { useProfileForm, ProfileData } from '@/hooks/useProfileForm';
import { useEffect } from 'react';

interface ProfileContainerProps {
  user: User | null;
  title: string;
  description: string;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({
  user,
  title,
  description
}) => {
  const {
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
  } = useProfileForm(user);

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
  }, [user]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-6">
      <ProfileHeader 
        title={title} 
        description={description}
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

export default ProfileContainer;
