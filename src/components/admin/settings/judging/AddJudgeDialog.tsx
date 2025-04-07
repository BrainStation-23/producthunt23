
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AddJudgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJudgeAdded: () => void;
}

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddJudgeDialog: React.FC<AddJudgeDialogProps> = ({
  open,
  onOpenChange,
  onJudgeAdded,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      // Check if the user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', values.email)
        .limit(1) as any;

      if (checkError) throw checkError;

      let userId;

      if (existingUsers && existingUsers.length > 0) {
        // User exists, check if they already have the judge role
        userId = existingUsers[0].id;
        
        const { data: existingRole, error: roleCheckError } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', userId)
          .eq('role', 'judge')
          .limit(1) as any;

        if (roleCheckError) throw roleCheckError;

        if (existingRole && existingRole.length > 0) {
          toast.error('This user is already a judge');
          setIsSubmitting(false);
          return;
        }

        // Assign judge role to existing user
        const { error: assignError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'judge' }) as any;

        if (assignError) throw assignError;
      } else {
        // User doesn't exist, create new user
        if (!session?.access_token) {
          toast.error('You must be logged in to add a judge');
          setIsSubmitting(false);
          return;
        }

        // Create user via admin function
        const { data: userData, error: createError } = await supabase.functions.invoke('admin-user-management', {
          body: { 
            action: 'create_user',
            data: {
              email: values.email,
              password: Math.random().toString(36).slice(-8), // Generate random password
              username: values.username || values.email.split('@')[0],
              role: 'judge'
            }
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        if (createError) throw createError;
        
        if (!userData?.success) {
          throw new Error(userData?.error || 'Failed to create judge user');
        }
      }

      onJudgeAdded();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      console.error('Error adding judge:', error);
      toast.error(`Failed to add judge: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Judge</DialogTitle>
          <DialogDescription>
            Add a new judge who can evaluate products. If the user exists, they'll be assigned the judge role.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="judge@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Judge'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddJudgeDialog;
