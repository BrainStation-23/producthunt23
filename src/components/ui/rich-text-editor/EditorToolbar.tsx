
import React from 'react';
import { 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, 
  Undo, Redo, Code, AlignLeft, AlignCenter, AlignRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditorToolbarProps } from './types';

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex border-b p-2 gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 ${editor.isActive('bold') ? 'bg-secondary' : ''}`}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 ${editor.isActive('italic') ? 'bg-secondary' : ''}`}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 ${editor.isActive('heading', { level: 2 }) ? 'bg-secondary' : ''}`}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 ${editor.isActive('heading', { level: 3 }) ? 'bg-secondary' : ''}`}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 ${editor.isActive('bulletList') ? 'bg-secondary' : ''}`}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 ${editor.isActive('orderedList') ? 'bg-secondary' : ''}`}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`px-2 ${editor.isActive('codeBlock') ? 'bg-secondary' : ''}`}
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-2 ${editor.isActive('blockquote') ? 'bg-secondary' : ''}`}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <div className="border-l mx-1" />
      <TextAlignButtons editor={editor} />
      <div className="border-l mx-1" />
      <HistoryButtons editor={editor} />
    </div>
  );
};

const TextAlignButtons: React.FC<EditorToolbarProps> = ({ editor }) => {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`px-2 ${editor.isActive({ textAlign: 'left' }) ? 'bg-secondary' : ''}`}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`px-2 ${editor.isActive({ textAlign: 'center' }) ? 'bg-secondary' : ''}`}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`px-2 ${editor.isActive({ textAlign: 'right' }) ? 'bg-secondary' : ''}`}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
    </>
  );
};

const HistoryButtons: React.FC<EditorToolbarProps> = ({ editor }) => {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="px-2"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="px-2"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </>
  );
};

export default EditorToolbar;
