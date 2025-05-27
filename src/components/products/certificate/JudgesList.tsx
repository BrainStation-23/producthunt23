
import React from 'react';
import { Badge, Linkedin } from 'lucide-react';

interface Judge {
  id: string;
  profile?: {
    username: string | null;
    avatar_url: string | null;
    linkedin?: string | null;
  };
}

interface JudgesListProps {
  judges: Judge[];
}

/**
 * Prioritizes and limits judges to 2, favoring those with images and LinkedIn
 */
const selectTopJudges = (judges: Judge[]): Judge[] => {
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

const JudgesList = ({ judges }: JudgesListProps) => {
  const selectedJudges = selectTopJudges(judges);

  if (!selectedJudges || selectedJudges.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
        <Badge className="mr-2" />
        Evaluated By
      </h3>
      <div className="flex flex-wrap justify-center gap-4">
        {selectedJudges.map((judge) => (
          <div key={judge.id} className="text-center">
            {judge.profile?.avatar_url && (
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2">
                <img 
                  src={judge.profile.avatar_url} 
                  alt={judge.profile?.username || 'Judge'} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="font-medium">
              {judge.profile?.linkedin ? (
                <a 
                  href={judge.profile.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 text-primary hover:underline"
                >
                  {judge.profile?.username || 'Anonymous Judge'}
                  <Linkedin className="h-4 w-4" />
                </a>
              ) : (
                judge.profile?.username || 'Anonymous Judge'
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JudgesList;
