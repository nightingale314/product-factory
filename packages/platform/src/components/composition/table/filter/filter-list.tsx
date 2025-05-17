import { Chip } from "./Chip";
import { FilterNode } from "./nodes";
import { FilterNodeType } from "./types";
import { QueryValue } from "@/lib/parsers/types";

interface FilterListProps {
  nodeList: FilterNodeType[];
  availableFilterNodes: FilterNodeType[];
  filterValues: Map<string, QueryValue>;
  onRemove: (key: string) => void;
  onApply: (value: QueryValue) => void;
}

export const FilterList = ({
  nodeList,
  availableFilterNodes,
  filterValues,
  onRemove,
  onApply,
}: FilterListProps) => {
  return (
    <div className="flex gap-2">
      {nodeList.map((f) => {
        const options = availableFilterNodes.find(
          (n) => n.key === f.key
        )?.options;

        return (
          <Chip
            key={f.key}
            label={f.label}
            value={filterValues.get(f.key)?.value}
            type={f.type}
            popover={
              <FilterNode
                id={f.key}
                label={f.label}
                type={f.type}
                value={filterValues.get(f.key)}
                onApply={onApply}
                options={options}
              />
            }
            onRemove={() => onRemove(f.key)}
          />
        );
      })}
    </div>
  );
};
