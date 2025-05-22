import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useState } from "react";
import { InputWrapper } from "./InputWrapper";
import { toast } from "sonner";
import { useValidator } from "../../../hooks/useValidator";
import { AttributeInputBaseType } from "./types";

interface NumberInputProps extends AttributeInputBaseType {
  onChange: (id: string, value: string | null) => Promise<boolean>;
}

const formatValue = (value: unknown) =>
  isNaN(Number(value)) ? "" : `${value}`;

export const NumberInput = ({
  id,
  name,
  type,
  required,
  value,
  onChange,
  lastUpdatedBy,
  lastUpdatedAt,
}: NumberInputProps) => {
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

  return (
    <InputWrapper
      id={id}
      name={name}
      required={required}
      lastUpdatedBy={lastUpdatedBy}
      lastUpdatedAt={lastUpdatedAt}
    >
      <Input
        type="number"
        id={id}
        value={displayValue}
        onChange={(e) => {
          setDisplayValue(e.target.value);
        }}
        onBlur={onSubmit}
      />
    </InputWrapper>
  );
};
