import { BaseCellProps } from "./types";

type BooleanCellProps = BaseCellProps;

export const BooleanCell = ({ value }: BooleanCellProps) => {
  if (typeof value === "boolean") {
    return <div>{JSON.stringify(value)}</div>;
  }

  return null;
};
