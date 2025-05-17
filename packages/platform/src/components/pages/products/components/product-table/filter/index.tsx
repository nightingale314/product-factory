import { TableFilter } from "@/components/composition/table/filter";
import {
  FilterNodeOptions,
  FilterNodeType,
} from "@/components/composition/table/filter/types";
import { Badge } from "@/components/ui/badge";
import { MAX_PRODUCT_TABLE_FILTERS } from "@/constants/common";
import { QueryType } from "@/lib/parsers/enums";
import { QueryValue } from "@/lib/parsers/types";
import { Attribute } from "@prisma/client";
import { useMemo } from "react";

const mapAttributeToQueryType = (attribute: Attribute) => {
  switch (attribute.type) {
    case "SHORT_TEXT":
      return QueryType.STRING;
    case "LONG_TEXT":
      return QueryType.STRING;
    case "NUMBER":
      return QueryType.RANGE;
    case "BOOLEAN":
      return QueryType.BOOLEAN;
    case "DATE":
      return null;
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

const getFilterNodeOptions = (
  attribute: Attribute
): FilterNodeOptions | undefined => {
  switch (attribute.type) {
    case "SINGLE_SELECT":
    case "MULTI_SELECT":
      return {
        selectOptions: attribute?.selectOptions.map((option) => ({
          label: option,
          value: option,
        })),
      };

    case "MEASURE":
      return {
        unitOptions: attribute?.measureUnits.map((unit) => ({
          label: unit,
          value: unit,
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
        maxFilters={MAX_PRODUCT_TABLE_FILTERS}
      />
    </div>
  );
};
