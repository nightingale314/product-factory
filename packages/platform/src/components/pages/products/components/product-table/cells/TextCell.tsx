import { BaseCellProps } from "./types";
import { TextCell as BaseTextCell } from "@/components/composition/table/cells/text";

type TextCellProps = BaseCellProps;

export const TextCell = ({ value }: TextCellProps) => {
  if (typeof value === "string") {
    return <BaseTextCell value={value} />;
  }

  return null;
};
