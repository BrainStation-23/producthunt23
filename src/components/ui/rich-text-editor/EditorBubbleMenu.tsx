
import React from 'react';
import { BubbleMenu } from '@tiptap/react';
import { 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditorBubbleMenuProps } from './types';

const EditorBubbleMenu: React.FC<EditorBubbleMenuProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    editor && (
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="bg-background shadow rounded-md border flex overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 h-8 ${editor.isActive('bold') ? 'bg-secondary' : ''}`}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 h-8 ${editor.isActive('italic') ? 'bg-secondary' : ''}`}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 h-8 ${editor.isActive('heading', { level: 2 }) ? 'bg-secondary' : ''}`}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-2 h-8 ${editor.isActive('heading', { level: 3 }) ? 'bg-secondary' : ''}`}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 h-8 ${editor.isActive('bulletList') ? 'bg-secondary' : ''}`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-2 h-8 ${editor.isActive('orderedList') ? 'bg-secondary' : ''}`}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`px-2 h-8 ${editor.isActive('codeBlock') ? 'bg-secondary' : ''}`}
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-2 h-8 ${editor.isActive('blockquote') ? 'bg-secondary' : ''}`}
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>
      </BubbleMenu>
    )
  );
};

export default EditorBubbleMenu;
