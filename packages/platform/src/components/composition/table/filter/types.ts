import { QueryType } from "@/lib/parsers/enums";
import { QueryValue } from "@/lib/parsers/types";

export type FilterInput = {
  id: string;
  label: React.ReactNode;
  onApply: (value: QueryValue) => void;
  renderLabel?: (label: React.ReactNode) => React.ReactNode;
};

export type FilterNodeType = {
  type: QueryType;
  key: string;
  label: string;
  fixed?: boolean;
  infoBadge?: React.ReactNode;
};
