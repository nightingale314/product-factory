import { TableFilter } from "@/components/composition/table/filter";
import { FilterNodeType } from "@/components/composition/table/filter/types";
import { Badge } from "@/components/ui/badge";
import { QueryType } from "@/lib/parsers/enums";
import { QueryValue } from "@/lib/parsers/types";
import { Attribute } from "@prisma/client";
import { useMemo } from "react";

const mapAttributeToQueryType = (attribute: Attribute) => {
  switch (attribute.type) {
    case "SHORT_TEXT":
      return QueryType.STRING;
    case "LONG_TEXT":
      return null;
    case "NUMBER":
      return QueryType.RANGE;
    case "BOOLEAN":
      return QueryType.BOOLEAN;
    case "DATE":
      return QueryType.DATE;
    case "SINGLE_SELECT":
      return QueryType.STRING;
    case "MULTI_SELECT":
      return QueryType.MULTI_STRING;
    case "HTML":
      return null;
    case "MEASURE":
      return null;
    default:
      return null;
  }
};

const fixedFilters: FilterNodeType[] = [
  {
    key: "name",
    label: "Name",
    type: QueryType.STRING,
    fixed: true,
  },
  {
    key: "skuId",
    label: "SKU ID",
    type: QueryType.STRING,
    fixed: true,
  },
];

const getFilterNodeOptions = (attribute: Attribute) => {
  switch (attribute.type) {
    case "MULTI_SELECT":
      return {
        selectOptions: attribute?.selectOptions.map((option) => ({
          label: option,
          value: option,
        })),
      };
    default:
      return undefined;
  }
};
export const ProductTableFilter = ({
  filterValues,
  supplierAttributes,
  onFilterChange,
}: {
  filterValues: Map<string, QueryValue>;
  supplierAttributes: Attribute[];
  onFilterChange: (updatedFilterValues: Map<string, QueryValue>) => void;
}) => {
  const availableFilterNodes = useMemo(
    () => [
      ...fixedFilters,
      ...(supplierAttributes
        .map((attribute) => ({
          key: attribute.id,
          label: attribute.name,
          type: mapAttributeToQueryType(attribute),
          infoBadge: <Badge variant="secondary">{attribute.type}</Badge>,
          options: getFilterNodeOptions(attribute),
        }))
        .filter((f) => f.type !== null) as FilterNodeType[]),
    ],
    [supplierAttributes]
  );

  return (
    <div className="mb-8">
      <TableFilter
        filterValues={filterValues}
        availableFilterNodes={availableFilterNodes}
        onFilterChange={onFilterChange}
      />
    </div>
  );
};
