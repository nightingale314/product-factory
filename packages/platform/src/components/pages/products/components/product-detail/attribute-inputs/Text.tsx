import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AttributeType } from "@prisma/client";
import { useEffect } from "react";
import { useState } from "react";
import { InputWrapper } from "./InputWrapper";
import { toast } from "sonner";
import { useValidator } from "../../../hooks/useValidator";

interface TextInputProps {
  type: AttributeType;
  required?: boolean;
  id: string;
  name: string;
  value?: unknown;
  onChange: (id: string, value: string | null) => Promise<boolean>;
}

const formatValue = (value: unknown) =>
  typeof value === "string" ? value : "";

export const TextInput = ({
  id,
  name,
  type,
  required,
  value,
  onChange,
}: TextInputProps) => {
  const [displayValue, setDisplayValue] = useState(formatValue(value) ?? "");
  const validate = useValidator({ type, required: !!required });

  const onSubmit = async () => {
    if (displayValue === formatValue(value)) return;

    const validation = validate<string>(displayValue);

    if (validation.error) {
      toast.error(validation.error);
      return;
    }

    const success = await onChange(id, validation.data ?? null);
    if (!success) {
      setDisplayValue(formatValue(value));
    }
  };

  useEffect(() => {
    setDisplayValue(formatValue(value));
  }, [value]);

  if (type === AttributeType.LONG_TEXT) {
    return (
      <InputWrapper id={id} name={name} required={required}>
        <Textarea
          id={id}
          value={displayValue}
          onChange={(e) => setDisplayValue(e.target.value)}
          onBlur={onSubmit}
        />
      </InputWrapper>
    );
  }

  return (
    <InputWrapper id={id} name={name} required={required}>
      <Input
        id={id}
        value={displayValue}
        onChange={(e) => setDisplayValue(e.target.value)}
        onBlur={onSubmit}
      />
    </InputWrapper>
  );
};
