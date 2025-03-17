
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link2, Upload } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface AvatarUploaderProps {
  user: User | null;
  avatarUrl: string | null;
  directAvatarUrl: string;
  isUploading: boolean;
  isSaving: boolean;
  uploadProgress: number;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDirectUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDirectUrlSave: () => Promise<void>;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  user,
  avatarUrl,
  directAvatarUrl,
  isUploading,
  isSaving,
  uploadProgress,
  onFileUpload,
  onDirectUrlChange,
  onDirectUrlSave
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>
          Choose how to update your profile picture.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="Profile" />
          ) : (
            <AvatarFallback className="text-xl">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          )}
        </Avatar>
        
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="url">
              <Link2 className="mr-2 h-4 w-4" />
              Image URL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4">
            <div className="flex flex-col items-center space-y-4">
              {isUploading && uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              
              <Label 
                htmlFor="avatar" 
                className="cursor-pointer bg-muted hover:bg-muted/80 text-sm px-3 py-2 rounded-md transition-colors"
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </Label>
              <Input 
                id="avatar" 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={onFileUpload}
                disabled={isUploading}
              />
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF, max 5MB
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="direct-url">Image URL</Label>
                <Input
                  id="direct-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={directAvatarUrl}
                  onChange={onDirectUrlChange}
                />
              </div>
              <Button 
                onClick={onDirectUrlSave} 
                disabled={isSaving || !directAvatarUrl}
                className="w-full"
              >
                {isSaving ? 'Saving...' : 'Use This Image'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AvatarUploader;
