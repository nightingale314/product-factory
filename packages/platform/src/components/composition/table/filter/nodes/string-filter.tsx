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
  const [selectedOperator, setSelectedOperator] = useState<
    QueryOperator.CONTAINS | QueryOperator.EQUALS
  >(QueryOperator.EQUALS);

  const onMultiStringApplyClick = () => {
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

  const onStringApplyClick = () => {
    if (inputValue === undefined) {
      return;
    }

    onApply({
      key: id,
      operator: selectedOperator,
      type: QueryType.STRING,
      value: inputValue,
    });
  };

  if (options?.selectOptions) {
    return (
      <NodeContainer
        label={label}
        selectedOperator={QueryOperator.EQUALS}
        onApply={onMultiStringApplyClick}
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
      onApply={onStringApplyClick}
      renderLabel={renderLabel}
    >
      <Select
        value={selectedOperator}
        onValueChange={(value) =>
          setSelectedOperator(
            value as QueryOperator.CONTAINS | QueryOperator.EQUALS
          )
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a value" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={QueryOperator.EQUALS}>Is equal to</SelectItem>
          <SelectItem value={QueryOperator.CONTAINS}>Contains</SelectItem>
        </SelectContent>
      </Select>
      <Input
        defaultValue={value}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full"
      />
    </NodeContainer>
  );
};
