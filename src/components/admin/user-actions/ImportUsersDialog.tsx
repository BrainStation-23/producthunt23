
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ImportUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUsersImported: () => void;
}

const ImportUsersDialog: React.FC<ImportUsersDialogProps> = ({
  open,
  onOpenChange,
  onUsersImported
}) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }

    setIsUploading(true);
    try {
      // Read the CSV file
      const text = await csvFile.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',');
      
      // Get session for authenticated API call
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.access_token) {
        throw new Error('Authentication required');
      }
      
      // Process the CSV data
      const users = [];
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue;
        
        const values = rows[i].split(',');
        const user = {};
        
        headers.forEach((header, index) => {
          user[header.trim()] = values[index]?.trim() || '';
        });
        
        users.push(user);
      }
      
      // Call the admin-create-user function for each user
      let successCount = 0;
      let errorCount = 0;
      
      for (const user of users) {
        if (!user.email) continue;
        
        try {
          const { error } = await supabase.functions.invoke('admin-create-user', {
            body: {
              email: user.email,
              password: Math.random().toString(36).slice(-10), // Generate random password
              role: user.role || 'user',
              username: user.username || user.email.split('@')[0],
            },
            headers: {
              Authorization: `Bearer ${sessionData.session.access_token}`
            }
          });
          
          if (error) throw error;
          successCount++;
        } catch (error) {
          console.error(`Error importing user ${user.email}:`, error);
          errorCount++;
        }
      }
      
      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} users`);
        onUsersImported();
        onOpenChange(false);
      }
      
      if (errorCount > 0) {
        toast.error(`Failed to import ${errorCount} users. Check console for details.`);
      }
      
    } catch (error) {
      console.error('Error importing users:', error);
      toast.error('Failed to import users');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Users</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple users at once.
            The CSV should include headers: email, username, role.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="csvFile">CSV File</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>
          {csvFile && (
            <p className="text-sm text-muted-foreground">
              Selected file: {csvFile.name}
            </p>
          )}
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleImport}
            disabled={!csvFile || isUploading}
          >
            {isUploading ? (
              <>Importing...</>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import Users
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportUsersDialog;
