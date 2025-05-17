"use client";

import { useState } from "react";
import { FilterNodeType } from "./types";
import { QueryValue } from "@/lib/parsers/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchBar } from "@/components/composition/search-bar";
import { FilterNode } from "./nodes";
import { Button } from "@/components/ui/button";
import { ChevronLeft, PlusCircleIcon } from "lucide-react";

interface AvailableFiltersMenuProps {
  filterValues: Map<string, QueryValue>;
  availableFilterNodes: FilterNodeType[];
  onApply: (value: QueryValue) => void;
}

export const AvailableFiltersMenu = ({
  filterValues,
  availableFilterNodes,
  onApply,
}: AvailableFiltersMenuProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [inViewFilterNode, setInViewFilterNode] =
    useState<FilterNodeType | null>(null);

  const inactiveFilterNodes = availableFilterNodes.filter(
    (node) => !filterValues.has(node.key)
  );

  const filteredFilterNodes = inactiveFilterNodes.filter((node) =>
    node.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filterClickHandler = (node: FilterNodeType) => {
    setInViewFilterNode(node);
  };

  const onBackClick = () => {
    setInViewFilterNode(null);
  };

  if (inViewFilterNode) {
    return (
      <FilterNode
        id={inViewFilterNode.key}
        renderLabel={(node) => (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onBackClick}
              className=""
            >
              <ChevronLeft className="!w-4 !h-4" />
            </Button>
            {node}
          </div>
        )}
        label={inViewFilterNode.label}
        type={inViewFilterNode.type}
        value={filterValues.get(inViewFilterNode.key)}
        onApply={onApply}
      />
    );
  }

  return (
    <div>
      <SearchBar
        className="mb-4"
        placeholder="Search filter"
        onChange={setSearchQuery}
        debounceTime={100}
      />
      <ScrollArea className="h-[200px]">
        <div className="pl-1 flex flex-col gap-1">
          {filteredFilterNodes.map((node) => (
            <div
              className="text-sm flex items-center gap-2 hover:text-primary cursor-pointer"
              tabIndex={0}
              onClick={() => filterClickHandler(node)}
              key={node.key}
            >
              <PlusCircleIcon className="!w-4 !h-4" />
              {node.label}
              {node.infoBadge}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
