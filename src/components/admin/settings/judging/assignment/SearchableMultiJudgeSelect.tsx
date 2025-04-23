
import React, { useState } from 'react';
import { Check, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Judge {
  id: string;
  username: string | null;
  email: string;
  avatar_url: string | null;
}

interface SearchableMultiJudgeSelectProps {
  judges: Judge[];
  selectedJudges: string[];
  onJudgeToggle: (judgeId: string) => void;
}

export const SearchableMultiJudgeSelect: React.FC<SearchableMultiJudgeSelectProps> = ({
  judges,
  selectedJudges,
  onJudgeToggle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJudges = judges.filter(judge => 
    (judge.username?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    judge.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search judges..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {selectedJudges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedJudges.map(judgeId => {
            const judge = judges.find(j => j.id === judgeId);
            if (!judge) return null;
            return (
              <Badge 
                key={judge.id}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => onJudgeToggle(judge.id)}
              >
                {judge.username || judge.email}
                <span className="ml-1">×</span>
              </Badge>
            );
          })}
        </div>
      )}

      <ScrollArea className="h-[300px] rounded-md border">
        <div className="p-4 space-y-2">
          {filteredJudges.map(judge => (
            <div
              key={judge.id}
              className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer ${
                selectedJudges.includes(judge.id) ? 'bg-muted' : ''
              }`}
              onClick={() => onJudgeToggle(judge.id)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  {judge.avatar_url ? (
                    <AvatarImage src={judge.avatar_url} alt={judge.username || ''} />
                  ) : null}
                  <AvatarFallback>
                    {(judge.username?.[0] || judge.email[0]).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {judge.username || 'No username'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {judge.email}
                  </div>
                </div>
              </div>
              {selectedJudges.includes(judge.id) && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          ))}
          
          {filteredJudges.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No judges found matching "{searchQuery}"
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
