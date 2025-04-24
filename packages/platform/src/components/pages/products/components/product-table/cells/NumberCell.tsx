import { BaseCellProps } from "./types";
import { TextCell as BaseTextCell } from "@/components/composition/table/cells/text";

type NumberCellProps = BaseCellProps;

export const NumberCell = ({ value }: NumberCellProps) => {
  if (typeof value === "number") {
    return <BaseTextCell value={value.toFixed(2).toString()} />;
  }

  return null;
};
