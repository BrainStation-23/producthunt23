
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
      if (identity?.identity_data?.sub) {
        // LinkedIn doesn't provide the username directly in the identity data
        // We'll use the sub as a unique identifier
        socialData.linkedin = `https://linkedin.com/in/${identity.identity_data.preferred_username || 'profile'}`;
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
    
    // Update the profile with the social links and mark them as verified
    const { error } = await supabase
      .from('profiles')
      .update({
        ...socialData,
        verified_socials: verifiedSocials
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
