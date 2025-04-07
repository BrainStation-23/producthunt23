
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { createSchema, editSchema, CreateFormValues, EditFormValues } from './schemas';
import { useAuth } from '@/contexts/AuthContext';

export interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  product_count: number;
}

export const useUserForm = (
  isEditing: boolean,
  user: User | null | undefined,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void
) => {
  const { session } = useAuth();
  
  // Use the appropriate form schema based on mode
  const formSchema = isEditing ? editSchema : createSchema;
  
  // Create type-safe default values
  const defaultEditValues: EditFormValues = {
    email: user?.email || '',
    username: user?.username || '',
    role: (user?.role as 'admin' | 'user' | 'judge') || 'user',
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
  }, [user, form, isEditing, defaultEditValues]);

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
        const { data, error } = await supabase.functions.invoke('admin-update-user', {
          body: {
            id: user.id,
            email,
            user_metadata: { username },
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
        
        const { data, error } = await supabase.functions.invoke('admin-create-user', {
          body: { email, password, role, username },
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

  return {
    form,
    onSubmit,
    formSchema,
    isEditing
  };
};
