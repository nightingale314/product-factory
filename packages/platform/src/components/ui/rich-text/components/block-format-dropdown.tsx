import { $createParagraphNode, $getSelection, LexicalEditor } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select,
} from "../../select";

export const blockTypeToBlockName = {
  bullet: "Bulleted List",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  number: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
};

export const rootTypeToRootName = {
  root: "Root",
};

interface BlockFormatDropdownProps {
  blockType: keyof typeof blockTypeToBlockName;
  editor: LexicalEditor;
  disabled?: boolean;
}

export const BlockFormatDropdown = ({
  blockType,
  editor,
  disabled,
}: BlockFormatDropdownProps) => {
  const handleValueChange = (value: string) => {
    switch (value) {
      case "paragraph":
        editor.update(() => {
          const selection = $getSelection();
          $setBlocksType(selection, () => $createParagraphNode());
        });
        break;

      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        {
          if (blockType !== value) {
            editor.update(() => {
              const selection = $getSelection();
              $setBlocksType(selection, () => $createHeadingNode(value));
            });
          }
        }
        break;

      case "bullet":
        {
          if (blockType !== "bullet") {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          } else {
            editor.update(() => {
              const selection = $getSelection();
              $setBlocksType(selection, () => $createParagraphNode());
            });
          }
        }
        break;

      case "number":
        {
          if (blockType !== "number") {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          } else {
            editor.update(() => {
              const selection = $getSelection();
              $setBlocksType(selection, () => $createParagraphNode());
            });
          }
        }
        break;
      case "quote":
        {
          if (blockType !== "quote") {
            editor.update(() => {
              const selection = $getSelection();
              $setBlocksType(selection, () => $createQuoteNode());
            });
          }
        }
        break;

      default:
        break;
    }
  };

  return (
    <div>
      <Select
        onValueChange={handleValueChange}
        disabled={disabled}
        value={blockType}
      >
        <SelectTrigger size="sm" className="!min-w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            editor.focus();
          }}
        >
          <SelectItem value="paragraph">Normal</SelectItem>
          <SelectItem value="h1">Heading 1</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
          <SelectItem value="h4">Heading 4</SelectItem>
          <SelectItem value="h5">Heading 5</SelectItem>
          <SelectItem value="h6">Heading 6</SelectItem>
          <SelectItem value="bullet">Bulleted List</SelectItem>
          <SelectItem value="number">Numbered List</SelectItem>
          <SelectItem value="quote">Quote</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
