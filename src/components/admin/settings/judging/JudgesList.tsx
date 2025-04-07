
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, UserX, MailIcon } from 'lucide-react';
import AddJudgeDialog from './AddJudgeDialog';
import RemoveJudgeDialog from './RemoveJudgeDialog';

interface Judge {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  product_count: number;
}

const JudgesList: React.FC = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedJudge, setSelectedJudge] = useState<Judge | null>(null);

  const { data: judges, isLoading, refetch } = useQuery({
    queryKey: ['judges'],
    queryFn: async () => {
      // Get users with judge role
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          profiles:user_id(
            id,
            email,
            username,
            avatar_url,
            created_at
          )
        `)
        .eq('role', 'judge') as any;

      if (error) {
        toast.error(`Failed to load judges: ${error.message}`);
        throw error;
      }

      // Get assigned product counts for each judge
      const judgesWithCounts = await Promise.all(
        data.map(async (judge: any) => {
          const { count, error: countError } = await supabase
            .from('judge_assignments')
            .select('id', { count: 'exact', head: true })
            .eq('judge_id', judge.profiles.id) as any;

          if (countError) {
            console.error('Error getting judge assignments count:', countError);
            return {
              ...judge.profiles,
              product_count: 0
            };
          }

          return {
            ...judge.profiles,
            product_count: count || 0
          };
        })
      );

      return judgesWithCounts;
    }
  });

  const handleRemoveJudge = (judge: Judge) => {
    setSelectedJudge(judge);
    setRemoveDialogOpen(true);
  };

  const handleSendEmail = (judge: Judge) => {
    // This would be implemented in a real app to send an email to the judge
    toast.success(`Email notification would be sent to ${judge.email}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Judges</h3>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="border rounded-md">
          <div className="p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 py-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-8 w-24 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Judges</h3>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Judge
        </Button>
      </div>

      {judges && judges.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judge</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Assigned Products</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {judges.map((judge) => (
                <TableRow key={judge.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        {judge.avatar_url ? (
                          <AvatarImage src={judge.avatar_url} alt={judge.username || ''} />
                        ) : null}
                        <AvatarFallback>
                          {(judge.username ? judge.username[0] : judge.email[0]).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{judge.username || 'No username'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{judge.email}</TableCell>
                  <TableCell>
                    <Badge variant={judge.product_count > 0 ? "default" : "outline"}>
                      {judge.product_count}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(judge.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        title="Send email"
                        onClick={() => handleSendEmail(judge)}
                      >
                        <MailIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-destructive" 
                        title="Remove judge"
                        onClick={() => handleRemoveJudge(judge)}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">No judges have been added yet. Add your first judge to get started.</p>
          <Button className="mt-4" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Judge
          </Button>
        </div>
      )}

      <AddJudgeDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        onJudgeAdded={() => {
          refetch();
          toast.success("Judge added successfully");
        }} 
      />

      {selectedJudge && (
        <RemoveJudgeDialog
          open={removeDialogOpen}
          onOpenChange={setRemoveDialogOpen}
          judge={selectedJudge}
          onJudgeRemoved={() => {
            refetch();
            toast.success("Judge removed successfully");
          }}
        />
      )}
    </div>
  );
};

export default JudgesList;
