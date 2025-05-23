import { QueryOperator, QueryType } from "@/lib/parsers/enums";
import { QueryRangeType, QueryValue } from "@/lib/parsers/types";
import { StringFilter } from "./string-filter";
import { BooleanFilter } from "./boolean-filter";
import { RangeFilter } from "./range-filter";
import { MultiStringFilter } from "./multi-string-filter";
import { FilterNodeOptions } from "../types";

type FilterNodeProps = {
  id: string;
  label: string;
  type: QueryType;
  value?: Omit<QueryValue, "key" | "type">;
  options?: FilterNodeOptions;
  renderLabel?: (label: React.ReactNode) => React.ReactNode;
  onApply: (value: QueryValue) => void;
};

export const FilterNode = ({ value, type, ...rest }: FilterNodeProps) => {
  switch (type) {
    case QueryType.STRING:
      return (
        <StringFilter
          operator={
            value && "operator" in value
              ? (value.operator as
                  | QueryOperator.CONTAINS
                  | QueryOperator.EQUALS)
              : undefined
          }
          value={value?.value as string}
          {...rest}
        />
      );

    case QueryType.MULTI_STRING:
      return <MultiStringFilter value={value?.value as string[]} {...rest} />;

    case QueryType.BOOLEAN:
      return <BooleanFilter value={value?.value as boolean} {...rest} />;

    case QueryType.RANGE:
      return (
        <RangeFilter
          value={value?.value as QueryRangeType["value"]}
          {...rest}
        />
      );

    default:
      return <div>Unsupported filter type</div>;
  }
};
