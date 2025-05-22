import { FilterInput } from "../types";
import { NodeContainer } from "./node-container";
import { QueryOperator } from "@/lib/parsers/enums";

type MeasureFilterProps = FilterInput & {
  value: boolean;
};

export const MeasureFilter = ({ label, renderLabel }: MeasureFilterProps) => {
  const onApplyClick = () => {};

  return (
    <NodeContainer
      label={label}
      selectedOperator={QueryOperator.EQUALS}
      onApply={onApplyClick}
      renderLabel={renderLabel}
    >
      Not implemented
    </NodeContainer>
  );
};
