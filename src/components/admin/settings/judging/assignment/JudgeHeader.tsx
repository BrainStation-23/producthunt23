
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Judge } from '../types';

interface JudgeHeaderProps {
  judge: Judge;
}

export const JudgeHeader: React.FC<JudgeHeaderProps> = ({ judge }) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Avatar className="h-10 w-10">
        {judge.avatar_url ? <AvatarImage src={judge.avatar_url} /> : null}
        <AvatarFallback>
          {(judge.username ? judge.username[0] : judge.email[0]).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-semibold">{judge.username || 'No username'}</h3>
        <p className="text-sm text-muted-foreground">{judge.email}</p>
      </div>
    </div>
  );
};
