
import React from 'react';
import { User, useUserForm } from './user-form/useUserForm';
import UserFormFields from './user-form/UserFormFields';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

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
  const { form, onSubmit, isEditing: isEditMode } = useUserForm(
    isEditing,
    user,
    onOpenChange,
    onSuccess
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserFormFields form={form} isEditing={isEditMode} />
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
