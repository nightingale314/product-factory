import { RichTextEditor } from "@/components/ui/rich-text";
import { InputWrapper } from "./InputWrapper";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface RichTextProps {
  id: string;
  name: string;
  value: unknown;
  onChange: (id: string, value: string | null) => Promise<boolean>;
}

const formatValue = (value: unknown) =>
  typeof value === "string" && value.trim() !== "" ? value : "";

export const RichText = ({ id, name, value, onChange }: RichTextProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>(formatValue(value));

  const handleOnChange = async (newHtml: string) => {
    if (newHtml === displayValue) return;

    const response = await onChange(id, newHtml || null);
    if (!response) {
      setDisplayValue(formatValue(value));
    }
    setIsEditable(false);
  };

  const handleOnCancel = () => {
    setIsEditable(false);
  };

  useEffect(() => {
    setDisplayValue(formatValue(value));
  }, [value]);

  return (
    <InputWrapper id={id} name={name}>
      <div
        onClick={() => {
          if (!isEditable) {
            setIsEditable(true);
          }
        }}
        className={cn(
          "w-full rounded-md",
          !isEditable &&
            "cursor-pointer hover:ring-1 hover:ring-primary hover:ring-offset-2"
        )}
      >
        <RichTextEditor
          initialHtml={displayValue}
          onSave={handleOnChange}
          editable={isEditable}
          onCancel={handleOnCancel}
        />
      </div>
    </InputWrapper>
  );
};
