
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface NotesSectionProps {
  notes: string;
  setNotes: (notes: string) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes, setNotes, onSave, isSaving }) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Evaluation Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="notes">Private notes about this evaluation</Label>
          <Textarea 
            id="notes" 
            placeholder="Add your private notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[150px] mt-2"
          />
          <Button 
            onClick={onSave} 
            disabled={isSaving}
            className="mt-2"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Notes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesSection;
