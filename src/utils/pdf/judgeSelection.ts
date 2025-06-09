
import { Judge } from './types';

/**
 * Prioritizes and limits judges to 2, favoring those with images and LinkedIn
 */
export const selectTopJudges = (judges: Judge[]): Judge[] => {
  if (!judges || judges.length === 0) return [];
  
  // Sort judges by priority: avatar_url and linkedin presence
  const sortedJudges = [...judges].sort((a, b) => {
    const aHasAvatar = !!a.profile?.avatar_url;
    const aHasLinkedIn = !!a.profile?.linkedin;
    const bHasAvatar = !!b.profile?.avatar_url;
    const bHasLinkedIn = !!b.profile?.linkedin;
    
    // Priority score: both avatar and linkedin = 3, only avatar = 2, only linkedin = 1, neither = 0
    const aScore = (aHasAvatar ? 2 : 0) + (aHasLinkedIn ? 1 : 0);
    const bScore = (bHasAvatar ? 2 : 0) + (bHasLinkedIn ? 1 : 0);
    
    return bScore - aScore; // Descending order
  });
  
  // Return max 2 judges
  return sortedJudges.slice(0, 2);
};
