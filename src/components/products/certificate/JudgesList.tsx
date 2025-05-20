
import React from 'react';
import { Badge } from 'lucide-react';

interface Judge {
  id: string;
  profile?: {
    username: string | null;
    avatar_url: string | null;
  };
}

interface JudgesListProps {
  judges: Judge[];
}

const JudgesList = ({ judges }: JudgesListProps) => {
  if (!judges || judges.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
        <Badge className="mr-2" />
        Evaluated By
      </h3>
      <div className="flex flex-wrap justify-center gap-4">
        {judges.map((judge) => (
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
            <p className="font-medium">{judge.profile?.username || 'Anonymous Judge'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JudgesList;
