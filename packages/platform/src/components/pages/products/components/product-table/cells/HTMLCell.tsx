import { BaseCellProps } from "./types";

type HTMLCellProps = BaseCellProps;

export const HTMLCell = ({ value }: HTMLCellProps) => {
  if (typeof value === "string") {
    return value;
  }

  return null;
};
