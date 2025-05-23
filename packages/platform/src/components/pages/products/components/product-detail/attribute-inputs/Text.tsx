import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AttributeType } from "@prisma/client";
import { useEffect, useTransition } from "react";
import { useState } from "react";
import { InputWrapper } from "./InputWrapper";
import { toast } from "sonner";
import { useValidator } from "../../../hooks/useValidator";
import { AttributeInputBaseType } from "./types";
import Spinner from "@/components/ui/icons/Spinner";
import { cn } from "@/lib/utils";

interface TextInputProps extends AttributeInputBaseType {
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
  lastUpdatedBy,
  lastUpdatedAt,
}: TextInputProps) => {
  const [displayValue, setDisplayValue] = useState(formatValue(value) ?? "");
  const [isLoading, startTransition] = useTransition();
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
      <InputWrapper
        id={id}
        name={name}
        required={required}
        lastUpdatedBy={lastUpdatedBy}
        lastUpdatedAt={lastUpdatedAt}
      >
        <Textarea
          id={id}
          value={displayValue}
          onChange={(e) => setDisplayValue(e.target.value)}
          onBlur={() => startTransition(onSubmit)}
        />
      </InputWrapper>
    );
  }

  return (
    <InputWrapper
      id={id}
      name={name}
      required={required}
      lastUpdatedBy={lastUpdatedBy}
      lastUpdatedAt={lastUpdatedAt}
    >
      <Input
        id={id}
        value={displayValue}
        onChange={(e) => setDisplayValue(e.target.value)}
        onBlur={() => startTransition(onSubmit)}
      />
      <Spinner
        className={cn(
          "ml-2 text-gray-400 !size-6 opacity-0",
          isLoading && "opacity-100"
        )}
      />
    </InputWrapper>
  );
};
