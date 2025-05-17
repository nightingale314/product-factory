import { QueryOperator } from "@/lib/parsers/enums";
import { FilterInput } from "../types";
import { QueryType } from "@/lib/parsers/enums";
import { useState } from "react";
import {
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { NodeContainer } from "./node-container";

type BooleanFilterProps = FilterInput & {
  value?: boolean;
};

export const BooleanFilter = ({
  id,
  label,
  value,
  onApply,
  renderLabel,
}: BooleanFilterProps) => {
  const [inputValue, setInputValue] = useState<boolean | undefined>(value);

  const onApplyClick = () => {
    if (inputValue === undefined) {
      return;
    }

    onApply({
      key: id,
      operator: QueryOperator.EQUALS,
      type: QueryType.BOOLEAN,
      value: inputValue,
    });
  };

  return (
    <NodeContainer
      label={label}
      selectedOperator={QueryOperator.EQUALS}
      onApply={onApplyClick}
      renderLabel={renderLabel}
    >
      <Select
        defaultValue={value !== undefined ? `${value}` : undefined}
        onValueChange={(value) => setInputValue(value === "true")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a value" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">True</SelectItem>
          <SelectItem value="false">False</SelectItem>
        </SelectContent>
      </Select>
    </NodeContainer>
  );
};
