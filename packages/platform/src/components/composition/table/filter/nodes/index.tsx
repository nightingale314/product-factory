import { QueryType } from "@/lib/parsers/enums";
import { QueryRangeType, QueryValue } from "@/lib/parsers/types";
import { StringFilter } from "./string-filter";
import { BooleanFilter } from "./boolean-filter";
import { RangeFilter } from "./range-filter";

type FilterNodeProps = {
  id: string;
  label: string;
  type: QueryType;
  value?: Omit<QueryValue, "key" | "type">;
  renderLabel?: (label: React.ReactNode) => React.ReactNode;
  onApply: (value: QueryValue) => void;
};

export const FilterNode = ({ value, type, ...rest }: FilterNodeProps) => {
  switch (type) {
    case QueryType.STRING:
      return <StringFilter value={value?.value as string} {...rest} />;

    case QueryType.MULTI_STRING:
      return null;

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
