import { useCallback } from "react";
import { useState } from "react";
import { InputWrapper } from "./InputWrapper";
import { toast } from "sonner";
import { useValidator } from "../../../hooks/useValidator";
import { MultiAsyncSelect } from "@/components/ui/multi-select";
import { debounce } from "lodash";
import { AttributeInputBaseType } from "./types";

interface MultiSelectInputProps extends AttributeInputBaseType {
  options?: { label: string; value: string }[];
  onChange: (id: string, value: string[] | null) => Promise<boolean>;
}

const formatValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map((v) => v.value);
  }

  return [];
};

export const MultiSelectInput = ({
  id,
  name,
  type,
  required,
  value,
  onChange,
  options,
  lastUpdatedBy,
  lastUpdatedAt,
}: MultiSelectInputProps) => {
  const [loading, setLoading] = useState(false);
  const [displayValue, setDisplayValue] = useState<string[]>(
    formatValue(value)
  );
  const validate = useValidator({ type, required: !!required });

  const debouncedOnSubmit = useCallback(
    debounce(async (updatedValue: string[]) => {
      if (updatedValue === formatValue(value)) return;

      const validation = validate<string[]>(updatedValue);

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
    }, 300),
    [onChange, id, validate, value]
  );

  return (
    <InputWrapper
      id={id}
      name={name}
      required={required}
      lastUpdatedBy={lastUpdatedBy}
      lastUpdatedAt={lastUpdatedAt}
    >
      <MultiAsyncSelect
        id={id}
        disabled={loading}
        value={displayValue}
        placeholder="Select a value"
        options={options ?? []}
        onValueChange={debouncedOnSubmit}
      />
    </InputWrapper>
  );
};
