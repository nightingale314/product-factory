import { FilterInput } from "../types";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { QueryOperator } from "@/lib/parsers/enums";
import { QueryType } from "@/lib/parsers/enums";
import { NodeContainer } from "./node-container";

type StringFilterProps = FilterInput & {
  value?: string;
};

export const StringFilter = ({
  id,
  label,
  value,
  onApply,
  renderLabel,
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
