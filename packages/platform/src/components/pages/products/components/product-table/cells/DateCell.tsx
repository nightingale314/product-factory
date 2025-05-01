import { DateTimeCell } from "@/components/composition/table/cells/datetime";
import { BaseCellProps } from "./types";

type TextCellProps = BaseCellProps;

export const DateCell = ({ value }: TextCellProps) => {
  if (typeof value === "number") {
    return <DateTimeCell value={new Date(value)} />;
  }

  return null;
};
