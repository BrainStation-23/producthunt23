
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import type { Judge } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface JudgeListProps {
  judges: Judge[];
  isLoading: boolean;
  selectedJudgeId?: string;
  onSelectJudge: (judge: Judge) => void;
}

export const JudgeList: React.FC<JudgeListProps> = ({
  judges,
  isLoading,
  selectedJudgeId,
  onSelectJudge
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredJudges = judges.filter(judge => 
    (judge.username?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (judge.email.toLowerCase()).includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search judges..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="p-3 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-muted"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="h-3 w-32 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredJudges.length > 0 ? (
            filteredJudges.map(judge => (
              <JudgeListItem 
                key={judge.id} 
                judge={judge} 
                isSelected={judge.id === selectedJudgeId}
                onClick={() => onSelectJudge(judge)}
              />
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              {searchQuery ? 'No judges matching your search' : 'No judges available'}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

interface JudgeListItemProps {
  judge: Judge;
  isSelected: boolean;
  onClick: () => void;
}

const JudgeListItem: React.FC<JudgeListItemProps> = ({ judge, isSelected, onClick }) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start px-3 py-2 h-auto",
        isSelected ? "bg-accent" : "hover:bg-accent/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center w-full">
        <Avatar className="h-8 w-8 mr-3 flex-shrink-0">
          {judge.avatar_url ? <AvatarImage src={judge.avatar_url} /> : null}
          <AvatarFallback>
            {(judge.username ? judge.username[0] : judge.email[0]).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 overflow-hidden text-left">
          <div className="font-medium truncate">
            {judge.username || 'No username'}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {judge.email}
          </div>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="ml-2">
                {judge.assigned_product_count}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {judge.assigned_product_count === 1 
                ? '1 assigned product' 
                : `${judge.assigned_product_count} assigned products`}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Button>
  );
};
