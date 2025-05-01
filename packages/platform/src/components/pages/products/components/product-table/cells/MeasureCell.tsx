import { BaseCellProps } from "./types";
import { TextCell as BaseTextCell } from "@/components/composition/table/cells/text";

type MeasureCellProps = BaseCellProps;

type MeasureAttributeValue = {
  unit: string;
  value: string;
};

export const MeasureCell = ({ value }: MeasureCellProps) => {
  if (
    value &&
    typeof value === "object" &&
    "value" in value &&
    "unit" in value
  ) {
    const measureValue = value as MeasureAttributeValue;
    const concatenatedString = `${measureValue.value} ${measureValue.unit}`;
    return <BaseTextCell value={concatenatedString} />;
  }

  return null;
};
