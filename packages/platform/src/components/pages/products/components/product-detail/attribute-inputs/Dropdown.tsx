import { useEffect, useTransition } from "react";
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
import { AttributeInputBaseType } from "./types";
import { cn } from "@/lib/utils";
import Spinner from "@/components/ui/icons/Spinner";

interface DropdownInputProps extends AttributeInputBaseType {
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
  lastUpdatedBy,
  lastUpdatedAt,
}: DropdownInputProps) => {
  const [loading, setLoading] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>(formatValue(value));
  const validate = useValidator({ type, required: !!required });
  const [isLoading, startTransition] = useTransition();

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
    <InputWrapper
      id={id}
      name={name}
      required={required}
      lastUpdatedBy={lastUpdatedBy}
      lastUpdatedAt={lastUpdatedAt}
    >
      <Select
        name={id}
        value={displayValue}
        onValueChange={(value) => setDisplayValue(value)}
      >
        <SelectTrigger
          onBlur={() => startTransition(onSubmit)}
          disabled={loading}
        >
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
      <Spinner
        className={cn(
          "ml-2 text-gray-400 !size-6 opacity-0",
          isLoading && "opacity-100"
        )}
      />
    </InputWrapper>
  );
};
