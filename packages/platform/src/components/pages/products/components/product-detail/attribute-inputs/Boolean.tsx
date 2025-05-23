import { useEffect, useTransition } from "react";
import { useState } from "react";
import { InputWrapper } from "./InputWrapper";
import { toast } from "sonner";
import { useValidator } from "../../../hooks/useValidator";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AttributeInputBaseType } from "./types";
import Spinner from "@/components/ui/icons/Spinner";

interface BooleanInputProps extends AttributeInputBaseType {
  onChange: (id: string, value: boolean | null) => Promise<boolean>;
}

const formatValue = (value: unknown) =>
  typeof value === "boolean" ? value : false;

export const BooleanInput = ({
  id,
  name,
  type,
  required,
  value,
  onChange,
  lastUpdatedBy,
  lastUpdatedAt,
}: BooleanInputProps) => {
  const [displayValue, setDisplayValue] = useState<boolean>(formatValue(value));
  const validate = useValidator({ type, required: !!required });
  const [isLoading, startTransition] = useTransition();

  const hasChanges = displayValue !== formatValue(value);

  const onSubmit = async () => {
    if (displayValue === formatValue(value)) return;

    const validation = validate<boolean>(displayValue);

    if (validation.error) {
      toast.error(validation.error);
      return;
    }

    const success = await onChange(id, validation.data ?? null);
    if (!success) {
      setDisplayValue(formatValue(value));
    }
  };

  const handleOnCancel = () => {
    setDisplayValue(formatValue(value));
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
      <div className="flex items-center gap-2">
        <Switch
          id={id}
          checked={displayValue}
          onCheckedChange={(checked) => {
            setDisplayValue(checked);
          }}
        />
        {hasChanges && (
          <>
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoading}
              onClick={() => startTransition(onSubmit)}
            >
              {isLoading ? (
                <Spinner className="!size-6" />
              ) : (
                <Check className=" text-green-500" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleOnCancel}>
              <X className=" text-black-500" />
            </Button>
          </>
        )}
      </div>
    </InputWrapper>
  );
};
