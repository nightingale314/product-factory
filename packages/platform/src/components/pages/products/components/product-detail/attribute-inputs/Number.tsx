import { Input } from "@/components/ui/input";
import { AttributeType } from "@prisma/client";
import { useEffect } from "react";
import { useState } from "react";
import { InputWrapper } from "./InputWrapper";
import { toast } from "sonner";
import { useValidator } from "../../../hooks/useValidator";

interface NumberInputProps {
  type: AttributeType;
  required?: boolean;
  id: string;
  name: string;
  value?: unknown;
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
    <InputWrapper id={id} name={name} required={required}>
      <Input
        type="number"
        name={id}
        value={displayValue}
        onChange={(e) => {
          setDisplayValue(e.target.value);
        }}
        onBlur={onSubmit}
      />
    </InputWrapper>
  );
};
