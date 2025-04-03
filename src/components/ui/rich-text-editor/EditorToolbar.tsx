
import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  editor: Editor | null;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  const buttonClasses = "p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";
  const activeButtonClasses = "bg-gray-100 dark:bg-gray-800 text-primary";

  return (
    <div className="border-b p-1 flex flex-wrap gap-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(buttonClasses, editor.isActive('bold') && activeButtonClasses)}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(buttonClasses, editor.isActive('italic') && activeButtonClasses)}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(buttonClasses, editor.isActive('heading', { level: 1 }) && activeButtonClasses)}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(buttonClasses, editor.isActive('heading', { level: 2 }) && activeButtonClasses)}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(buttonClasses, editor.isActive('heading', { level: 3 }) && activeButtonClasses)}
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(buttonClasses, editor.isActive('bulletList') && activeButtonClasses)}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(buttonClasses, editor.isActive('orderedList') && activeButtonClasses)}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={cn(buttonClasses, editor.isActive({ textAlign: 'left' }) && activeButtonClasses)}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={cn(buttonClasses, editor.isActive({ textAlign: 'center' }) && activeButtonClasses)}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={cn(buttonClasses, editor.isActive({ textAlign: 'right' }) && activeButtonClasses)}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default EditorToolbar;
