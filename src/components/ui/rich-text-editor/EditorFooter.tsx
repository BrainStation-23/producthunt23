
import React from 'react';
import { EditorFooterProps } from './types';

const EditorFooter: React.FC<EditorFooterProps> = ({ editor, maxLength }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="text-xs text-muted-foreground p-2 border-t flex justify-between">
      <span>Rich text editor</span>
      <span>
        {editor.storage.characterCount.characters()}/{maxLength} characters
      </span>
    </div>
  );
};

export default EditorFooter;
