import { AttributeType } from "@prisma/client";
import { useEffect } from "react";
import { useState } from "react";
import { InputWrapper } from "./InputWrapper";
import { toast } from "sonner";
import { useValidator } from "../../../hooks/useValidator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DropdownInputProps {
  type: AttributeType;
  required?: boolean;
  id: string;
  name: string;
  value?: unknown;
  options?: { label: string; value: string }[];
  onChange: (id: string, value: string | null) => Promise<boolean>;
}

const formatValue = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }

  return "";
};

export const DropdownInput = ({
  id,
  name,
  type,
  required,
  value,
  onChange,
  options,
}: DropdownInputProps) => {
  const [loading, setLoading] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>(formatValue(value));
  const validate = useValidator({ type, required: !!required });

  const onSubmit = async () => {
    if (displayValue === formatValue(value)) return;

    const validation = validate<string>(displayValue);

    if (validation.error) {
      toast.error(validation.error);
      return;
    }

    setLoading(true);
    const success = await onChange(id, validation.data ?? null);
    if (!success) {
      setDisplayValue(formatValue(value));
    }
    setLoading(false);
  };

  useEffect(() => {
    setDisplayValue(formatValue(value));
  }, [value]);

  return (
    <InputWrapper id={id} name={name} required={required}>
      <Select
        name={id}
        value={displayValue}
        onValueChange={(value) => setDisplayValue(value)}
      >
        <SelectTrigger onBlur={onSubmit} disabled={loading}>
          <SelectValue placeholder="Select a value" />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </InputWrapper>
  );
};
