import { Input } from "@/components/ui/input";
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
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AttributeInputBaseType } from "./types";

interface MeasureInputProps extends AttributeInputBaseType {
  unitOptions: string[];
  onChange: (
    id: string,
    value: { value: number; unit: string } | null
  ) => Promise<boolean>;
}

const formatValue = (value: unknown) => {
  if (
    typeof value === "object" &&
    value !== null &&
    "value" in value &&
    "unit" in value
  ) {
    const { value: numberValue, unit } = value;
    let formatedNumber = "";
    let formatedUnit = "";

    if (isNaN(Number(numberValue))) {
      formatedNumber = "";
    } else {
      formatedNumber = `${numberValue}`;
    }

    if (typeof unit === "string") {
      formatedUnit = unit;
    }

    return {
      value: formatedNumber,
      unit: formatedUnit,
    };
  }

  return {
    value: "",
    unit: "",
  };
};

export const MeasureInput = ({
  id,
  name,
  type,
  required,
  value,
  onChange,
  lastUpdatedBy,
  lastUpdatedAt,
  unitOptions,
}: MeasureInputProps) => {
  const [displayValue, setDisplayValue] = useState<{
    value: string;
    unit: string;
  }>(formatValue(value));
  const validate = useValidator({ type, required: !!required });
  const initialValue = formatValue(value);
  const hasChanges =
    displayValue.value !== initialValue.value ||
    displayValue.unit !== initialValue.unit;
  const canClear = displayValue.value !== "" || displayValue.unit !== "";

  const onSubmit = async () => {
    if (displayValue === formatValue(value)) return;

    let formattedValue: { value: number; unit: string } | null = {
      value: Number(displayValue.value),
      unit: displayValue.unit,
    };

    if (displayValue.value === "" && displayValue.unit === "") {
      formattedValue = null;
    }

    const validation = validate<{ value: number; unit: string }>(
      formattedValue
    );

    if (validation.error) {
      toast.error(validation.error);
      return;
    }

    const success = await onChange(id, validation.data);
    if (!success) {
      setDisplayValue(formatValue(value));
    }
  };

  const handleOnClear = () => {
    setDisplayValue({ value: "", unit: "" });
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
        <Input
          type="number"
          id={id}
          value={displayValue.value}
          onChange={(e) => {
            setDisplayValue({ ...displayValue, value: e.target.value });
          }}
        />
        <Select
          value={displayValue.unit}
          onValueChange={(value) =>
            setDisplayValue({ ...displayValue, unit: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a value" />
          </SelectTrigger>
          <SelectContent>
            {unitOptions?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {canClear && (
          <Button size="sm" variant="link" onClick={handleOnClear}>
            Clear
          </Button>
        )}
        {hasChanges && (
          <>
            <Button variant="ghost" size="icon" onClick={onSubmit}>
              <Check className=" text-green-500" />
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
