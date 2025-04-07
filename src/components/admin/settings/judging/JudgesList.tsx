
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

const JudgesList: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Judges</h3>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Judge
        </Button>
      </div>
      
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">This feature will be implemented in the next phase.</p>
        <p className="text-muted-foreground mt-2">You'll be able to create judge accounts and manage access here.</p>
      </div>
    </div>
  );
};

export default JudgesList;
