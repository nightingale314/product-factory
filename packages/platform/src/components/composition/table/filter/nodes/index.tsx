import { QueryType } from "@/lib/parsers/enums";
import { QueryRangeType, QueryValue } from "@/lib/parsers/types";
import { StringFilter } from "./string-filter";
import { BooleanFilter } from "./boolean-filter";
import { RangeFilter } from "./range-filter";
import { MultiStringFilter } from "./multi-string-filter";

type FilterNodeProps = {
  id: string;
  label: string;
  type: QueryType;
  value?: Omit<QueryValue, "key" | "type">;
  options?: {
    selectOptions?: {
      label: string;
      value: string;
    }[];
  };
  renderLabel?: (label: React.ReactNode) => React.ReactNode;
  onApply: (value: QueryValue) => void;
};

export const FilterNode = ({
  value,
  type,
  options,
  ...rest
}: FilterNodeProps) => {
  console.log(options);
  switch (type) {
    case QueryType.STRING:
      return <StringFilter value={value?.value as string} {...rest} />;

    case QueryType.MULTI_STRING:
      return (
        <MultiStringFilter
          value={value?.value as string[]}
          options={options?.selectOptions ?? []}
          {...rest}
        />
      );

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
