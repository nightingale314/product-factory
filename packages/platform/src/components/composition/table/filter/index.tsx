"use client";

import { QueryValue } from "@/lib/parsers/types";
import { Chip } from "./Chip";
import { useEffect, useState } from "react";
import { AvailableFiltersMenu } from "./available-flters-menu";
import { FilterNodeType } from "./types";
import { FilterList } from "./filter-list";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MAX_FILTERS = 10;

export const TableFilter = ({
  filterValues,
  availableFilterNodes,
  hiddenKeys,
  onFilterChange,
  maxFilters = MAX_FILTERS,
}: {
  filterValues: Map<string, QueryValue>;
  availableFilterNodes: FilterNodeType[];
  hiddenKeys?: string[];
  onFilterChange: (updatedFilterValues: Map<string, QueryValue>) => void;
  maxFilters?: number;
}) => {
  const [values, setValues] = useState<Map<string, QueryValue>>(filterValues);

  const fixedFilters = availableFilterNodes.filter((f) => f.fixed);
  const dynamicFilters = availableFilterNodes.filter((f) => !f.fixed);
  const isMaxFiltersReached = values.size >= maxFilters;

  const dynamicFilterList = dynamicFilters.filter((f) => {
    const isHidden = (hiddenKeys ?? []).includes(f.key);
    const val = values.get(f.key)?.value;
    const hasValue = val !== undefined && val !== null;
    return !isHidden && hasValue;
  });

  const handleRemoveFilter = (key: string) => {
    const updatedFilterValues = new Map(values);

    updatedFilterValues.set(key, {
      key,
      type: undefined,
      operator: undefined,
      value: null,
    });

    onFilterChange(updatedFilterValues);
  };

  const handleApplyFilter = (value: QueryValue) => {
    const updatedFilterValues = new Map(values);
    updatedFilterValues.set(value.key, value);
    onFilterChange(updatedFilterValues);
  };

  useEffect(() => {
    setValues(filterValues);
  }, [filterValues]);

  console.log(dynamicFilterList);

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <FilterList
        nodeList={fixedFilters.filter(
          (f) => !(hiddenKeys ?? []).includes(f.key)
        )}
        availableFilterNodes={availableFilterNodes}
        filterValues={values}
        onRemove={handleRemoveFilter}
        onApply={handleApplyFilter}
      />
      <FilterList
        nodeList={dynamicFilterList}
        availableFilterNodes={availableFilterNodes}
        filterValues={values}
        onRemove={handleRemoveFilter}
        onApply={handleApplyFilter}
      />
      <Tooltip open={isMaxFiltersReached ? undefined : false}>
        <TooltipTrigger asChild disabled>
          <div>
            <Chip
              disabled={isMaxFiltersReached}
              label="More filters"
              popover={
                <AvailableFiltersMenu
                  availableFilterNodes={dynamicFilters}
                  filterValues={values}
                  onApply={handleApplyFilter}
                />
              }
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          Only {maxFilters} filters can be applied at a time
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
