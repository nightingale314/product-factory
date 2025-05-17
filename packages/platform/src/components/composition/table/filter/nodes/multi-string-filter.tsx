import { FilterInput } from "../types";
import { SelectContent } from "@/components/ui/select";
import { SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";
import { useEffect } from "react";
import { useState } from "react";
import { QueryOperator, QueryType } from "@/lib/parsers/enums";
import { NodeContainer } from "./node-container";
import { Select } from "@/components/ui/select";

type MultiStringFilterProps = FilterInput & {
  value?: string[];
  options: { label: string; value: string }[];
};

export const MultiStringFilter = ({
  id,
  label,
  value,
  options,
  onApply,
}: MultiStringFilterProps) => {
  const [inputValue, setInputValue] = useState<string[]>(value ?? []);

  useEffect(() => {
    setInputValue(value ?? []);
  }, [value]);

  const onApplyClick = () => {
    onApply({
      key: id,
      operator: QueryOperator.IN,
      type: QueryType.MULTI_STRING,
      value: inputValue,
    });
  };

  return (
    <NodeContainer
      label={label}
      selectedOperator={QueryOperator.IN}
      onApply={onApplyClick}
    >
      <Select
        value={inputValue !== undefined ? `${inputValue}` : undefined}
        onValueChange={(value) => setInputValue(value.split(","))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a value" />
        </SelectTrigger>
        <SelectContent>
          {options.map((i) => (
            <SelectItem key={i.value} value={i.value}>
              {i.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </NodeContainer>
  );
};
