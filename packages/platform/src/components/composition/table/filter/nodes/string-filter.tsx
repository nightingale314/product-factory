import { FilterInput } from "../types";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { QueryOperator } from "@/lib/parsers/enums";
import { QueryType } from "@/lib/parsers/enums";
import { NodeContainer } from "./node-container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StringFilterProps = FilterInput & {
  value?: string;
};

export const StringFilter = ({
  id,
  label,
  value,
  onApply,
  renderLabel,
  options,
}: StringFilterProps) => {
  const [inputValue, setInputValue] = useState<string>(value ?? "");

  const onApplyClick = () => {
    if (inputValue === undefined) {
      return;
    }

    onApply({
      key: id,
      operator: QueryOperator.EQUALS,
      type: QueryType.STRING,
      value: inputValue,
    });
  };

  if (options?.selectOptions) {
    return (
      <NodeContainer
        label={label}
        selectedOperator={QueryOperator.EQUALS}
        onApply={onApplyClick}
        renderLabel={renderLabel}
      >
        <Select
          defaultValue={value}
          onValueChange={(value) => setInputValue(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a value" />
          </SelectTrigger>
          <SelectContent>
            {options.selectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </NodeContainer>
    );
  }

  return (
    <NodeContainer
      label={label}
      selectedOperator={QueryOperator.EQUALS}
      onApply={onApplyClick}
      renderLabel={renderLabel}
    >
      <Input
        defaultValue={value}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full"
      />
    </NodeContainer>
  );
};
