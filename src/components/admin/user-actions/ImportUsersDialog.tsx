
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Papa from 'papaparse';

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
  const [activeTab, setActiveTab] = useState('import');

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
      // Parse the CSV file using papaparse
      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            if (results.errors.length > 0) {
              console.error('CSV parsing errors:', results.errors);
              toast.error('Error parsing CSV file');
              setIsUploading(false);
              return;
            }

            const users = results.data;
            
            if (!users || users.length === 0) {
              toast.error('No valid user data found in the CSV');
              setIsUploading(false);
              return;
            }
            
            console.log('Importing users:', users);
            
            // Get session for authenticated API call
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData.session?.access_token) {
              throw new Error('Authentication required');
            }
            
            // Call the admin-bulk-create-users function
            const { data, error } = await supabase.functions.invoke('admin-bulk-create-users', {
              body: { users },
              headers: {
                Authorization: `Bearer ${sessionData.session.access_token}`
              }
            });
            
            if (error) throw error;
            
            console.log('Import results:', data);
            
            if (data.success > 0) {
              toast.success(`Successfully imported ${data.success} users`);
              onUsersImported();
              onOpenChange(false);
            }
            
            if (data.failed > 0) {
              console.error('Failed to import some users:', data.errors);
              toast.error(`Failed to import ${data.failed} users. Check console for details.`);
            }
          } catch (error) {
            console.error('Error in CSV import processing:', error);
            toast.error('Failed to process import');
          } finally {
            setIsUploading(false);
          }
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast.error('Failed to parse CSV file');
          setIsUploading(false);
        }
      });
    } catch (error) {
      console.error('Error starting import:', error);
      toast.error('Failed to start import process');
      setIsUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }

    setIsUploading(true);
    try {
      // Parse the CSV file using papaparse
      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            if (results.errors.length > 0) {
              console.error('CSV parsing errors:', results.errors);
              toast.error('Error parsing CSV file');
              setIsUploading(false);
              return;
            }

            const users = results.data;
            
            if (!users || users.length === 0) {
              toast.error('No valid user data found in the CSV');
              setIsUploading(false);
              return;
            }
            
            // Verify that each user has an ID
            const missingIds = users.filter(user => !user.id);
            if (missingIds.length > 0) {
              toast.error('Some users are missing ID field which is required for updates');
              setIsUploading(false);
              return;
            }
            
            console.log('Updating users:', users);
            
            // Get session for authenticated API call
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData.session?.access_token) {
              throw new Error('Authentication required');
            }
            
            // Call the admin-bulk-update-users function
            const { data, error } = await supabase.functions.invoke('admin-bulk-update-users', {
              body: { users },
              headers: {
                Authorization: `Bearer ${sessionData.session.access_token}`
              }
            });
            
            if (error) throw error;
            
            console.log('Update results:', data);
            
            if (data.success > 0) {
              toast.success(`Successfully updated ${data.success} users`);
              onUsersImported();
              onOpenChange(false);
            }
            
            if (data.failed > 0) {
              console.error('Failed to update some users:', data.errors);
              toast.error(`Failed to update ${data.failed} users. Check console for details.`);
            }
          } catch (error) {
            console.error('Error in CSV update processing:', error);
            toast.error('Failed to process updates');
          } finally {
            setIsUploading(false);
          }
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast.error('Failed to parse CSV file');
          setIsUploading(false);
        }
      });
    } catch (error) {
      console.error('Error starting update:', error);
      toast.error('Failed to start update process');
      setIsUploading(false);
    }
  };

  const downloadImportTemplate = () => {
    const headers = ['email', 'username', 'role'];
    const csvContent = Papa.unparse({
      fields: headers,
      data: [
        ['user1@example.com', 'username1', 'user'],
        ['admin@example.com', 'admin_user', 'admin'],
        ['judge@example.com', 'judge_user', 'judge']
      ]
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const downloadUpdateTemplate = () => {
    const headers = ['id', 'email', 'username', 'role'];
    const csvContent = Papa.unparse({
      fields: headers,
      data: [
        ['user-uuid-goes-here', 'user1@example.com', 'username1', 'user'],
        ['admin-uuid-goes-here', 'admin@example.com', 'admin_user', 'admin'],
        ['judge-uuid-goes-here', 'judge@example.com', 'judge_user', 'judge']
      ]
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user_update_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Users</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import or update multiple users at once.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="import">Import New Users</TabsTrigger>
            <TabsTrigger value="update">Update Existing Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Import new users with email, username and role.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadImportTemplate}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Template
              </Button>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="importCsvFile">CSV File</Label>
              <Input
                id="importCsvFile"
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
            
            <DialogFooter className="mt-4">
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
          </TabsContent>
          
          <TabsContent value="update" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Update existing users. User ID is required.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadUpdateTemplate}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Template
              </Button>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="updateCsvFile">CSV File</Label>
              <Input
                id="updateCsvFile"
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
            
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleUpdate}
                disabled={!csvFile || isUploading}
              >
                {isUploading ? (
                  <>Updating...</>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Update Users
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImportUsersDialog;
