"use client";

import { FilterInput } from "../types";
import { useState } from "react";
import { QueryOperator, QueryType } from "@/lib/parsers/enums";
import { NodeContainer } from "./node-container";
import { MultiAsyncSelect } from "@/components/ui/multi-select";

type MultiStringFilterProps = FilterInput & {
  value?: string[];
};

export const MultiStringFilter = ({
  id,
  label,
  value,
  options,
  onApply,
}: MultiStringFilterProps) => {
  const [inputValue, setInputValue] = useState<string[]>(value ?? []);

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
      <MultiAsyncSelect
        placeholder="Select a value"
        defaultValue={value}
        options={options?.selectOptions ?? []}
        onValueChange={(value) => setInputValue(value)}
      />
    </NodeContainer>
  );
};
