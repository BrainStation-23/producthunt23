
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

// Define form schema based on whether it's for creating or editing
const getFormSchema = (isEditing: boolean) => {
  const baseSchema = {
    email: z.string().email({ message: 'Please enter a valid email address' }),
    username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
    role: z.enum(['admin', 'user']),
  };

  // Add password field only for creation
  return isEditing 
    ? z.object(baseSchema)
    : z.object({
        ...baseSchema,
        password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
      });
};

type CreateFormValues = z.infer<typeof getFormSchema(false)>;
type EditFormValues = z.infer<typeof getFormSchema(true)>;
type FormValues = CreateFormValues | EditFormValues;

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
  const formSchema = getFormSchema(isEditing);
  
  // Default values depends on whether we're editing or creating
  const defaultValues = isEditing
    ? {
        email: user?.email || '',
        username: user?.username || '',
        role: (user?.role as 'admin' | 'user') || 'user',
      }
    : {
        email: '',
        username: '',
        password: '',
        role: 'user',
      };
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Update form when user changes (for editing)
  useEffect(() => {
    if (isEditing && user) {
      form.reset({
        email: user.email,
        username: user.username || '',
        role: (user.role as 'admin' | 'user'),
      });
    }
  }, [user, form, isEditing]);

  const onSubmit = async (values: FormValues) => {
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
