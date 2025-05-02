
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trash, RefreshCw, CheckCircle, AlertCircle, FileBarChart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CleanupResult {
  totalFiles: number;
  databaseRecords: number;
  orphanedFiles: number;
  filesDeleted: number;
  totalSizeRecovered: string;
  dryRun: boolean;
  duration: string;
  sampleOrphanedFiles: {
    name: string;
    size: string;
    lastModified: string;
  }[];
  errors: string | null;
}

const StorageCleanupPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<CleanupResult | null>(null);
  const [cleanupMode, setCleanupMode] = useState<'dry-run' | 'delete'>('dry-run');

  const runCleanup = async (dryRun = true) => {
    setIsLoading(true);
    setLastResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('cleanup-orphaned-images', {
        body: { dryRun }
      });
      
      if (error) {
        throw new Error(`Error invoking cleanup function: ${error.message}`);
      }
      
      setLastResult(data as CleanupResult);
      
      if (dryRun) {
        toast.success(`Found ${data.orphanedFiles} orphaned files that can be cleaned up`);
      } else {
        toast.success(`Successfully deleted ${data.filesDeleted} orphaned files (${data.totalSizeRecovered} recovered)`);
      }
    } catch (error) {
      console.error('Failed to run cleanup process:', error);
      toast.error('Failed to run storage cleanup. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Storage Cleanup</CardTitle>
            <CardDescription>Clean up orphaned images from the storage buckets</CardDescription>
          </div>
          <FileBarChart className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This tool finds and removes image files that exist in storage but are not referenced in the database.
            These orphaned files can accumulate over time due to deleted products or updated screenshots.
          </p>
          
          <div className="flex items-center justify-between">
            <Tabs 
              value={cleanupMode} 
              onValueChange={(value) => setCleanupMode(value as 'dry-run' | 'delete')}
              className="w-[400px]"
            >
              <TabsList>
                <TabsTrigger value="dry-run">Dry Run (Analyze Only)</TabsTrigger>
                <TabsTrigger value="delete">Delete Orphaned Files</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button
              variant={cleanupMode === 'dry-run' ? 'outline' : 'destructive'}
              onClick={() => runCleanup(cleanupMode === 'dry-run')}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : cleanupMode === 'dry-run' ? (
                <CheckCircle className="mr-2 h-4 w-4" />
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}
              {cleanupMode === 'dry-run' 
                ? 'Analyze Orphaned Files' 
                : 'Delete Orphaned Files'}
            </Button>
          </div>
          
          {cleanupMode === 'delete' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Warning: This will permanently delete orphaned files from storage. This action cannot be undone.
                We recommend running a dry run analysis first.
              </AlertDescription>
            </Alert>
          )}

          {lastResult && (
            <div className="mt-6 border rounded-md p-4 bg-muted/10">
              <h3 className="font-medium mb-2">Cleanup {lastResult.dryRun ? 'Analysis' : 'Results'}</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-card p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">Total Files</p>
                  <p className="text-xl font-bold">{lastResult.totalFiles}</p>
                </div>
                <div className="bg-card p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">Database Records</p>
                  <p className="text-xl font-bold">{lastResult.databaseRecords}</p>
                </div>
                <div className="bg-card p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">Orphaned Files</p>
                  <p className="text-xl font-bold">{lastResult.orphanedFiles}</p>
                </div>
                <div className="bg-card p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    {lastResult.dryRun ? 'Size to Recover' : 'Size Recovered'}
                  </p>
                  <p className="text-xl font-bold">{lastResult.totalSizeRecovered}</p>
                </div>
              </div>

              {lastResult.orphanedFiles > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Sample of Orphaned Files:</h4>
                  <div className="max-h-[200px] overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-muted text-muted-foreground">
                        <tr>
                          <th className="p-2 text-left">Filename</th>
                          <th className="p-2 text-left">Size</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {lastResult.sampleOrphanedFiles.map((file, index) => (
                          <tr key={index}>
                            <td className="p-2 truncate max-w-[300px]">{file.name}</td>
                            <td className="p-2">{file.size}</td>
                          </tr>
                        ))}
                        {lastResult.orphanedFiles > lastResult.sampleOrphanedFiles.length && (
                          <tr>
                            <td colSpan={2} className="p-2 text-center text-muted-foreground">
                              And {lastResult.orphanedFiles - lastResult.sampleOrphanedFiles.length} more...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {lastResult.errors && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{lastResult.errors}</AlertDescription>
                </Alert>
              )}

              <p className="text-xs text-muted-foreground mt-4">
                Process completed in {lastResult.duration}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-4">
        <p className="text-xs text-muted-foreground">
          Regular cleanup helps maintain storage efficiency and reduces hosting costs.
        </p>
      </CardFooter>
    </Card>
  );
};

export default StorageCleanupPanel;
