
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, 
  Undo, Redo, Code, AlignLeft, AlignCenter, AlignRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  maxLength = 2000,
  placeholder = 'Start typing...',
  className,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  // Initialize the editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({
        limit: maxLength,
      }),
      BubbleMenuExtension,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose dark:prose-invert focus:outline-none w-full max-w-full min-h-[150px] p-4',
        'data-placeholder': placeholder,
      },
    },
  });

  // Set the initial content once the editor is ready
  useEffect(() => {
    if (editor && value && !editor.isEmpty && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Handle client-side rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!editor) {
    return null;
  }

  return (
    <div className={`border rounded-md relative ${className}`}>
      {editor && (
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
      )}

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
        <div className="border-l mx-1" />
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
      </div>

      <EditorContent editor={editor} className="overflow-y-auto" />
      
      <div className="text-xs text-muted-foreground p-2 border-t flex justify-between">
        <span>Rich text editor</span>
        <span>
          {editor.storage.characterCount.characters()}/{maxLength} characters
        </span>
      </div>
    </div>
  );
};

export default RichTextEditor;
