
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Define common schema fields
const baseSchema = {
  email: z.string().email({ message: 'Please enter a valid email address' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  role: z.enum(['admin', 'user']),
};

// Define form schema based on whether it's for creating or editing
const createSchema = z.object({
  ...baseSchema,
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

const editSchema = z.object(baseSchema);

// Define our form types
type CreateFormValues = z.infer<typeof createSchema>;
type EditFormValues = z.infer<typeof editSchema>;

interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  product_count: number;
}

interface UserFormDialogProps {
  isEditing: boolean;
  user?: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  title: string;
  description: string;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({
  isEditing,
  user,
  open,
  onOpenChange,
  onSuccess,
  title,
  description,
}) => {
  const { session } = useAuth();
  
  // Use the appropriate form schema based on mode
  const formSchema = isEditing ? editSchema : createSchema;
  
  // Create type-safe default values
  const defaultEditValues: EditFormValues = {
    email: user?.email || '',
    username: user?.username || '',
    role: (user?.role as 'admin' | 'user') || 'user',
  };
  
  const defaultCreateValues: CreateFormValues = {
    email: '',
    username: '',
    password: '',
    role: 'user',
  };
  
  // Use the correct default values type based on mode
  const form = useForm<typeof formSchema._type>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing ? defaultEditValues : defaultCreateValues,
  });

  // Update form when user changes (for editing)
  useEffect(() => {
    if (isEditing && user) {
      form.reset(defaultEditValues);
    }
  }, [user, form, isEditing]);

  const onSubmit = async (values: typeof formSchema._type) => {
    try {
      if (isEditing && user) {
        // Handle edit user case
        const { email, username, role } = values as EditFormValues;
        
        // First update the user's role if it changed
        if (role !== user.role) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .update({ role })
            .eq('user_id', user.id);

          if (roleError) throw roleError;
        }

        // Then update the user's profile data
        const { data, error } = await supabase.functions.invoke('admin-user-management', {
          body: {
            action: 'update_user',
            data: {
              id: user.id,
              email,
              user_metadata: { username },
            }
          },
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        });

        if (error) throw error;
        toast.success('User updated successfully');
      } else {
        // Handle create user case
        const { email, password, role, username } = values as CreateFormValues;
        
        const { data, error } = await supabase.functions.invoke('admin-user-management', {
          body: {
            action: 'create_user',
            data: { email, password, role, username }
          },
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        });

        if (error) throw error;
        toast.success('User created successfully');
      }
      
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} user:`, error);
      toast.error(error.message || `Failed to ${isEditing ? 'update' : 'create'} user`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@example.com" {...field} />
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
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEditing && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Create User'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
