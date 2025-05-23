
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
  website?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  github?: string | null;
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
    website: user?.website || '',
    twitter: user?.twitter || '',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
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

  // Update form when user changes (for editing), but only initially
  useEffect(() => {
    if (isEditing && user) {
      // Only reset the form when the user ID changes or when the form is first initialized
      form.reset({
        email: user.email || '',
        username: user.username || '',
        role: (user.role as 'admin' | 'user' | 'judge') || 'user',
        website: user.website || '',
        twitter: user.twitter || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
      });
    }
  }, [user?.id, isEditing]); // Only depend on user.id, not the entire user object

  const onSubmit = async (values: typeof formSchema._type) => {
    try {
      if (isEditing && user) {
        // Handle edit user case
        const { email, username, role, website, twitter, linkedin, github } = values as EditFormValues;
        
        // First update the user's role if it changed
        if (role !== user.role) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .update({ role })
            .eq('user_id', user.id);

          if (roleError) throw roleError;
        }

        // Update social profiles in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            username,
            website, 
            twitter, 
            linkedin, 
            github 
          })
          .eq('id', user.id);

        if (profileError) throw profileError;

        // Then update the user's profile data in Auth
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
        
        if (!session?.access_token) {
          toast.error('Authentication required. Please login again.');
          return;
        }
        
        // Add logging to debug
        console.log('Invoking admin-create-user with token:', session.access_token.substring(0, 10) + '...');
        
        const { data, error } = await supabase.functions.invoke('admin-create-user', {
          body: { email, password, role, username },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        if (error) {
          console.error('Error creating user:', error);
          throw error;
        }
        
        toast.success('User created successfully');
      }
      
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
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
