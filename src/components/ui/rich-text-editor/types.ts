
import { Editor } from '@tiptap/react';

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  className?: string;
}

export interface EditorComponentProps {
  editor: Editor;
}

export interface EditorToolbarProps extends EditorComponentProps {}

export interface EditorBubbleMenuProps extends EditorComponentProps {}

export interface EditorFooterProps extends EditorComponentProps {
  maxLength: number;
}
