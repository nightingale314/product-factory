import { QueryType } from "@/lib/parsers/enums";
import { QueryValue } from "@/lib/parsers/types";

export type FilterNodeOptions = {
  selectOptions?: {
    label: string;
    value: string;
  }[];
  unitOptions?: {
    label: string;
    value: string;
  }[];
};

export type FilterInput = {
  id: string;
  label: React.ReactNode;
  options?: FilterNodeOptions;
  onApply: (value: QueryValue) => void;
  renderLabel?: (label: React.ReactNode) => React.ReactNode;
};

export type FilterNodeType = {
  type: QueryType;
  key: string;
  label: string;
  fixed?: boolean;
  infoBadge?: React.ReactNode;
  options?: FilterNodeOptions;
};
