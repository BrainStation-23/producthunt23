
import React from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorBubbleMenuProps {
  editor: Editor;
}

const EditorBubbleMenu: React.FC<EditorBubbleMenuProps> = ({ editor }) => {
  const buttonClasses = "p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";
  const activeButtonClasses = "bg-gray-100 dark:bg-gray-800 text-primary";

  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <div className="flex items-center gap-1 p-1 rounded-lg border bg-background shadow-md">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(buttonClasses, editor.isActive('bold') && activeButtonClasses)}
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(buttonClasses, editor.isActive('italic') && activeButtonClasses)}
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(buttonClasses, editor.isActive('bulletList') && activeButtonClasses)}
        >
          <List className="h-3.5 w-3.5" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(buttonClasses, editor.isActive('orderedList') && activeButtonClasses)}
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
      </div>
    </BubbleMenu>
  );
};

export default EditorBubbleMenu;
