"use client";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ParagraphNode } from "lexical";
import { ListNode } from "@lexical/list";
import { RichTextTheme } from "./theme";
import { Editor } from "./rich-text-editor";

interface RichTextEditorProps {
  initialHtml?: string;
  placeholder?: string;
  editable?: boolean;
  onSave: (newHtml: string) => Promise<void>;
  onCancel: () => void;
}

const nodes = [HeadingNode, ParagraphNode, QuoteNode, ListNode, ListItemNode];

const onError = (error: Error) => {
  console.error(error);
};

export const RichTextEditor = ({
  initialHtml,
  placeholder = "Enter a value...",
  onSave,
  editable = true,
  onCancel,
}: RichTextEditorProps) => {
  const editorConfig: InitialConfigType = {
    namespace: "editor",
    onError,
    nodes,
    theme: RichTextTheme,
    editable,
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Editor
        initialHtml={initialHtml}
        placeholder={placeholder}
        onSave={onSave}
        editable={editable}
        onCancel={onCancel}
      />
    </LexicalComposer>
  );
};
