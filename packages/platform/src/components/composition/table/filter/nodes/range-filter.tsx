import { QueryRangeType } from "@/lib/parsers/types";
import { FilterInput } from "../types";
import { NodeContainer } from "./node-container";
import { QueryOperator, QueryType } from "@/lib/parsers/enums";
import { useState } from "react";
import { SelectItem, SelectValue } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type RangeFilterProps = FilterInput & Partial<Pick<QueryRangeType, "value">>;

enum RangeOperator {
  GREATER_THAN = "GREATER_THAN",
  LESS_THAN = "LESS_THAN",
  BETWEEN = "BETWEEN",
}

const operators = [
  {
    label: "is Greater than",
    value: RangeOperator.GREATER_THAN,
  },
  {
    label: "is Less than",
    value: RangeOperator.LESS_THAN,
  },
  {
    label: "is Between",
    value: RangeOperator.BETWEEN,
  },
];

const getOperatorFromValue = (value?: QueryRangeType["value"]) => {
  if (value?.min && value?.max) {
    return RangeOperator.BETWEEN;
  }

  if (value?.min) {
    return RangeOperator.GREATER_THAN;
  }

  if (value?.max) {
    return RangeOperator.LESS_THAN;
  }

  return operators[0].value;
};

export const RangeFilter = ({
  id,
  label,
  value,
  onApply,
  renderLabel,
}: RangeFilterProps) => {
  const [operator, setOperator] = useState<RangeOperator>(
    getOperatorFromValue(value)
  );
  const [min, setMin] = useState<number | undefined>(value?.min?.value);
  const [max, setMax] = useState<number | undefined>(value?.max?.value);

  const onApplyClick = () => {
    if (operator === RangeOperator.BETWEEN) {
      if (min === undefined || max === undefined) {
        return;
      }

      onApply({
        key: id,
        type: QueryType.RANGE,
        value: {
          min: { value: min, operator: QueryOperator.GREATER_THAN_OR_EQUAL },
          max: { value: max, operator: QueryOperator.LESS_THAN_OR_EQUAL },
        },
      });
    }

    if (operator === RangeOperator.GREATER_THAN) {
      if (min === undefined) {
        return;
      }

      onApply({
        key: id,
        type: QueryType.RANGE,
        value: {
          min: { value: min, operator: QueryOperator.GREATER_THAN_OR_EQUAL },
        },
      });
    }

    if (operator === RangeOperator.LESS_THAN) {
      if (max === undefined) {
        return;
      }

      onApply({
        key: id,
        type: QueryType.RANGE,
        value: {
          max: { value: max, operator: QueryOperator.LESS_THAN_OR_EQUAL },
        },
      });
    }
  };

  return (
    <NodeContainer
      label={label}
      onApply={onApplyClick}
      renderLabel={renderLabel}
    >
      <Select
        value={operator}
        onValueChange={(value) => setOperator(value as RangeOperator)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a value" />
        </SelectTrigger>
        <SelectContent>
          {operators.map((i) => (
            <SelectItem key={i.value} value={i.value}>
              {i.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {operator === RangeOperator.BETWEEN && (
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            defaultValue={min}
            onChange={(e) => {
              setMin(Number(e.target.value));
            }}
          />
          and
          <Input
            type="number"
            defaultValue={max}
            onChange={(e) => {
              setMax(Number(e.target.value));
            }}
          />
        </div>
      )}
      {operator === RangeOperator.GREATER_THAN && (
        <Input
          type="number"
          defaultValue={min}
          onChange={(e) => {
            setMin(Number(e.target.value));
          }}
          className="w-full"
        />
      )}
      {operator === RangeOperator.LESS_THAN && (
        <Input
          type="number"
          defaultValue={max}
          onChange={(e) => {
            setMax(Number(e.target.value));
          }}
          className="w-full"
        />
      )}
    </NodeContainer>
  );
};
