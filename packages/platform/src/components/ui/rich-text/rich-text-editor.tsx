"use client";

import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import ToolbarPlugin from "./plugins/tool-bar-plugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { $insertNodes } from "lexical";
import { $getRoot } from "lexical";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { Button } from "../button";

interface EditorProps {
  initialHtml?: string;
  placeholder?: string;
  editable?: boolean;
  onSave: (newHtml: string) => Promise<void>;
  onCancel: () => void;
}

function removeAllAttributesExceptStyle(element: HTMLElement) {
  // Collect all attribute names except "style"
  const attrs = Array.from(element.attributes)
    .map((attr) => attr.name)
    .filter((name) => name !== "style");
  // Remove them
  for (const name of attrs) {
    element.removeAttribute(name);
  }
  // Recursively process children
  for (const child of Array.from(element.children)) {
    removeAllAttributesExceptStyle(child as HTMLElement);
  }
}
export const Editor = ({
  initialHtml,
  placeholder = "Enter a value...",
  onSave,
  editable = true,
  onCancel,
}: EditorProps) => {
  const [editor] = useLexicalComposerContext();
  const [isSaving, setIsSaving] = useState(false);

  const convertToLexicalState = (htmlString: string) => {
    editor.update(() => {
      // In the browser you can use the native DOMParser API to parse the HTML string.
      const parser = new DOMParser();
      const dom = parser.parseFromString(htmlString, "text/html");

      // Once you have the DOM instance it's easy to generate LexicalNodes.
      const nodes = $generateNodesFromDOM(editor, dom);

      $getRoot().clear();
      // Select the root
      $getRoot().select();

      // Insert them at a selection.
      $insertNodes(nodes);
    });
  };

  useEffect(() => {
    if (initialHtml) {
      convertToLexicalState(initialHtml);
    }
  }, [initialHtml]);

  useEffect(() => {
    if (!editable) {
      editor.setEditable(false);
      editor.blur();
    } else {
      editor.setEditable(true);
      editor.focus();
    }
  }, [editable]);

  const handleOnSave = () => {
    editor.read(async () => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      // Parse the HTML string
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");
      // Clean all elements except style
      if (doc.body) {
        setIsSaving(true);
        removeAllAttributesExceptStyle(doc.body);
        // Serialize back to string
        const cleanedHtml = doc.body.innerHTML;
        await onSave(cleanedHtml);
        setIsSaving(false);
      }
    });
  };

  const handleOnCancel = () => {
    if (!initialHtml) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
      });
    } else {
      convertToLexicalState(initialHtml);
    }
    onCancel();
  };

  return (
    <div className="w-full">
      <div className="editor-container">
        {editable ? <ToolbarPlugin /> : null}

        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={
              <div className="editor-placeholder">{placeholder}</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <TabIndentationPlugin />
          <HistoryPlugin />
          <ListPlugin />
        </div>
      </div>
      {editable ? (
        <div className="flex gap-2 mt-2 justify-end">
          <Button
            size="sm"
            variant="link"
            onClick={handleOnSave}
            disabled={isSaving}
            isLoading={isSaving}
          >
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={handleOnCancel}>
            Cancel
          </Button>
        </div>
      ) : null}
    </div>
  );
};
