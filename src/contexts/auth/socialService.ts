
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Helper function to extract username from GitHub URL
const extractGithubUsername = (url: string): string => {
  try {
    if (!url.includes('github.com')) return url;
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/').filter(Boolean);
    return path[0] || '';
  } catch {
    // If parsing fails, just return the original
    return url.split('/').pop() || url;
  }
};

// Helper function to extract username from LinkedIn URL
const extractLinkedinUsername = (url: string): string => {
  try {
    if (!url.includes('linkedin.com')) return url;
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/').filter(Boolean);
    // For LinkedIn, we expect format like /in/username
    return path.length > 1 ? path[1] : url;
  } catch {
    // If parsing fails, assume everything after last slash is username
    return url.split('/').pop() || url;
  }
};

// Helper function to extract username from Twitter URL
const extractTwitterUsername = (url: string): string => {
  try {
    if (!url.includes('twitter.com') && !url.includes('x.com')) return url;
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/').filter(Boolean);
    return path[0] || '';
  } catch {
    // If parsing fails, just return the original
    return url.split('/').pop() || url;
  }
};

export const updateSocialProfileLinks = async (user: User): Promise<void> => {
  try {
    const provider = user.app_metadata?.provider;
    const identities = user.identities || [];
    
    if (!provider || identities.length === 0) return;
    
    let socialData: Record<string, string> = {};
    let verifiedSocials: string[] = [];
    
    // Extract information based on the provider
    if (provider === 'github') {
      const identity = identities.find(id => id.provider === 'github');
      if (identity?.identity_data) {
        const githubUsername = identity.identity_data.user_name || identity.identity_data.preferred_username;
        if (githubUsername) {
          socialData.github = `https://github.com/${githubUsername}`;
          verifiedSocials.push('github');
        }
      }
    } else if (provider === 'linkedin_oidc') {
      const identity = identities.find(id => id.provider === 'linkedin_oidc');
      if (identity?.identity_data?.preferred_username && 
          identity.identity_data.preferred_username !== 'profile') {
        socialData.linkedin = `https://linkedin.com/in/${identity.identity_data.preferred_username}`;
        verifiedSocials.push('linkedin');
      }
    } else if (provider === 'twitter') {
      const identity = identities.find(id => id.provider === 'twitter');
      if (identity?.identity_data) {
        const twitterUsername = identity.identity_data.screen_name;
        if (twitterUsername) {
          socialData.twitter = `https://twitter.com/${twitterUsername}`;
          verifiedSocials.push('twitter');
        }
      }
    }
    
    if (Object.keys(socialData).length === 0) return;
    
    // Fetch current user profile to handle verified socials properly
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('verified_socials')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return;
    }
    
    // Merge new verified socials with existing ones
    const existingVerifiedSocials = currentProfile?.verified_socials || [];
    // Only include social networks that we're updating
    const updatedVerifiedSocials = existingVerifiedSocials.filter(
      social => !['github', 'linkedin', 'twitter'].includes(social) || verifiedSocials.includes(social)
    ).concat(verifiedSocials);
    
    // Update the profile with the social links and mark them as verified
    const { error } = await supabase
      .from('profiles')
      .update({
        ...socialData,
        verified_socials: updatedVerifiedSocials
      })
      .eq('id', user.id);
    
    if (error) {
      console.error('Error updating social profile links:', error);
    } else {
      console.log('Updated social profiles:', socialData);
    }
  } catch (error) {
    console.error('Error in updateSocialProfileLinks:', error);
  }
};
