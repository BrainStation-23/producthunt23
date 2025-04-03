
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import TextAlign from '@tiptap/extension-text-align';
import { EditorProps } from './types';
import EditorToolbar from './EditorToolbar';
import EditorBubbleMenu from './EditorBubbleMenu';
import EditorFooter from './EditorFooter';

const RichTextEditor: React.FC<EditorProps> = ({
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
      <EditorBubbleMenu editor={editor} />
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="overflow-y-auto" />
      <EditorFooter editor={editor} maxLength={maxLength} />
    </div>
  );
};

export default RichTextEditor;
