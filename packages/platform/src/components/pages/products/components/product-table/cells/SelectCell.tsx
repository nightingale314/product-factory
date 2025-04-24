import { TextCell as BaseTextCell } from "@/components/composition/table/cells/text";
import { BaseCellProps } from "./types";

type SelectCellProps = BaseCellProps;

export const SelectCell = ({ value }: SelectCellProps) => {
  if (typeof value === "string") {
    return <BaseTextCell value={value} />;
  }

  if (Array.isArray(value)) {
    const concatenatedString = value.join(", ");
    return <BaseTextCell value={concatenatedString} />;
  }

  return null;
};
